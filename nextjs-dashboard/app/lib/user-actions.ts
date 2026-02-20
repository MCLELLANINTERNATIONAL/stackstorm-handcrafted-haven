'use server';

import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { auth } from '@/auth';
import { normalizeEmail } from '@/app/lib/auth-constants';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export type PasswordState = {
  message: string;
  success?: boolean;
  errors?: {
    currentPassword?: string[];
    newPassword?: string[];
    confirmPassword?: string[];
  };
};

export async function changeMyPassword(
  _prevState: PasswordState,
  formData: FormData,
): Promise<PasswordState> {
  const session = await auth();
  const userEmail = normalizeEmail(session?.user?.email);

  if (!userEmail) {
    return {
      message: 'You must be logged in to change your password.',
      success: false,
    };
  }

  const currentPassword = String(formData.get('currentPassword') ?? '').trim();
  const newPassword = String(formData.get('newPassword') ?? '').trim();
  const confirmPassword = String(formData.get('confirmPassword') ?? '').trim();
  const errors: NonNullable<PasswordState['errors']> = {};

  if (!currentPassword) {
    errors.currentPassword = ['Current password is required.'];
  }

  if (!newPassword) {
    errors.newPassword = ['New password is required.'];
  } else if (newPassword.length < 6) {
    errors.newPassword = ['New password must be at least 6 characters.'];
  }

  if (!confirmPassword) {
    errors.confirmPassword = ['Please confirm the new password.'];
  } else if (newPassword && newPassword !== confirmPassword) {
    errors.confirmPassword = ['Passwords do not match.'];
  }

  if (currentPassword && newPassword && currentPassword === newPassword) {
    errors.newPassword = ['New password must be different from current password.'];
  }

  if (Object.keys(errors).length > 0) {
    return {
      message: 'Please fix the password errors below.',
      errors,
      success: false,
    };
  }

  try {
    const users = await sql<{ id: string; password: string }[]>`
      SELECT id, password
      FROM users
      WHERE LOWER(email) = ${userEmail}
      LIMIT 1
    `;

    const user = users[0];
    if (!user) {
      return {
        message: 'No login account was found for this session.',
        success: false,
      };
    }

    const isCurrentValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentValid) {
      return {
        message: 'Current password is incorrect.',
        errors: { currentPassword: ['Current password is incorrect.'] },
        success: false,
      };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await sql`
      UPDATE users
      SET password = ${hashedPassword}
      WHERE id = ${user.id}::uuid
    `;

    return {
      message: 'Password updated successfully.',
      success: true,
      errors: {},
    };
  } catch (error) {
    console.error('DB ERROR changeMyPassword:', error);
    return {
      message: 'Database error: failed to update password.',
      success: false,
    };
  }
}


