import Link from 'next/link';
import ProductForm from '@/app/ui/product/create-form';

export const dynamic = 'force-dynamic';

export default function CreateProductPage() {
  return (
    <main className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Create Product</h1>

        <Link
          href="/dashboard/products"
          className="rounded-md border border-green-600 bg-green-600 px-3 py-2 text-sm font-bold text-white
                     transition-colors hover:bg-green-700 hover:border-green-700"
        >
          Back to products
        </Link>
      </div>

      <section className="rounded-xl border bg-white p-6">
        <ProductForm />
      </section>
    </main>
  );
}
