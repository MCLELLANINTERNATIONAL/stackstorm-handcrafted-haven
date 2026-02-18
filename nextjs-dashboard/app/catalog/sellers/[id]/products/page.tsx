import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchSellerById } from '@/app/lib/seller-data';
import {
  fetchProductsForSellerPage,
  fetchProductsForSellerPagesCount,
} from '@/app/lib/product-data';
import ProductCard from '@/app/ui/products/product-card';
import Pagination from '@/app/ui/category/pagination';
import ProductFilters from '@/app/ui/products/product-filters';
import { CATEGORIES } from '@/app/lib/categories';

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{
    page?: string;
    q?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const seller = await fetchSellerById(id);
  return {
    title: seller ? `${seller.seller_name} • Products` : 'Seller Products',
  };
}

export default async function PublicSellerProductsPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const sp = (await searchParams) ?? {};
  if (!id) notFound();

  const seller = await fetchSellerById(id);
  if (!seller) notFound();

  const currentPage = Math.max(1, Number(sp.page ?? '1') || 1);
  const q = String(sp.q ?? '').trim();
  const categoryFilter = String(sp.category ?? 'all').trim().toLowerCase();
  const parsedMin = Number(sp.minPrice ?? '0');
  const parsedMax = Number(sp.maxPrice ?? '500');
  const minPrice = Number.isFinite(parsedMin) ? parsedMin : 0;
  const maxPrice = Number.isFinite(parsedMax) ? parsedMax : 500;

  const [products, totalPages] = await Promise.all([
    fetchProductsForSellerPage({
      sellerId: seller.id,
      sellerEmail: seller.email,
      currentPage,
      q,
      categoryFilter,
      minPrice,
      maxPrice,
    }),
    fetchProductsForSellerPagesCount({
      sellerId: seller.id,
      sellerEmail: seller.email,
      q,
      categoryFilter,
      minPrice,
      maxPrice,
    }),
  ]);

  const categoryOptions = [
    { value: 'all', label: 'All categories' },
    ...CATEGORIES.filter((c) => c.slug !== 'all-products').map((c) => ({
      value: c.slug,
      label: c.label,
    })),
  ];

  return (
    <main className="mx-auto max-w-6xl p-6">
      <nav className="mb-4 text-sm text-gray-600">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/catalog" className="hover:underline">
              Catalog
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li>
            <Link href={`/catalog/sellers/${seller.id}`} className="hover:underline">
              {seller.seller_name}
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li className="font-semibold text-gray-900">Products</li>
        </ol>
      </nav>

      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{seller.seller_name}&apos;s Products</h1>
          <p className="mt-1 text-sm text-gray-600">
            Browse this seller&apos;s products. View only.
          </p>
        </div>
        <Link
          href={`/catalog/sellers/${seller.id}`}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-green-600"
        >
          Back to Seller
        </Link>
      </div>

      <div className="mb-6">
        <ProductFilters
          showCategoryFilter
          categories={categoryOptions}
          priceMinLimit={0}
          priceMaxLimit={500}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.length === 0 ? (
          <p className="text-sm text-gray-600">
            No products found for this seller.
          </p>
        ) : (
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              sellerFromId={seller.id}
            />
          ))
        )}
      </div>

      {totalPages > 1 ? (
        <div className="mt-6 flex justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      ) : null}
    </main>
  );
}