import Link from 'next/link';
import { notFound } from 'next/navigation';
import { lusitana } from '@/app/ui/fonts';

import { auth } from '@/auth';
import { fetchSellerById } from '@/app/lib/seller-data';
import { fetchProductsBySellerId } from '@/app/lib/product-data';
import ProductCard from '@/app/ui/products/product-card';
import Search from '@/app/ui/search';
import { isAdminEmail } from '@/app/lib/auth-constants';

// ✅ icon buttons for edit/delete
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ query?: string; page?: string }>;
};

// keep your existing page size if you already set one for pagination
const ITEMS_PER_PAGE = 6;

export default async function SellerProductsPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const sp = (await searchParams) ?? {};
  if (!id) notFound();

  const seller = await fetchSellerById(id);
  if (!seller) notFound();

  // Owner check
  const session = await auth();
  const userEmail = session?.user?.email?.toLowerCase() ?? '';
  const isAdmin = isAdminEmail(userEmail);
  const isOwner = userEmail.length > 0 && userEmail === seller.email.toLowerCase();
  const canManage = isOwner || isAdmin;

  // ALL products for this seller
  const allProducts = await fetchProductsBySellerId(seller.id, seller.email);

  // search filter (works with your Search component query param)
  const q = (sp.query ?? '').trim().toLowerCase();
  const filteredProducts =
    q.length === 0
      ? allProducts
      : allProducts.filter((p) => {
          const haystack = [p.product_name, p.category, p.description ?? '']
            .join(' ')
            .toLowerCase();
          return haystack.includes(q);
        });

  // ✅ pagination (kept minimal)
  const currentPage = Math.max(1, Number(sp.page ?? 1) || 1);
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const products = filteredProducts.slice(start, end);

  const makePageHref = (page: number) => {
    const params = new URLSearchParams();
    if (sp.query) params.set('query', sp.query);
    params.set('page', String(page));
    return `/dashboard/sellers/profile/${seller.id}/products?${params.toString()}`;
  };

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
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className={`${lusitana.className} text-2xl text-sky-800`}>
            {seller.seller_name}&apos;s Products
          </h1>
          <p className="mt-1 text-sm text-gray-600">Search and manage this seller&apos;s products.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/dashboard/sellers/profile/${seller.id}`}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white
                       transition-colors hover:bg-green-600 hover:cursor-pointer"
          >
            Back to seller
          </Link>

          {canManage ? (
            <Link
              href={`/dashboard/sellers/profile/${seller.id}/products/create`}
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
        <Search placeholder="Search this sellers products..." />
      </div>

      {/* Products grid */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.length === 0 ? (
          <p className="text-sm text-gray-600">
            No products found{q ? ` for {sp.query}` : '.'}
          </p>
        ) : (
          products.map((p) => (
            <div key={p.id} className="relative">
              {/* Card links to product detail page */}
              <ProductCard product={p} />

              {/* Owner-only edit/delete icons under the card */}
              {canManage ? (
                <div className="mt-2 flex justify-end gap-2">
                  {/* Edit */}
                  <Link
                    href={`/dashboard/sellers/profile/${seller.id}/products/${p.id}/edit`}
                    className="flex h-8 w-8 items-center justify-center rounded-md bg-white
                               shadow-sm transition hover:bg-gray-100 hover:cursor-pointer"
                    title="Edit product"
                  >
                    <PencilSquareIcon className="h-4 w-4 text-gray-700" />
                  </Link>

                  {/* Delete */}
                  <Link
                    href={`/dashboard/sellers/profile/${seller.id}/products/${p.id}/delete`}
                    className="flex h-8 w-8 items-center justify-center rounded-md bg-white
                               shadow-sm transition hover:bg-red-50 hover:cursor-pointer"
                    title="Delete product"
                  >
                    <TrashIcon className="h-4 w-4 text-red-600" />
                  </Link>
                </div>
              ) : null}
            </div>
          ))
        )}
      </div>

      {/* Pagination (minimal) */}
      {totalPages > 1 ? (
        <div className="mt-6 flex items-center justify-center gap-2">
          <Link
            href={makePageHref(Math.max(1, currentPage - 1))}
            aria-disabled={currentPage === 1}
            className={`rounded-md px-3 py-2 text-sm font-semibold ${
              currentPage === 1
                ? 'pointer-events-none bg-gray-200 text-gray-500'
                : 'bg-white text-gray-800 hover:bg-gray-100'
            }`}
          >
            Prev
          </Link>

          <p className="text-sm text-gray-700">
            Page <span className="font-semibold">{currentPage}</span> of{' '}
            <span className="font-semibold">{totalPages}</span>
          </p>

          <Link
            href={makePageHref(Math.min(totalPages, currentPage + 1))}
            aria-disabled={currentPage === totalPages}
            className={`rounded-md px-3 py-2 text-sm font-semibold ${
              currentPage === totalPages
                ? 'pointer-events-none bg-gray-200 text-gray-500'
                : 'bg-white text-gray-800 hover:bg-gray-100'
            }`}
          >
            Next
          </Link>
        </div>
      ) : null}
    </div>
  );
}
