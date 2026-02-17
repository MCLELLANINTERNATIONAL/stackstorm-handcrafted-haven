import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductForm from '@/app/ui/products/create-form';
import { fetchSellerById } from '@/app/lib/seller-data';

export const dynamic = 'force-dynamic';

export default async function CreateProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) notFound();

  const seller = await fetchSellerById(id);
  if (!seller) notFound();

  return (
    <main className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Create Product for {seller.seller_name}</h1>

        <Link
          href={`/dashboard/sellers/profile/${seller.id}/products`}
          className="rounded-md border border-green-600 bg-green-600 px-3 py-2 text-sm font-bold text-white
                     transition-colors hover:bg-green-700 hover:border-green-700"
        >
          Back to products
        </Link>
      </div>

      <section className="rounded-xl border bg-white p-6">
        <ProductForm
          sellerId={seller.id}
          defaultEmail={seller.email}
          cancelHref={`/dashboard/sellers/profile/${seller.id}/products`}
        />
      </section>
    </main>
  );
}