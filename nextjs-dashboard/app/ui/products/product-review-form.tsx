'use client';

import { useActionState, useState } from 'react';
import { useRouter } from 'next/navigation';
import { StarIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';

import {
  createProductReview,
  type ReviewState,
} from '@/app/lib/product-review-actions';

/**
 * Star UI pattern as seller reviews
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

export default function ProductReviewForm({ productId }: { productId: string }) {
  const router = useRouter();
  const initialState: ReviewState = { message: '', errors: {} };

  const [rating, setRating] = useState(5);

  const action = async (prev: ReviewState, formData: FormData) => {
    formData.set('rating', String(rating));
    formData.set('productId', productId);

    const res = await createProductReview(prev, formData);

    if (!res.message) router.refresh();

    return res;
  };

  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <input type="hidden" name="productId" value={productId} />

      <StarRating rating={rating} onChange={setRating} />
      {state.errors?.rating?.map((e) => (
        <p key={e} className="text-sm text-red-600">
          {e}
        </p>
      ))}

      <div>
        <label htmlFor="comment" className="sr-only">
          Review text
        </label>
        <textarea
          id="comment"
          name="comment"
          placeholder="Write your review about this product..."
          className="w-full resize-none rounded-md border p-2 text-sm"
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
        disabled={isPending}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white
        transition-colors hover:bg-green-600 disabled:opacity-60"
      >
        {isPending ? 'Submitting…' : 'Submit review'}
      </button>
    </form>
  );
}
