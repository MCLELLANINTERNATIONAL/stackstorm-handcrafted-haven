import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { fetchSellerById } from '@/app/lib/seller-data';
import { formatDateToLocal } from '@/app/lib/utils';
import ReviewForm from '@/app/ui/sellers/review-form';
import {
  fetchSellerReviewsBySellerId,
  fetchSellerAverageRating,
} from '@/app/lib/review-data';

function stars(rating: number) {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SellerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) notFound();

  const seller = await fetchSellerById(id);
  if (!seller) notFound();

  const [reviews, avg] = await Promise.all([
    fetchSellerReviewsBySellerId(seller.id),
    fetchSellerAverageRating(seller.id),
  ]);

  const createdAt =
    seller.created_at
      ? typeof seller.created_at === 'string'
        ? seller.created_at
        : seller.created_at.toISOString()
      : null;

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Seller Profile</h1>

        <Link
          href="/dashboard/sellers"
          className="rounded-md border border-green-600 bg-green-600 px-3 py-2 text-sm 
          font-bold text-white hover:bg-blue-700 hover:border-green-700 
          transition-colors"
        >
          Back to directory
        </Link>
      </div>

      <section className="mb-10 flex flex-col gap-6 md:flex-row">
        <div className="relative h-56 w-56 flex-shrink-0 overflow-hidden rounded-xl border bg-gray-100">
        <Image
          src={seller.image_url || '/sellers/placeholder-seller.jpg'}
          alt={`Seller ${seller.seller_name}`}
          fill
          className="object-cover"
          sizes="224px"
          priority
        />
        </div>

        <div className="flex-1">
          <h2 className="text-3xl font-semibold">{seller.seller_name}</h2>

          {createdAt ? (
            <p className="mt-1 text-sm text-gray-600">
              Member since {formatDateToLocal(createdAt)}
            </p>
          ) : null}

          <div className="mt-4">
            <h3 className="text-sm font-semibold">Story</h3>
            {seller.story ? (
              <p className="mt-2 whitespace-pre-line text-sm text-gray-700">
                {seller.story}
              </p>
            ) : (
              <p className="mt-2 text-sm text-gray-500">
                This seller hasn’t added their story yet.
              </p>
            )}
          </div>

          <div className="mt-4">
            <h3 className="text-sm font-semibold">Contact</h3>
            <p className="mt-1 text-sm">{seller.email}</p>
            {seller.contact_no ? <p className="text-sm">{seller.contact_no}</p> : null}
          </div>
        </div>
      </section>

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
          <p className="text-sm text-gray-500">This seller has no reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="rounded-lg border bg-white p-4">
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-sm font-medium">
                    {r.customer_name ?? 'Customer'}
                    {r.product_name ? (
                      <span className="text-gray-500"> • {r.product_name}</span>
                    ) : null}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDateToLocal(r.created_at)}
                  </p>
                </div>

                <div className="text-sm font-bold">{stars(r.rating)}</div>

                {r.comment ? (
                  <p className="mt-2 text-sm text-gray-700">{r.comment}</p>
                ) : null}
              </div>
            ))}
          </div>
        )}

        <ReviewForm sellerId={seller.id} />
      </section>
    </main>
  );
}