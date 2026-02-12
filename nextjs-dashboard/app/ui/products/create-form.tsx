'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  PencilSquareIcon,
  CurrencyPoundIcon,
} from '@heroicons/react/24/outline';

import { createProduct, type ProductState } from '@/app/lib/product-actions';

export default function ProductForm() {
  const initialState: ProductState = { message: '', errors: {} };
  const [state, formAction] = useActionState(createProduct, initialState);

  return (
    <form action={formAction}>
      {/* Image URL */}
      <div className="mb-4">
        <label htmlFor="imageUrl" className="mb-2 block text-sm font-medium">
          Product image URL (optional)
        </label>
        <input
          id="imageUrl"
          name="imageUrl"
          type="text"
          placeholder="/products/placeholder.jpg or https://..."
          className="block w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-2 placeholder:text-gray-500"
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
        {/* Product Name */}
        <div className="mb-4">
          <label htmlFor="productName" className="mb-2 block text-sm font-medium">
            Product name
          </label>
          <div className="relative">
            <input
              id="productName"
              name="productName"
              type="text"
              placeholder="e.g., Handcrafted Clock"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="productName-error"
            />
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>

          <div id="productName-error" aria-live="polite" aria-atomic="true">
            {state.errors?.productName?.map((error: string) => (
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
              <option value="crochet-knitted">Crochet &amp; Knitted</option>
            </select>

            <PencilSquareIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>

          <div id="category-error" aria-live="polite" aria-atomic="true">
            {state.errors?.category?.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="mb-4">
          <label htmlFor="price" className="mb-2 block text-sm font-medium">
            Price (£)
          </label>

          <div className="relative">
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="e.g. 24.99"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 pr-3 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="price-error"
            />
            <CurrencyPoundIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>

          <div id="price-error" aria-live="polite" aria-atomic="true">
            {state.errors?.price?.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        {/* Seller Email */}
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
              name="contact"
              type="text"
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

        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            Description
          </label>
          <div className="relative">
            <textarea
              id="description"
              name="description"
              rows={5}
              placeholder="Tell customers about your product and what makes it unique..."
              className="peer block w-full resize-none rounded-md border border-gray-200 py-2 pl-10 pr-3 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="description-error"
            />
            <PencilSquareIcon className="pointer-events-none absolute left-3 top-3 h-[18px] w-[18px] text-gray-500 peer-focus:text-gray-900" />
          </div>

          <div id="description-error" aria-live="polite" aria-atomic="true">
            {state.errors?.description?.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        {state.message ? (
          <p className="mt-2 text-sm text-red-500">{state.message}</p>
        ) : null}
      </div>

      {/* Actions */}
      <div className="mt-6 flex justify-center gap-4">
        <Link
          href="/dashboard/sellers"
          className="inline-flex h-11 w-56 items-center justify-center rounded-lg bg-gray-200 px-4 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-300"
        >
          Cancel
        </Link>

        <button
          type="submit"
          className="inline-flex h-11 w-56 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-bold text-white transition-colors hover:bg-green-600"
        >
          Add New Product
        </button>
      </div>
    </form>
  );
}