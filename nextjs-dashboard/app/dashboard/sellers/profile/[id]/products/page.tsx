import Link from 'next/link';
import { notFound } from 'next/navigation';
import { lusitana } from '@/app/ui/fonts';

import { auth } from '@/auth';
import { fetchSellerById } from '@/app/lib/seller-data';
import { fetchProductsBySellerIdAndCategory } from '@/app/lib/product-data';
import ProductCard from '@/app/ui/products/product-card';
import type { CategorySlug } from '@/app/lib/categories';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SellerProductsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) notFound();

  const seller = await fetchSellerById(id);
  if (!seller) notFound();

  // owner check
  const session = await auth();
  const isOwner =
    Boolean(session?.user?.email) &&
    session!.user!.email!.toLowerCase() === seller.email.toLowerCase();

  // Only this seller's products AND only products matching seller.category
  const products = await fetchProductsBySellerIdAndCategory(seller.id, seller.category as CategorySlug);

  return (
    <div className="w-full rounded bg-gray-100 p-4">
      {/* Breadcrumbs */}
      <nav className="mb-4 text-sm text-gray-600">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/dashboard" className="hover:underline">
              Dashboard
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li>
            <Link href="/dashboard/sellers" className="hover:underline">
              Sellers
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li>
            <Link href={`/dashboard/sellers/profile/${seller.id}`} className="hover:underline">
              {seller.seller_name}
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li className="font-semibold text-gray-900">Products</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className={`${lusitana.className} text-2xl text-sky-800`}>
            {seller.seller_name}&apos;s Products
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Category:{' '}
            <span className="font-semibold capitalize">{seller.category}</span>
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/dashboard/sellers/profile/${seller.id}`}
            className="rounded-md bg-gray-200 px-4 py-2 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-300"
          >
            Back to seller
          </Link>

          {/* Create product button (only show for owner) */}
          {isOwner ? (
            <Link
              href={`/dashboard/sellers/profile/products/create?sellerId=${encodeURIComponent(
                seller.id,
              )}&category=${encodeURIComponent(seller.category)}`}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white
                         transition-colors hover:bg-green-600 hover:cursor-pointer"
            >
              + Create product
            </Link>
          ) : null}
        </div>
      </div>

      {/* Products grid */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.length === 0 ? (
          <p className="text-sm text-gray-600">
            No products found for this seller in this category.
          </p>
        ) : (
          products.map((p) => (
            <div key={p.id} className="relative">
              {/* Card links to product detail page */}
              <ProductCard product={p} categoryFrom={seller.category} />

              {/* Owner-only edit/delete icons under the card */}
              {isOwner ? (
                <div className="mt-2 flex justify-end gap-2">
                  <Link
                    href={`/dashboard/sellers/profile/products/${p.id}/edit`}
                    className="rounded-md bg-white px-3 py-1 text-xs font-bold text-gray-800
                               shadow-sm transition hover:bg-gray-100"
                    title="Edit product"
                  >
                    ✏️ Edit
                  </Link>

                  <Link
                    href={`/dashboard/sellers/profile/products/${p.id}/delete?sellerId=${encodeURIComponent(
                      seller.id,
                    )}`}
                    className="rounded-md bg-white px-3 py-1 text-xs font-bold text-red-600
                               shadow-sm transition hover:bg-red-50"
                    title="Delete product"
                  >
                    🗑️ Delete
                  </Link>
                </div>
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

