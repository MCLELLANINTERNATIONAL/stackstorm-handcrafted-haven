import Link from 'next/link';
import { notFound } from 'next/navigation';

import EditProductForm from '@/app/ui/products/edit-form'; // <-- this is the edit-form component
import { fetchProductById } from '@/app/lib/product-data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) notFound();

  const product = await fetchProductById(id);
  if (!product) notFound();

  return (
    <main className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit Product</h1>

        <Link
          href="/dashboard/sellers"
          className="inline-flex h-11 items-center justify-center rounded-md bg-gray-200 px-4 text-sm font-bold text-gray-700 hover:bg-gray-300"
        >
          Back to sellers
        </Link>
      </div>

      <section className="rounded-xl border bg-white p-6">
        <EditProductForm product={product} />
      </section>
    </main>
  );
}
