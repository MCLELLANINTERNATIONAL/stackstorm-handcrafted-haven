// app/dashboard/catalog/products/page.tsx
import { lusitana } from '@/app/ui/fonts';
import Link from 'next/link';
import ProductCard from '@/app/ui/products/product-card';
import { fetchProducts } from '@/app/lib/product-data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page() {
  const products = await fetchProducts();

  return (
    <div className="w-full rounded bg-gray-100 p-4">
      {/* Header */}
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl text-sky-800`}>
          All Products
        </h1>

        <Link
          href="/dashboard/catalog/categories"
          className="rounded-md bg-gray-200 px-4 py-2 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-300"
        >
          Back to categories
        </Link>
      </div>

      {/* Grid */}
      <div className="mt-6 mx-auto grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.length === 0 ? (
          <p className="text-sm text-gray-600">No products found.</p>
        ) : (
          products.map((p) => <ProductCard key={p.id} product={p} />)
        )}
      </div>
    </div>
  );
}

