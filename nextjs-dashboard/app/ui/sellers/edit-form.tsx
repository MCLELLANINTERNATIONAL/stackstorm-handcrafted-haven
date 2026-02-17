'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  PencilSquareIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';

import { Button } from '@/app/ui/button';
import type { SellerForm } from '@/app/lib/definitions';
import { updateSeller, type State } from '@/app/lib/seller-actions';

/**
 * MATCHES NEW sactions.ts
 * - updateSeller(id, prevState, formData) expects form fields:
 *   sellerName, category, email, contact, story
 * - Postgres generates sellers.id and created_at (no seller_id, no date field)
 */
export default function EditSellerProfileForm({ seller }: { seller: SellerForm }) {
  const initialState: State = { message: '', errors: {} };

  const action = async (prevState: State, formData: FormData) => {
    // ✅ Uses ONLY Postgres-generated UUID
    return updateSeller(seller.id!, prevState, formData);
  };

  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction}>
      <div className="mb-4">
  <label htmlFor="imageUrl" className="mb-2 block text-sm font-medium">
    Profile image URL (optional)
  </label>
  <input
    id="imageUrl"
    name="imageUrl"
    type="text"
    defaultValue={seller.image_url ?? ''}
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
              defaultValue={seller.seller_name ?? ''}
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
              defaultValue={seller.category ?? ''}
              aria-describedby="category-error"
            >
              <option value="" disabled>
                Select a category
              </option>
              <option value="wood">Wood</option>
              <option value="art">Art</option>
              <option value="christmas">Christmas</option>
              <option value="home">Home</option>
              <option value="crochet-knitted">Crochet-Knitted</option>
              
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
              defaultValue={seller.email ?? ''}
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
            Contact number
          </label>
          <div className="relative">
            <input
              id="contact"
              name="contact"
              type="text"
              defaultValue={seller.contact_no ?? ''}
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

        {/* Optional Password Reset */}
        <div className="mb-4">
          <label htmlFor="password" className="mb-2 block text-sm font-medium">
            New login password (optional)
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type="password"
              minLength={8}
              placeholder="Leave blank to keep current password"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="password-error"
            />
            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          <div id="password-error" aria-live="polite" aria-atomic="true">
            {state.errors?.password?.map((error) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium">
            Confirm new login password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              minLength={8}
              placeholder="Re-enter new password"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="confirmPassword-error"
            />
            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          <div id="confirmPassword-error" aria-live="polite" aria-atomic="true">
            {state.errors?.confirmPassword?.map((error) => (
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
              defaultValue={seller.story ?? ''}
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

        {/* Message */}
        {state.message ? (
          <p className="mt-2 text-sm text-red-500" aria-live="polite" aria-atomic="true">
            {state.message}
          </p>
        ) : null}
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/sellers"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
}

