import { notFound } from 'next/navigation';
import {
  fetchSellerReviewsBySellerId,
  fetchSellerAverageRating,
} from '@/app/lib/review-data';

function stars(rating: number) {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

export default async function SellerReviewsPage({
  params,
}: {
  params: { id: string };
}) {
  const sellerId = params.id;
  if (!sellerId) notFound();

  const [reviews, avg] = await Promise.all([
    fetchSellerReviewsBySellerId(sellerId),
    fetchSellerAverageRating(sellerId),
  ]);

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-semibold">Seller Reviews</h1>
      <p className="mt-2 text-gray-600">
        View ratings and written feedback customers left for this seller.
      </p>

      <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">Latest Reviews</h2>

          <div className="rounded-full bg-gray-50 px-4 py-2 text-sm">
            Average Rating:{' '}
            <span className="font-semibold">
              {avg === null ? '—' : avg.toFixed(1)}
            </span>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {reviews.length === 0 ? (
            <p className="text-sm text-gray-600">No reviews yet.</p>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="rounded-xl border p-4">
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="font-medium">
                      {r.product_name ?? 'Product'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {r.customer_name ? `by ${r.customer_name} • ` : ''}
                      {new Date(r.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="text-sm font-semibold">
                    {stars(r.rating)}
                  </div>
                </div>

                {r.comment && (
                  <p className="mt-3 text-sm text-gray-700">{r.comment}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}