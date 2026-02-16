import Link from 'next/link';
import { notFound } from 'next/navigation';

import DeleteProductForm from '@/app/ui/products/delete-form';
import { fetchProductByIdForSeller } from '@/app/lib/product-data';
import { requireSellerOwner } from '@/app/lib/seller-auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; productId: string }>;
}) {
  const { id: sellerId, productId } = await params;

  if (!sellerId || !productId) notFound();

  await requireSellerOwner(sellerId);

  const product = await fetchProductByIdForSeller(productId, sellerId);
  if (!product) notFound();

  const backHref = `/dashboard/sellers/profile/${sellerId}/products`;

  return (
    <main className="w-full rounded bg-gray-100 p-4">
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
            <Link
              href={`/dashboard/sellers/profile/${sellerId}`}
              className="hover:underline"
            >
              Profile
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li>
            <Link href={backHref} className="hover:underline">
              Products
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li className="font-semibold text-gray-900">Delete</li>
        </ol>
      </nav>

      <div className="max-w-3xl">
        <h1 className="text-2xl font-semibold">Delete Product</h1>
        <p className="mt-2 text-gray-600">
          Confirm removal of{' '}
          <span className="font-semibold">{product.product_name}</span>.
        </p>

        <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
          <DeleteProductForm
            sellerId={sellerId}
            productId={productId}
            backHref={backHref}
          />
        </div>
      </div>
    </main>
  );
}