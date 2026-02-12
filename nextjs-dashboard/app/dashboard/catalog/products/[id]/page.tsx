// app/dashboard/catalog/products/[id]/page.tsx

import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { auth } from '@/auth';
import { fetchProductById } from '@/app/lib/product-data';
import {
  fetchProductReviewsByProductId,
  fetchProductAverageRating,
} from '@/app/lib/product-review-data';
import ProductReviewForm from '@/app/ui/products/product-review-form';
import { formatDateToLocal } from '@/app/lib/utils';

function stars(rating: number) {
  const r = Math.max(0, Math.min(5, Math.round(rating)));
  return '★'.repeat(r) + '☆'.repeat(5 - r);
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProductDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: { from?: string; category?: string };
}) {
  const { id } = await params;
  if (!id) notFound();

  const product = await fetchProductById(id);
  if (!product) notFound();

  // If user came from a category page, keep that for breadcrumbs/back button
  const fromCategory = searchParams?.from === 'category';
  const categoryFromQuery = searchParams?.category?.trim();
  const category = categoryFromQuery || product.category;

  // Back button destination:
  // - If user came from category -> back to that category page
  // - Otherwise -> back to categories page
  const backHref =
    fromCategory && category
      ? `/dashboard/catalog/categories/${encodeURIComponent(category)}`
      : '/dashboard/catalog/categories';

  // Auth check for review form visibility
  const session = await auth();
  const canReview = Boolean(session?.user);

  const [reviews, avg] = await Promise.all([
    fetchProductReviewsByProductId(product.id),
    fetchProductAverageRating(product.id),
  ]);

  return (
    <main className="mx-auto max-w-6xl p-6">
      {/* Breadcrumbs */}
      <nav className="mb-4 text-sm text-gray-600">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/dashboard/catalog/categories" className="hover:underline">
              Categories
            </Link>
          </li>

          {fromCategory && category ? (
            <>
              <li className="text-gray-400">/</li>
              <li>
                <Link href={backHref} className="hover:underline">
                  {category}
                </Link>
              </li>
            </>
          ) : null}

          <li className="text-gray-400">/</li>
          <li className="font-semibold text-gray-900">{product.product_name}</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Product Details</h1>

        <Link
          href={backHref}
          className="rounded-md border border-green-600 bg-green-600 px-3 py-2 text-sm font-bold
                     text-white transition-colors hover:border-green-700 hover:bg-green-700"
        >
          Back to Categories
        </Link>
      </div>

      {/* Product section (profile-style layout) */}
      <section className="mb-10 flex flex-col gap-6 md:flex-row">
        <div className="relative h-56 w-56 flex-shrink-0 overflow-hidden rounded-xl border bg-white">
          <Image
            src={product.image_url || '/products/placeholder.jpg'}
            alt={product.product_name}
            fill
            className="object-contain object-center"
            sizes="224px"
            priority
          />
        </div>

        <div className="flex-1">
          <h2 className="text-3xl font-semibold">{product.product_name}</h2>

          <p className="mt-2 text-sm text-gray-600">
            Category: <span className="font-semibold">{product.category}</span>
          </p>

          <p className="mt-2 text-lg font-bold text-black">
            £{Number(product.price).toFixed(2)}
          </p>

          {product.created_at ? (
            <p className="mt-1 text-sm text-gray-600">
              Listed {formatDateToLocal(String(product.created_at))}
            </p>
          ) : null}

          <div className="mt-4">
            <h3 className="text-sm font-semibold">Description</h3>
            {product.description ? (
              <p className="mt-2 whitespace-pre-line text-sm text-gray-700">
                {product.description}
              </p>
            ) : (
              <p className="mt-2 text-sm text-gray-500">No description provided.</p>
            )}
          </div>

          <div className="mt-4">
            <h3 className="text-sm font-semibold">Contact</h3>
            <p className="mt-1 text-sm">{product.email}</p>
            {product.contact ? <p className="text-sm">{product.contact}</p> : null}
          </div>
        </div>
      </section>

      {/* Reviews section */}
      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">Customer Reviews</h2>

          <div className="rounded-full bg-yellow-200 px-4 py-2 text-sm font-bold text-black">
            Average Rating:{' '}
            <span className="font-semibold">
              {avg === null ? '—' : avg.toFixed(1)}
            </span>
          </div>
        </div>

        {reviews.length === 0 ? (
          <p className="text-sm text-gray-500">This product has no reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="rounded-lg border bg-white p-4">
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-sm font-medium">{r.customer_name ?? 'Customer'}</p>
                  <p className="text-xs text-gray-500">
                    {formatDateToLocal(String(r.created_at))}
                  </p>
                </div>

                <div className="text-sm font-bold">{stars(r.rating)}</div>

                <p className="mt-2 whitespace-pre-line text-sm text-gray-700">
                  {r.comment}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Review form: visible only if logged in */}
        <div className="mt-6">
          {canReview ? (
            <ProductReviewForm productId={product.id} />
          ) : (
            <div className="rounded-lg border bg-white p-4">
              <p className="text-sm text-gray-700">
                You must be logged in to leave a review.
              </p>
              <p className="mt-2 text-sm text-gray-600">
                Please sign in, then come back to this product page.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

