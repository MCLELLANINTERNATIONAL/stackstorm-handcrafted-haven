import { Suspense } from "react";
import { lusitana } from "@/app/ui/fonts";
import Link from "next/link";
import {
  fetchProductsByCategoryPaginated,
  fetchCategoryPages,
} from "@/app/lib/product-data";
import ProductCard from "@/app/ui/products/product-card";
import Pagination from "@/app/ui/category/pagination";
import type { CategorySlug } from "@/app/lib/categories";

export const dynamic = "force-dynamic";

type PageProps = {
  params: { category: CategorySlug };
  searchParams?: { page?: string };
};

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps) {
  const { category } = params;
  const currentPage = Number(searchParams?.page) || 1;

  const [products, totalPages] = await Promise.all([
    fetchProductsByCategoryPaginated(category, currentPage),
    fetchCategoryPages(category),
  ]);

  return (
    <div className="w-full rounded bg-gray-100 p-4">
      <div className="flex items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl text-sky-800`}>
          {category}
        </h1>

        <Link
          href="/dashboard/catalog/categories"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white
                     transition-colors hover:bg-green-600 hover:cursor-pointer"
        >
          Back to categories
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.length === 0 ? (
          <p className="text-sm text-gray-600">No products in this category.</p>
        ) : (
          <ProductCard products={products} categoryFrom={category} />
        )}
      </div>

      {totalPages > 1 ? (
        <div className="mt-6 flex justify-center">
          <Suspense fallback={null}>
            <Pagination totalPages={totalPages} />
          </Suspense>
        </div>
      ) : null}
    </div>
  );
}
