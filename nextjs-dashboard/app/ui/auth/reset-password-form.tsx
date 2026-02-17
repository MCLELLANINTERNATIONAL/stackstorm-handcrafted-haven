'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { KeyIcon } from '@heroicons/react/24/outline';
import {
  resetPasswordWithToken,
  type ResetPasswordState,
} from '@/app/lib/password-reset-actions';

const initialState: ResetPasswordState = {
  message: '',
  success: false,
  errors: {},
};

export default function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, isPending] = useActionState(
    resetPasswordWithToken,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4 rounded-lg bg-gray-50 p-6">
      <input type="hidden" name="token" value={token} />

      <div>
        <label htmlFor="newPassword" className="mb-2 block text-sm font-medium">
          New password
        </label>
        <div className="relative">
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            minLength={8}
            required
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2"
          />
          <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
        </div>
        {state.errors?.newPassword?.map((error) => (
          <p key={error} className="mt-2 text-sm text-red-500">
            {error}
          </p>
        ))}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium">
          Confirm new password
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            minLength={8}
            required
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2"
          />
          <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
        </div>
        {state.errors?.confirmPassword?.map((error) => (
          <p key={error} className="mt-2 text-sm text-red-500">
            {error}
          </p>
        ))}
      </div>

      {state.errors?.token?.map((error) => (
        <p key={error} className="text-sm text-red-500">
          {error}
        </p>
      ))}

      {state.message ? (
        <p className={`text-sm ${state.success ? 'text-green-700' : 'text-red-600'}`}>
          {state.message}
        </p>
      ) : null}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-600 disabled:opacity-60"
        >
          {isPending ? 'Resetting…' : 'Reset Password'}
        </button>
        <Link href="/login" className="text-sm text-gray-700 underline">
          Back to login
        </Link>
      </div>
    </form>
  );
}
