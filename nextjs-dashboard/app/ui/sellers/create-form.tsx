'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';

import { Button } from '@/app/ui/button';
import { createSeller, type State } from '@/app/lib/seller-actions';

export default function SellerForm() {
  const initialState: State = { message: '', errors: {} };
  const [state, formAction] = useActionState(createSeller, initialState);

  return (
    <form action={formAction}>
      {/* Image URL */}
<div className="mb-4">
  <label htmlFor="imageUrl" className="mb-2 block text-sm font-medium">
    Profile image URL (optional)
  </label>
  <input
    id="imageUrl"
    name="imageUrl"
    type="text"
    placeholder="/sellers/placeholder-seller.jpg or https://..."
    className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
    aria-describedby="imageUrl-error"
  />
  <div id="imageUrl-error" aria-live="polite" aria-atomic="true">
    {state.errors?.imageUrl?.map((error: string) => (
      <p className="mt-2 text-sm text-red-500" key={error}>
        {error}
      </p>
    ))}
  </div>
</div>

      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Seller Name */}
        <div className="mb-4">
          <label htmlFor="sellerName" className="mb-2 block text-sm font-medium">
            Seller name
          </label>
          <div className="relative">
            <input
              id="sellerName"
              name="sellerName"
              type="text"
              placeholder="e.g., Kim Brown Crafts"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="sellerName-error"
            />
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>

          <div id="sellerName-error" aria-live="polite" aria-atomic="true">
            {state.errors?.sellerName?.map((error) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        {/* Category */}
        <div className="mb-4">
          <label htmlFor="category" className="mb-2 block text-sm font-medium">
            Category
          </label>

          <div className="relative">
            <select
              id="category"
              name="category"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby="category-error"
            >
              <option value="" disabled>
                Select a category
              </option>
              <option value="wood">Wood</option>
              <option value="art">Art</option>
              <option value="christmas">Christmas</option>
              <option value="home">Home</option>
              <option value="crochet">Crochet & Knitwear</option>
            </select>

            <PencilSquareIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>

          <div id="category-error" aria-live="polite" aria-atomic="true">
            {state.errors?.category?.map((error) => (
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
              placeholder="seller@email.com"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="email-error"
            />
            <EnvelopeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>

          <div id="email-error" aria-live="polite" aria-atomic="true">
            {state.errors?.email?.map((error) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="mb-4">
          <label htmlFor="contact" className="mb-2 block text-sm font-medium">
            Contact Number
          </label>
          <div className="relative">
            <input
              id="contact"
              name="contact"
              type="text"
              placeholder="+44 7xxx xxx xxx"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="contact-error"
            />
            <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>

          <div id="contact-error" aria-live="polite" aria-atomic="true">
            {state.errors?.contact?.map((error) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        {/* Seller Story */}
        <div className="mb-4">
          <label htmlFor="story" className="mb-2 block text-sm font-medium">
            Seller story
          </label>
          <div className="relative">
            <textarea
              id="story"
              name="story"
              rows={5}
              placeholder="Tell customers about your craftsmanship, inspiration, and what makes your work unique..."
              className="peer block w-full resize-none rounded-md border border-gray-200 py-2 pl-10 pr-3 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="story-error"
            />
            <PencilSquareIcon className="pointer-events-none absolute left-3 top-3 h-[18px] w-[18px] text-gray-500 peer-focus:text-gray-900" />
          </div>

          <div id="story-error" aria-live="polite" aria-atomic="true">
            {state.errors?.story?.map((error) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        {/* Optional message */}
        {state.message ? (
          <p className="mt-2 text-sm text-red-500">{state.message}</p>
        ) : null}
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/sellers"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Seller Profile</Button>
      </div>
    </form>
  );
}

