import type { Metadata } from 'next';
import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';
import {
  fetchProductsByCategoryPaginated,
  fetchCategoryPages,
  fetchFilteredProducts,
  fetchProductsPages,
} from '@/app/lib/product-data';
import ProductCard from '@/app/ui/products/product-card';
import Pagination from '@/app/ui/category/pagination';
import type { CategorySlug } from '@/app/lib/categories';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type PageProps = {
  // ✅ allow "all-products" (and "all" if needed) to come through this route
  params: Promise<{ category: CategorySlug | 'all' | 'all-products' }>;
  // ✅ Next 16 can treat searchParams as a Promise
  searchParams?: Promise<{ page?: string; query?: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category } = await params;
  const isAll = category === 'all' || category === 'all-products';
  return { title: isAll ? 'Products • All Products' : `Products • ${category}` };
}

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps) {
  const { category } = await params;
  const sp = (await searchParams) ?? {};
  const currentPage = Number(sp.page ?? '1') || 1;

  const isAll = category === 'all' || category === 'all-products';

  const [products, totalPages] = await Promise.all(
    isAll
      ? [
          fetchFilteredProducts(sp.query ?? '', currentPage),
          fetchProductsPages(sp.query ?? ''),
        ]
      : [
          fetchProductsByCategoryPaginated(category as CategorySlug, currentPage),
          fetchCategoryPages(category as CategorySlug),
        ],
  );

  return (
    <div className="w-full rounded bg-gray-100 p-4">
      {/* 🧭 Breadcrumbs */}
      <nav className="mb-4 text-sm text-gray-600">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/app" className="hover:underline">
              Categories
            </Link>
          </li>

          <li className="text-gray-400">/</li>

          <li>
            <Link href="/catalog" className="hover:underline">
              Catalog
            </Link>
          </li>

          <li className="text-gray-400">/</li>

          <li>
            <Link href="/catalog/categories" className="hover:underline">
              Categories
            </Link>
          </li>

          <li className="text-gray-400">/</li>

          <li className="font-semibold text-gray-900 capitalize">
            {isAll ? 'All Products' : category}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className={`${lusitana.className} text-2xl text-sky-800 capitalize`}>
            {isAll ? 'All Products' : category}
          </h1>

          <p className="mt-1 text-sm text-gray-600">
            {isAll ? (
              <>Browse all products</>
            ) : (
              <>
                Browse products in{' '}
                <span className="font-semibold capitalize">{category}</span>
              </>
            )}
          </p>
        </div>

        <Link
          href="/catalog"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white
                     transition-colors hover:bg-green-600 hover:cursor-pointer"
        >
          Back to catalog
        </Link>
      </div>

      {/* Grid */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.length === 0 ? (
          <p className="text-sm text-gray-600">
            {isAll ? 'No products found.' : 'No products in this category.'}
          </p>
        ) : (
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              categoryFrom={isAll ? ('all-products' as any) : (category as CategorySlug)}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 ? (
        <div className="mt-6 flex justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      ) : null}
    </div>
  );
}
