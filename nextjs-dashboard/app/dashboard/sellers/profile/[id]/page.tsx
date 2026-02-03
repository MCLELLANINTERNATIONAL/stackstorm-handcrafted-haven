import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { fetchSellerById } from '@/app/lib/seller-data';
import { formatDateToLocal } from '@/app/lib/utils';
import ReviewForm from '@/app/ui/sellers/review-form';

type PageProps = {
  params: { id: string };
};

/* TEMP review type + fetch (replace with DB later) */
type Review = {
  id: string;
  customer_name: string;
  content: string;
  created_at: string;
};

async function fetchSellerReviews(sellerId: string): Promise<Review[]> {
  return [
    {
      id: '1',
      customer_name: 'Jane Doe',
      content: 'Beautiful craftsmanship and great communication.',
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      customer_name: 'John Smith',
      content: 'High quality product — exceeded expectations!',
      created_at: new Date().toISOString(),
    },
  ];
}

export default async function SellerProfilePage({ params }: PageProps) {
  const seller = await fetchSellerById(params.id);
  if (!seller) notFound();

  const reviews = await fetchSellerReviews(seller.id);

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
            alt={`Seller ${seller.seller_id}`}
            fill
            className="object-cover"
            sizes="224px"
            priority
          />
        </div>

        {/* Details */}
        <div className="flex-1">
          <h2 className="text-3xl font-semibold">{seller.seller_id}</h2>

          <p className="mt-1 text-sm text-gray-600">
            Member since{' '}
            {formatDateToLocal(
              typeof seller.created_at === 'string'
                ? seller.created_at
                : seller.created_at.toISOString()
            )}
          </p>

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
            <p className="text-sm">{seller.contact_no}</p>
          </div>

          {/* Products link */}
           {/*<div className="mt-6">
            <Link
              href={`/dashboard/products?seller=${seller.id}`}
              className="inline-block rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-gray-800"
            >
              View Products
            </Link>
          </div>*/}
        </div>
      </section>

      {/* Reviews section */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">Customer Reviews</h2>

        {reviews.length === 0 ? (
          <p className="text-sm text-gray-500">
            This seller has no reviews yet.
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-lg border bg-white p-4"
              >
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-sm font-medium">
                    {review.customer_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDateToLocal(review.created_at)}
                  </p>
                </div>

                <p className="text-sm text-gray-700">
                  {review.content}
                </p>
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

