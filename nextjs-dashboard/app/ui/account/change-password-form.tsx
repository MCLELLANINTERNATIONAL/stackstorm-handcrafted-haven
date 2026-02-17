'use client';

import { useActionState } from 'react';
import { KeyIcon } from '@heroicons/react/24/outline';
import { changeMyPassword, type PasswordState } from '@/app/lib/user-actions';
import { Button } from '@/app/ui/button';

const initialState: PasswordState = {
  message: '',
  success: false,
  errors: {},
};

export default function ChangePasswordForm() {
  const [state, formAction, isPending] = useActionState(
    changeMyPassword,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="currentPassword" className="mb-2 block text-sm font-medium">
          Current password
        </label>
        <div className="relative">
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2"
            autoComplete="current-password"
            required
          />
          <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
        </div>
        {state.errors?.currentPassword?.map((error) => (
          <p key={error} className="mt-2 text-sm text-red-500">
            {error}
          </p>
        ))}
      </div>

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
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2"
            autoComplete="new-password"
            required
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
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2"
            autoComplete="new-password"
            required
          />
          <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
        </div>
        {state.errors?.confirmPassword?.map((error) => (
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

      <Button type="submit" aria-disabled={isPending}>
        {isPending ? 'Updating…' : 'Update Password'}
      </Button>
    </form>
  );
}
