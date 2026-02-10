'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import {
  PencilSquareIcon,
  CurrencyPoundIcon,
  EnvelopeIcon,
  PhoneIcon,
  TagIcon,
} from '@heroicons/react/24/outline';

import type { ProductForm } from '@/app/lib/definitions';
import { updateProduct, type ProductState } from '@/app/lib/product-actions';
import { Button } from '@/app/ui/button';

export default function EditProductForm({
  product,
}: {
  product: ProductForm;
}) {
  const initialState: ProductState = { message: '', errors: {} };

  const action = async (prevState: ProductState, formData: FormData) => {
    return updateProduct(product.id, prevState, formData);
  };

  const [state, formAction] = useActionState(action, initialState);

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
          defaultValue={product.image_url ?? ''}
          placeholder="/products/example.jpg or https://..."
          className="block w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
        />
        {state.errors?.imageUrl?.map((error) => (
          <p key={error} className="mt-2 text-sm text-red-500">
            {error}
          </p>
        ))}
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
              defaultValue={product.product_name}
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm"
            />
            <TagIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
          </div>
          {state.errors?.productName?.map((error) => (
            <p key={error} className="mt-2 text-sm text-red-500">
              {error}
            </p>
          ))}
        </div>

        {/* Category */}
        <div className="mb-4">
          <label htmlFor="category" className="mb-2 block text-sm font-medium">
            Category
          </label>
          <select
            id="category"
            name="category"
            defaultValue={product.category}
            className="block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm"
          >
            <option value="">Select a category</option>
            <option value="wood">Wood</option>
            <option value="art">Art</option>
            <option value="christmas">Christmas</option>
            <option value="home">Home</option>
            <option value="crochet-knitted">Crochet & Knitted</option>
          </select>
          {state.errors?.category?.map((error) => (
            <p key={error} className="mt-2 text-sm text-red-500">
              {error}
            </p>
          ))}
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
              defaultValue={product.price}
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm"
            />
            <CurrencyPoundIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
          </div>
          {state.errors?.price?.map((error) => (
            <p key={error} className="mt-2 text-sm text-red-500">
              {error}
            </p>
          ))}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Contact email
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={product.email}
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm"
            />
            <EnvelopeIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
          </div>
          {state.errors?.email?.map((error) => (
            <p key={error} className="mt-2 text-sm text-red-500">
              {error}
            </p>
          ))}
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
              defaultValue={product.contact ?? ''}
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm"
            />
            <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
          </div>
          {state.errors?.contact?.map((error) => (
            <p key={error} className="mt-2 text-sm text-red-500">
              {error}
            </p>
          ))}
        </div>

        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            defaultValue={product.description ?? ''}
            className="block w-full resize-none rounded-md border border-gray-200 p-2 text-sm"
          />
          {state.errors?.description?.map((error) => (
            <p key={error} className="mt-2 text-sm text-red-500">
              {error}
            </p>
          ))}
        </div>

        {state.message ? (
          <p className="mt-2 text-sm text-red-500">{state.message}</p>
        ) : null}
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/sellers"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
}
