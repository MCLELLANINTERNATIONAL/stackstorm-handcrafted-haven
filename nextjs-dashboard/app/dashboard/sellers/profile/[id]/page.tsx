import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { fetchSellerById } from '@/app/lib/seller-data';
import { formatDateToLocal } from '@/app/lib/utils';
import ReviewForm from '@/app/ui/sellers/review-form';
import { fetchSellerReviewsBySellerId, fetchSellerAverageRating } from '@/app/lib/review-data';

type PageProps = {
  params: { id: string };
};

function stars(rating: number) {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

export default async function SellerProfilePage({ params }: PageProps) {
  const seller = await fetchSellerById(params.id);
  if (!seller) notFound();

  const [reviews, avg] = await Promise.all([
    fetchSellerReviewsBySellerId(seller.id),
    fetchSellerAverageRating(seller.id),
  ]);

  const createdAt =
    (seller as any).created_at
      ? typeof (seller as any).created_at === 'string'
        ? (seller as any).created_at
        : (seller as any).created_at.toISOString()
      : null;

  return (
    <main className="mx-auto max-w-6xl p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Seller Profile</h1>

        <Link
          href="/dashboard/sellers"
          className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
        >
          Back to directory
        </Link>
      </div>

      {/* Seller info section */}
      <section className="mb-10 flex flex-col gap-6 md:flex-row">
        {/* Image */}
        <div className="relative h-56 w-56 flex-shrink-0 overflow-hidden rounded-xl border bg-gray-100">
          <Image
            src="/images/placeholder-seller.jpg"
            alt={`Seller ${seller.seller_name}`}
            fill
            className="object-cover"
            sizes="224px"
            priority
          />
        </div>

        {/* Details */}
        <div className="flex-1">
          <h2 className="text-3xl font-semibold">{seller.seller_name}</h2>

          {createdAt ? (
            <p className="mt-1 text-sm text-gray-600">
              Member since {formatDateToLocal(createdAt)}
            </p>
          ) : null}

          {/* Story */}
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

          {/* Contact */}
          <div className="mt-4">
            <h3 className="text-sm font-semibold">Contact</h3>
            <p className="mt-1 text-sm">{seller.email}</p>
            {seller.contact_no ? <p className="text-sm">{seller.contact_no}</p> : null}
          </div>
        </div>
      </section>

      {/* Reviews section */}
      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">Customer Reviews</h2>

          <div className="rounded-full bg-gray-50 px-4 py-2 text-sm">
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

                <div className="text-sm font-semibold">{stars(r.rating)}</div>

                {r.comment ? (
                  <p className="mt-2 text-sm text-gray-700">{r.comment}</p>
                ) : null}
              </div>
            ))}
          </div>
        )}

        {/* Add review */}
        <ReviewForm sellerId={seller.id} />
      </section>
    </main>
  );
}
