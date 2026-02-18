'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { deleteSeller } from '@/app/lib/seller-actions';

type DeleteState = {
  message: string;
};

export default function DeleteSellerForm({ sellerId }: { sellerId: string }) {
  const initialState: DeleteState = { message: '' };

  const action = async (_prevState: DeleteState, _formData: FormData) => {
    try {
      // Uses ONLY the Postgres-generated sellers.id
      await deleteSeller(sellerId);
      return { message: '' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete seller.';
      return { message: msg };
    }
  };

  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <p className="text-sm text-gray-700">
        Type <span className="font-semibold">DELETE</span> below to confirm.
      </p>

      {/* Confirmation gate to prevent accidental deletion */}
      <label htmlFor="confirm" className="sr-only">
        Confirmation text
      </label>
      <input
        id="confirm"
        name="confirm"
        placeholder="Type DELETE to confirm"
        className="w-full rounded-md border border-red-200 bg-white p-2 text-sm outline-none focus:ring-2 focus:ring-red-300"
        pattern="DELETE"
        title='Type "DELETE" to confirm.'
        required
      />

      {state.message ? <p className="text-sm text-red-700">{state.message}</p> : null}

      <div className="flex items-center gap-3">
        <Link
          href={`/dashboard/sellers/profile/${sellerId}`}
          className="rounded-md border bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
        >
          {isPending ? 'Deleting…' : 'Permanently Delete Profile'}
        </button>
      </div>

      <p className="text-xs text-gray-600">
        Deleting this seller will also remove their reviews automatically.
      </p>
    </form>
  );
}
