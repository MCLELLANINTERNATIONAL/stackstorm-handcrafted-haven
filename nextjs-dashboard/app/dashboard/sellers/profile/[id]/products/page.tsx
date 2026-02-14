import Link from 'next/link';
import { notFound } from 'next/navigation';
import { lusitana } from '@/app/ui/fonts';

import { auth } from '@/auth';
import { fetchSellerById } from '@/app/lib/seller-data';
import { fetchProductsBySellerId } from '@/app/lib/product-data';
import ProductCard from '@/app/ui/products/product-card';
import Search from '@/app/ui/search';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

type PageProps = {
  params: Promise<{ id: string }> | { id: string };
  searchParams: SearchParams;
};

export default async function SellerProductsPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  if (!id) notFound();

  const seller = await fetchSellerById(id);
  if (!seller) notFound();

  // Owner check
  const session = await auth();
  const isOwner =
    Boolean(session?.user?.email) &&
    session!.user!.email!.toLowerCase() === seller.email.toLowerCase();

  // ALL products for this seller
  const allProducts = await fetchProductsBySellerId(seller.id);

  // unwrap searchParams (Next 16+)
  const sp = await searchParams;

  // search filter (works with your Search component query param)
  const queryParam = sp?.query;
  const q = (Array.isArray(queryParam) ? queryParam[0] : queryParam ?? '')
    .trim()
    .toLowerCase();

  const products =
    q.length === 0
      ? allProducts
      : allProducts.filter((p) => {
          const haystack = [p.product_name, p.category, p.description ?? '']
            .join(' ')
            .toLowerCase();
          return haystack.includes(q);
        });

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
            <Link
              href={`/dashboard/sellers/profile/${seller.id}`}
              className="hover:underline"
            >
              {seller.seller_name}
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li className="font-semibold text-gray-900">Products</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className={`${lusitana.className} text-2xl text-sky-800`}>
            {seller.seller_name}&apos;s Products
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Search and manage this seller&apos;s products.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/dashboard/sellers/profile/${seller.id}`}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white
                       transition-colors hover:bg-green-600 hover:cursor-pointer"
          >
            Back to seller
          </Link>

          {isOwner ? (
            <Link
              href={`/dashboard/sellers/profile/products/create?sellerId=${encodeURIComponent(
                seller.id,
              )}`}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white
                         transition-colors hover:bg-green-600 hover:cursor-pointer"
            >
              + Create product
            </Link>
          ) : null}
        </div>
      </div>

      {/* Search */}
      <div className="mt-4 max-w-md">
        <Search placeholder="Search this seller’s products..." />
      </div>

      {/* Products grid */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.length === 0 ? (
          <p className="text-sm text-gray-600">
            No products found{q ? ` for “${q}”.` : '.'}
          </p>
        ) : (
          products.map((p) => (
            <div key={p.id} className="relative">
              {/* Card links to product detail page */}
              <ProductCard product={p} />

              {/* Owner-only edit/delete icons under the card */}
              {isOwner ? (
                <div className="mt-2 flex justify-end gap-2">
                  <Link
                    href={`/dashboard/sellers/profile/${seller.id}/products/${p.id}/edit`}
                    className="rounded-md bg-white px-3 py-1 text-xs font-bold text-gray-800
                               shadow-sm transition hover:bg-gray-100 hover:cursor-pointer"
                    title="Edit product"
                  >
                    ✏️ Edit
                  </Link>

                  <Link
                    href={`/dashboard/sellers/profile/${seller.id}/products/${p.id}/delete`}
                    className="rounded-md bg-white px-3 py-1 text-xs font-bold text-red-600
                               shadow-sm transition hover:bg-red-50 hover:cursor-pointer"
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
