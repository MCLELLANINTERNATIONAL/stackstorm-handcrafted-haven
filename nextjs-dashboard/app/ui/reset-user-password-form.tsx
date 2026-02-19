"use client";

import { useActionState } from "react";
import Link from "next/link";
import { resetPasswordDirect } from "@/app/lib/user_password_reset/action";

export default function ResetPasswordForm() {
  const [message, formAction, pending] = useActionState(
    resetPasswordDirect,
    null,
  );

  // detect success message
  const isSuccess = message === "Password reset successful. You can now login.";

  return (
    <form
      action={formAction}
      className="space-y-4 bg-gray-50 p-6 rounded-lg w-[350px]"
    >
      <h1 className="text-xl font-semibold text-center">Reset Password</h1>

      <input
        type="email"
        name="email"
        required
        placeholder="Enter your email"
        className="w-full border p-2 rounded"
      />

      <input
        type="password"
        name="password"
        required
        minLength={6}
        placeholder="New password"
        className="w-full border p-2 rounded"
      />

      <input
        type="password"
        name="confirmPassword"
        required
        minLength={6}
        placeholder="Confirm password"
        className="w-full border p-2 rounded"
      />

      <button
        disabled={pending}
        className="bg-blue-500 text-white w-full py-2 rounded"
      >
        Reset Password
      </button>

      {message && (
        <p className="text-sm text-center text-gray-700">{message}</p>
      )}

      {isSuccess && (
        <div className="text-center mt-3">
          <Link
            href="/login"
            className="text-blue-500 text-sm font-medium hover:underline"
          >
            ← Return to Login
          </Link>
        </div>
      )}
    </form>
  );
}
