import type { Metadata } from 'next';
import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';
import { fetchProductsByCategory } from '@/app/lib/product-data';
import ProductCard from '@/app/ui/products/product-card';
import type { CategorySlug } from '@/app/lib/categories';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type PageProps = {
  params: Promise<{ category: CategorySlug }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  return { title: `Products • ${category}` };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;

  const products = await fetchProductsByCategory(category);

  return (
    <div className="w-full rounded bg-gray-100 p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className={`${lusitana.className} text-2xl text-sky-800`}>
            {category}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Browse products in <span className="font-semibold">{category}</span>
          </p>
        </div>

        <Link
          href="/dashboard/catalog/categories"
          className="rounded-md bg-gray-200 px-4 py-2 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-300"
        >
          Back to categories
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.length === 0 ? (
          <p className="text-sm text-gray-600">No products in this category.</p>
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
