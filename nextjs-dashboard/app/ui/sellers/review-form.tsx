'use client';

import { useActionState, useState } from 'react';
import { useRouter } from 'next/navigation';
import { StarIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';

import { createSellerReview, type ReviewState } from '@/app/lib/review-actions';

/**
 * Native radio star rating (no ARIA roles needed)
 * - Fixes “ARIA attributes must align…” lint issues
 * - Accessible by default (tab/arrow keys work automatically)
 * - No visible label text (sr-only)
 */
function StarRating({
  rating,
  onChange,
}: {
  rating: number;
  onChange: (v: number) => void;
}) {
  return (
    <fieldset className="space-y-1">
      <legend className="sr-only">Rating</legend>

      {/* Reverse order makes hover/selection feel natural for stars */}
      <div className="flex flex-row-reverse gap-1">
        {[5, 4, 3, 2, 1].map((value) => (
          <label key={value} className="cursor-pointer">
            <span className="sr-only">
              {value} star{value > 1 ? 's' : ''}
            </span>

            <input
              type="radio"
              name="rating-radio"
              value={value}
              checked={rating === value}
              onChange={() => onChange(value)}
              className="sr-only"
            />

            <StarIcon
              className={clsx(
                'h-6 w-6',
                value <= rating ? 'text-yellow-400' : 'text-gray-300',
              )}
            />
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function ReviewForm({ sellerId }: { sellerId: string }) {
  const router = useRouter();
  const initialState: ReviewState = { message: '', errors: {} };

  const [rating, setRating] = useState(5);
  const [state, formAction] = useActionState(createSellerReview, initialState);

  return (
    <form
      action={async (fd) => {
        // Inject star rating into form data (server action expects "rating")
        fd.set('rating', String(rating));

        // Ensure sellerId is present (DB-generated sellers.id)
        fd.set('sellerId', sellerId);

        await formAction(fd);

        // Refresh UI after submit (so new review appears)
        router.refresh();
      }}
      className="mt-6 space-y-4"
    >
      {/* Seller id is DB-generated; user never edits this */}
      <input type="hidden" name="sellerId" value={sellerId} />

      <StarRating rating={rating} onChange={setRating} />
      {state.errors?.rating?.map((e) => (
        <p key={e} className="text-sm text-red-600">
          {e}
        </p>
      ))}

      <div>
        <label htmlFor="productName" className="sr-only">
          Seller or Product name
        </label>
        <input
          id="productName"
          name="productName"
          placeholder="Seller or Product name (optional)"
          className="w-full rounded-md border p-2 text-sm"
        />
        {state.errors?.productName?.map((e) => (
          <p key={e} className="text-sm text-red-600">
            {e}
          </p>
        ))}
      </div>

      <div>
        <label htmlFor="comment" className="sr-only">
          Review text
        </label>
        <textarea
          id="comment"
          name="comment"
          placeholder="Write your review about the seller..."
          className="w-full rounded-md border p-2 text-sm"
          rows={4}
          required
        />
        {state.errors?.comment?.map((e) => (
          <p key={e} className="text-sm text-red-600">
            {e}
          </p>
        ))}
      </div>

      {state.message ? (
        <p className="text-sm text-red-600">{state.message}</p>
      ) : null}

      <button
        type="submit"
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white
        transition-colors hover:bg-green-600"
      >
        Submit review
      </button>
    </form>
  );
}
