import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchProductById } from '@/app/lib/product-data';

export default async function ProductDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ productId: string }>;
  searchParams?: { from?: string; category?: string };
}) {
  const { productId } = await params;
  if (!productId) notFound();

  const product = await fetchProductById(productId);
  if (!product) notFound();

  const category = searchParams?.category ?? product.category;

  const backHref =
    searchParams?.from === 'category'
      ? `/catalog/categories/${encodeURIComponent(category)}/products`
      : '/catalog/products';

  const backLabel =
    searchParams?.from === 'category' ? 'Back to products' : 'Back to catalogue';

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Product Details</h1>

        <Link
          href={backHref}
          className="rounded-md border border-green-600 bg-green-600 px-3 py-2 text-sm font-bold text-white hover:bg-green-700 hover:border-green-700 transition-colors"
        >
          {backLabel}
        </Link>
      </div>

      {/* product layout + reviews here */}
    </main>
  );
}

