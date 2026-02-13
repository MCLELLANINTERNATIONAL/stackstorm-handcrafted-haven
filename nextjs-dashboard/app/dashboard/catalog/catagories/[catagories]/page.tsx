import { lusitana } from '@/app/ui/fonts';
import Link from 'next/link';
import { fetchProductsByCategory } from '@/app/lib/product-data';
import ProductCard from '@/app/ui/products/product-card';
import type { CategorySlug } from '@/app/lib/categories';

export const dynamic = 'force-dynamic';

export default async function CategoryPage({
  params,
}: {
  params: { category: CategorySlug };
}) {
  const { category } = params;
  const products = await fetchProductsByCategory(category);

  return (
    <div className="w-full rounded bg-gray-100 p-4">
      <div className="flex items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl text-sky-800`}>
          {category}
        </h1>

        <Link
          href="/dashboard/catalog/categories"
          className="rounded-md bg-gray-200 px-4 py-2 text-sm font-bold"
        >
          Back to categories
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.length === 0 ? (
          <p className="text-sm text-gray-600">
            No products in this category.
          </p>
        ) : (
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              categoryFrom={category}
            />
          ))
        )}
      </div>
    </div>
  );
}
