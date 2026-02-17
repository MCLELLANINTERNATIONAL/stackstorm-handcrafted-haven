import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { fetchProductById } from '@/app/lib/product-data';
import { fetchSellerById } from '@/app/lib/seller-data';
import EditProductForm from '@/app/ui/products/edit-form';
import { getSellerAccess } from '@/app/lib/authz';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type PageProps = {
  params: Promise<{ id: string; productId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id: sellerId, productId } = await params;

  if (!sellerId || !productId) notFound();

  const product = await fetchProductById(productId);
  if (!product) notFound();
  if (product.seller_id && product.seller_id !== sellerId) notFound();

  const seller = await fetchSellerById(sellerId);
  if (!seller) notFound();

  const access = await getSellerAccess(seller.id);
  if (!access.canManage) {
    redirect(`/dashboard/sellers/profile/${sellerId}/products`);
  }

  return (
    <main className="mx-auto max-w-4xl p-6">
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
            <Link
              href={`/dashboard/sellers/profile/${sellerId}/products`}
              className="hover:underline"
            >
              Products
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li className="font-semibold text-gray-900">Edit</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit Product</h1>

        <Link
          href={`/dashboard/sellers/profile/${sellerId}/products`}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white
                     transition-colors hover:bg-green-600 hover:cursor-pointer"
        >
          Back to products
        </Link>
      </div>

      {/* Form */}
      <section className="rounded-xl border bg-white p-6">
        <EditProductForm product={product} sellerId={sellerId} />
      </section>
    </main>
  );
}

