"use server";

import postgres from "postgres";
import bcrypt from "bcrypt";
import { z } from "zod";
import { normalizeEmail } from "@/app/lib/auth-constants";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function resetPasswordDirect(
  _: string | null,
  formData: FormData,
) {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  });

  const parsed = schema.safeParse({
    email: normalizeEmail(String(formData.get("email"))),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return "Invalid input.";
  }

  const { email, password, confirmPassword } = parsed.data;

  if (password !== confirmPassword) {
    return "Passwords do not match.";
  }

  // check user exists
  const user = await sql`
    SELECT id FROM users
    WHERE LOWER(TRIM(email)) = ${email}
    LIMIT 1
  `;

  if (!user.length) {
    return "User not found.";
  }

  // hash new password
  const hashedPassword = await bcrypt.hash(password, 10);

  // update password
  await sql`
    UPDATE users
    SET password = ${hashedPassword}
    WHERE id = ${user[0].id}
  `;

  return "Password reset successful. You can now login.";
}
