import Link from 'next/link';
import { notFound } from 'next/navigation';
import { auth } from '@/auth';

import { fetchProductsBySeller } from '@/app/lib/product-data';
import { fetchSellerById } from '@/app/lib/seller-data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ q?: string }>;
}) {
  const { id: sellerId } = await params;
  if (!sellerId) notFound();

  const sp = (await searchParams) ?? {};
  const q = String(sp.q ?? '').trim();

  const [session, seller, products] = await Promise.all([
    auth(),
    fetchSellerById(sellerId),
    fetchProductsBySeller(sellerId, q),
  ]);

  if (!seller) notFound();

  const userEmail = session?.user?.email?.toLowerCase() ?? null;
  const isOwner = !!userEmail && seller.email?.toLowerCase() === userEmail;

  const backToProfileHref = `/dashboard/sellers/profile/${sellerId}`;

  return (
    <main className="mx-auto max-w-6xl p-6">
      {/* Breadcrumbs */}
      <nav className="mb-4 text-sm text-gray-600">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/dashboard/sellers" className="hover:underline">
              Sellers
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li>
            <Link href={backToProfileHref} className="hover:underline">
              Profile
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li className="font-semibold text-gray-900">Products</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            {seller.seller_name}&apos;s Products
          </h1>

          {!isOwner ? (
            <p className="mt-1 text-sm text-gray-600">
              Viewing as a visitor. Only the seller can add, edit, or delete products.
            </p>
          ) : null}
        </div>

        {isOwner ? (
          <Link
            href={`/dashboard/sellers/profile/${sellerId}/products/create`}
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-green-600"
          >
            + Add Product
          </Link>
        ) : null}
      </div>

      {/* Search */}
      <form
        className="mb-6"
        action={`/dashboard/sellers/profile/${sellerId}/products`}
        method="get"
      >
        <label htmlFor="q" className="sr-only">
          Search products
        </label>
        <input
          id="q"
          name="q"
          defaultValue={q}
          placeholder="Search products..."
          className="w-full rounded-md border border-gray-200 bg-white p-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
        />
      </form>

      {/* List */}
      <section className="rounded-xl border bg-white">
        {products.length === 0 ? (
          <div className="p-6 text-sm text-gray-600">
            No products found{q ? ` for “${q}”.` : '.'}
          </div>
        ) : (
          <ul className="divide-y">
            {products.map((p) => (
              <li
                key={p.id}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="font-semibold">{p.product_name}</div>
                  <div className="text-sm text-gray-600 line-clamp-1">
                    {p.description ?? ''}
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    Category: {p.category} • Price: £{Number(p.price).toFixed(2)}
                  </div>
                </div>

                {isOwner ? (
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/sellers/profile/${sellerId}/products/${p.id}/edit`}
                      className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-gray-50"
                    >
                      Edit
                    </Link>

                    <Link
                      href={`/dashboard/sellers/profile/${sellerId}/products/${p.id}/delete`}
                      className="rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </Link>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
