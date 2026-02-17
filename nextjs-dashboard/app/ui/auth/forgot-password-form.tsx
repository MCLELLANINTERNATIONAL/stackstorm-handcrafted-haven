'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { AtSymbolIcon } from '@heroicons/react/24/outline';
import {
  requestPasswordReset,
  type ForgotPasswordState,
} from '@/app/lib/password-reset-actions';

const initialState: ForgotPasswordState = {
  message: '',
  success: false,
  errors: {},
};

export default function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(
    requestPasswordReset,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4 rounded-lg bg-gray-50 p-6">
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium">
          Account email
        </label>
        <div className="relative">
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2"
          />
          <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
        </div>
        {state.errors?.email?.map((error) => (
          <p key={error} className="mt-2 text-sm text-red-500">
            {error}
          </p>
        ))}
      </div>

      {state.message ? (
        <p className={`text-sm ${state.success ? 'text-green-700' : 'text-red-600'}`}>
          {state.message}
        </p>
      ) : null}

      {state.resetUrl ? (
        <div className="rounded-md border border-blue-200 bg-blue-50 p-3">
          <p className="text-xs text-blue-700">
            Dev reset link:
          </p>
          <Link href={state.resetUrl} className="break-all text-sm text-blue-700 underline">
            {state.resetUrl}
          </Link>
        </div>
      ) : null}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-600 disabled:opacity-60"
        >
          {isPending ? 'Submitting…' : 'Send Reset Link'}
        </button>
        <Link href="/login" className="text-sm text-gray-700 underline">
          Back to login
        </Link>
      </div>
    </form>
  );
}
