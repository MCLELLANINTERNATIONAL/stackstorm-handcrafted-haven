import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchSellerById } from '@/app/lib/seller-data';
import { fetchProductsBySellerId } from '@/app/lib/product-data';
import { formatDateToLocal } from '@/app/lib/utils';

type PageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const seller = await fetchSellerById(id);
  return {
    title: seller ? `Seller ‚Ä¢ ${seller.seller_name}` : 'Seller',
  };
}

export default async function PublicSellerProfilePage({ params }: PageProps) {
  const { id } = await params;
  if (!id) notFound();

  const seller = await fetchSellerById(id);
  if (!seller) notFound();

  const sellerProducts = await fetchProductsBySellerId(seller.id, seller.email);
  const createdAt =
    typeof seller.created_at === 'string'
      ? seller.created_at
      : seller.created_at?.toISOString();

  return (
    <main className="mx-auto max-w-6xl p-6">
      <nav className="mb-4 text-sm text-gray-600">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/catalog" className="hover:underline">
              Catalog
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li className="font-semibold text-gray-900">Seller Profile</li>
        </ol>
      </nav>

      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Seller Profile</h1>
        <Link
          href="/catalog"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-green-600"
        >
          Back to Catalog
        </Link>
      </div>

      <section className="mb-8 flex flex-col gap-6 md:flex-row">
        <div className="relative h-56 w-56 flex-shrink-0 overflow-hidden rounded-xl border bg-white">
          <Image
            src={seller.image_url || '/sellers/placeholder-seller.jpg'}
            alt={seller.seller_name}
            fill
            className="object-cover"
            sizes="224px"
            priority
          />
        </div>

        <div className="flex-1">
          <h2 className="text-3xl font-semibold">{seller.seller_name}</h2>
          <p className="mt-2 text-sm text-gray-600">
            Category: <span className="font-semibold">{seller.category}</span>
          </p>
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
                This seller has not added a story yet.
              </p>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={`/catalog/sellers/${seller.id}/products`}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-green-600"
            >
              View Seller Products
            </Link>
            <p className="self-center text-sm text-gray-600">
              {sellerProducts.length} products listed
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
