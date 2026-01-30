'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarDaysIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';

import { Button } from '@/app/ui/button';
import type { SellerField, SellerForm } from '@/app/lib/definitions';
import { updateSeller, type State } from '@/app/lib/sactions';

export default function EditSellerProfileForm({
  seller,
  sellers,
}: {
  seller: SellerForm;
  sellers: SellerField[];
}) {
  const initialState: State = { message: null, errors: {} };

  // Bind the seller id so the server action signature matches useActionState
  const updateSellerWithId = updateSeller.bind(null, seller.id);
  const [state, formAction] = useActionState(updateSellerWithId, initialState);

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Seller */}
        <div className="mb-4">
          <label htmlFor="seller" className="mb-2 block text-sm font-medium">
            Choose seller
          </label>
          <div className="relative">
            <select
              id="seller"
              name="sellerId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={seller.seller_id}
              aria-describedby="sellerId-error"
            >
              <option value="" disabled>
                Select a seller
              </option>
              {sellers.map((s) => (
                <option key={s.id} value={s.seller_id}>
                  {s.seller_id}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>

          <div id="sellerId-error" aria-live="polite" aria-atomic="true">
            {state.errors?.sellerId?.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Seller email
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={seller.email}
              placeholder="seller@email.com"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="email-error"
            />
            <EnvelopeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>

          <div id="email-error" aria-live="polite" aria-atomic="true">
            {state.errors?.email?.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="mb-4">
          <label htmlFor="contact" className="mb-2 block text-sm font-medium">
            Contact number
          </label>
          <div className="relative">
            <input
              id="contact"
              name="contact_no"
              type="text"
              defaultValue={seller.contact_no}
              placeholder="+44 7xxx xxx xxx"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="contact-error"
            />
            <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>

          <div id="contact-error" aria-live="polite" aria-atomic="true">
            {state.errors?.contact?.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        {/* Date */}
        <div className="mb-4">
          <label htmlFor="date" className="mb-2 block text-sm font-medium">
            Date created
          </label>
          <div className="relative">
            <input
              id="date"
              name="date"
              type="date"
              // If created_at comes back as a Date, convert before passing here.
              // If it's already "YYYY-MM-DD", you're good.
              defaultValue={
                seller.created_at
                  ? new Date(seller.created_at).toISOString().slice(0, 10)
                  : ''
              }

              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="date-error"
            />
            <CalendarDaysIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>

          <div id="date-error" aria-live="polite" aria-atomic="true">
            {state.errors?.date?.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        {/* Story */}
        <div className="mb-4">
          <label htmlFor="story" className="mb-2 block text-sm font-medium">
            Seller story
          </label>
          <div className="relative">
            <textarea
              id="story"
              name="story"
              rows={5}
              defaultValue={seller.story}
              placeholder="Tell customers about your craftsmanship, inspiration, and what makes your work unique..."
              className="peer block w-full resize-none rounded-md border border-gray-200 py-2 pl-10 pr-3 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="story-error"
            />
            <PencilSquareIcon className="pointer-events-none absolute left-3 top-3 h-[18px] w-[18px] text-gray-500 peer-focus:text-gray-900" />
          </div>

          <div id="story-error" aria-live="polite" aria-atomic="true">
            {state.errors?.story?.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        {/* Message */}
        <div aria-live="polite" aria-atomic="true">
          {state.message && (
            <p className="mt-2 text-sm text-red-500">{state.message}</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/sellers/profile"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
}
