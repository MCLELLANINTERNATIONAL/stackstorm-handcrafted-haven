import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import { fetchProductById } from "@/app/lib/product-data";
import {
  fetchProductAverageRating,
  fetchProductReviewsByProductId,
} from "@/app/lib/product-review-data";
import ProductReviewForm from "@/app/ui/products/product-review-form";
import { formatDateToLocal } from "@/app/lib/utils";

function stars(rating: number) {
  const r = Math.max(0, Math.min(5, Math.round(rating)));
  return "★".repeat(r) + "☆".repeat(5 - r);
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  params: Promise<{ productId: string }>;
  searchParams: Promise<{ from?: string; category?: string }>;
};

export default async function ProductDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { productId } = await params;
  if (!productId) notFound();

  const product = await fetchProductById(productId);
  if (!product) notFound();

  const sp = (await searchParams) ?? {};
  const category = sp.category?.trim();
  const from = sp.from?.trim();

  const backHref =
    category && from === "category"
      ? `/catalog/categories/${encodeURIComponent(category)}`
      : "/catalog";

  const [reviews, avg] = await Promise.all([
    fetchProductReviewsByProductId(product.id),
    fetchProductAverageRating(product.id),
  ]);

  return (
    <main className="mx-auto max-w-6xl p-6">
      {/* Breadcrumbs */}
      <nav className="mb-4 text-sm text-gray-600">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/catalog" className="hover:underline">
              Catalog
            </Link>
          </li>

          {category && (
            <>
              <li className="text-gray-400">/</li>
              <li>
                <Link href={backHref} className="hover:underline">
                  {category}
                </Link>
              </li>
            </>
          )}

          <li className="text-gray-400">/</li>
          <li className="font-semibold text-gray-900 line-clamp-1">
            {product.product_name}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Product Details</h1>

        {/* <Link
          href={backHref}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-green-600 hover:cursor-pointer"
        >
          ← Back to Catalog
        </Link> */}
      </div>

      {/* Product section */}
      <section className="mb-10 flex flex-col gap-6 md:flex-row">
        <div className="relative h-56 w-56 flex-shrink-0 overflow-hidden rounded-xl border bg-white">
          <Image
            src={product.image_url || "/products/placeholder.jpg"}
            alt={product.product_name}
            fill
            className="object-contain object-center"
            sizes="224px"
            priority
          />
        </div>

        <div className="flex-1">
          <h2 className="text-3xl font-semibold">{product.product_name}</h2>

          <p className="mt-2 text-sm text-gray-600">
            Category: <span className="font-semibold">{product.category}</span>
          </p>

          <p className="mt-2 text-lg font-bold text-black">
            £{Number(product.price).toFixed(2)}
          </p>

          {product.created_at && (
            <p className="mt-1 text-sm text-gray-600">
              Listed {formatDateToLocal(String(product.created_at))}
            </p>
          )}

          <div className="mt-4">
            <h3 className="text-sm font-semibold">Description</h3>
            {product.description ? (
              <p className="mt-2 whitespace-pre-line text-sm text-gray-700">
                {product.description}
              </p>
            ) : (
              <p className="mt-2 text-sm text-gray-500">
                No description provided.
              </p>
            )}
          </div>

          <div className="mt-4">
            <h3 className="text-sm font-semibold">Contact</h3>
            <p className="mt-1 text-sm">{product.email}</p>
            {product.contact && <p className="text-sm">{product.contact}</p>}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">Customer Reviews</h2>

          <div className="rounded-full bg-yellow-200 px-4 py-2 text-sm font-bold text-black">
            Average Rating:{" "}
            <span className="font-semibold">
              {avg === null ? "—" : avg.toFixed(1)}
            </span>
          </div>
        </div>

        {reviews.length === 0 ? (
          <p className="text-sm text-gray-500">
            This product has no reviews yet.
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="rounded-lg border bg-white p-4">
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-sm font-medium">
                    {r.customer_name ?? "Customer"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDateToLocal(String(r.created_at))}
                  </p>
                </div>

                <div className="text-sm font-bold">{stars(r.rating)}</div>

                <p className="mt-2 whitespace-pre-line text-sm text-gray-700">
                  {r.comment}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ✅ Public review form (no auth gate) */}
        <div className="mt-6">
          <ProductReviewForm productId={product.id} />
        </div>
      </section>
    </main>
  );
}
