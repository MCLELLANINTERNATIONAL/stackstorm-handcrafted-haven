'use server';

import bcrypt from 'bcrypt';
import crypto from 'crypto';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const TOKEN_TTL_MINUTES = 60;

export type ForgotPasswordState = {
  message: string;
  success?: boolean;
  errors?: { email?: string[] };
  resetUrl?: string;
};

export type ResetPasswordState = {
  message: string;
  success?: boolean;
  errors?: {
    token?: string[];
    newPassword?: string[];
    confirmPassword?: string[];
  };
};

async function ensurePasswordResetTable() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMP NOT NULL,
      used_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user
    ON password_reset_tokens (user_id, created_at DESC)
  `;
}

function normalizeEmail(email: FormDataEntryValue | null) {
  return String(email ?? '').trim().toLowerCase();
}

function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function requestPasswordReset(
  _prevState: ForgotPasswordState,
  formData: FormData,
): Promise<ForgotPasswordState> {
  const email = normalizeEmail(formData.get('email'));

  if (!email) {
    return {
      success: false,
      message: 'Please enter your email.',
      errors: { email: ['Email is required.'] },
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      success: false,
      message: 'Please enter a valid email.',
      errors: { email: ['Please enter a valid email address.'] },
    };
  }

  try {
    await ensurePasswordResetTable();

    const users = await sql<{ id: string; email: string }[]>`
      SELECT id, email
      FROM users
      WHERE LOWER(email) = ${email}
      LIMIT 1
    `;

    const user = users[0];

    // Always return a generic success to avoid account enumeration.
    const genericMessage =
      'If an account exists for that email, a reset link has been generated.';

    if (!user) {
      return { success: true, message: genericMessage };
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + TOKEN_TTL_MINUTES * 60 * 1000);

    await sql.begin(async (tx) => {
      await tx`
        DELETE FROM password_reset_tokens
        WHERE user_id = ${user.id}::uuid
          AND used_at IS NULL
      `;

      await tx`
        INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
        VALUES (${user.id}::uuid, ${tokenHash}, ${expiresAt.toISOString()})
      `;
    });

    const resetUrl = `/reset-password?token=${encodeURIComponent(rawToken)}`;

    if (process.env.NODE_ENV !== 'production') {
      return {
        success: true,
        message:
          `${genericMessage} (Dev mode: use the link below to continue reset.)`,
        resetUrl,
      };
    }

    return { success: true, message: genericMessage };
  } catch (error) {
    console.error('DB ERROR requestPasswordReset:', error);
    return {
      success: false,
      message: 'Unable to process password reset right now.',
    };
  }
}

export async function resetPasswordWithToken(
  _prevState: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  const token = String(formData.get('token') ?? '').trim();
  const newPassword = String(formData.get('newPassword') ?? '').trim();
  const confirmPassword = String(formData.get('confirmPassword') ?? '').trim();
  const errors: NonNullable<ResetPasswordState['errors']> = {};

  if (!token) {
    errors.token = ['Reset token is missing or invalid.'];
  }

  if (!newPassword) {
    errors.newPassword = ['New password is required.'];
  } else if (newPassword.length < 8) {
    errors.newPassword = ['New password must be at least 8 characters.'];
  }

  if (!confirmPassword) {
    errors.confirmPassword = ['Please confirm your new password.'];
  } else if (newPassword !== confirmPassword) {
    errors.confirmPassword = ['Passwords do not match.'];
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: 'Please fix the errors below.',
      errors,
    };
  }

  try {
    await ensurePasswordResetTable();

    const tokenHash = hashToken(token);
    const rows = await sql<{ id: string; user_id: string; expires_at: string }[]>`
      SELECT id, user_id, expires_at
      FROM password_reset_tokens
      WHERE token_hash = ${tokenHash}
        AND used_at IS NULL
      LIMIT 1
    `;

    const resetRow = rows[0];
    if (!resetRow) {
      return {
        success: false,
        message: 'This reset link is invalid or has already been used.',
        errors: { token: ['Invalid reset token.'] },
      };
    }

    if (new Date(resetRow.expires_at).getTime() < Date.now()) {
      return {
        success: false,
        message: 'This reset link has expired. Request a new one.',
        errors: { token: ['Reset token expired.'] },
      };
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await sql.begin(async (tx) => {
      await tx`
        UPDATE users
        SET password = ${passwordHash}
        WHERE id = ${resetRow.user_id}::uuid
      `;

      await tx`
        UPDATE password_reset_tokens
        SET used_at = NOW()
        WHERE user_id = ${resetRow.user_id}::uuid
          AND used_at IS NULL
      `;
    });

    return {
      success: true,
      message: 'Password reset successfully. You can now log in.',
    };
  } catch (error) {
    console.error('DB ERROR resetPasswordWithToken:', error);
    return {
      success: false,
      message: 'Unable to reset password right now.',
    };
  }
}