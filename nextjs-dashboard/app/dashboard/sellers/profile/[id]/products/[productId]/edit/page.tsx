import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchProductByIdForSeller } from "@/app/lib/product-data";
import EditProductForm from "@/app/ui/products/edit-form";
import { requireSellerOwner } from "@/app/lib/seller-auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page({
  params,
}: {
  params: { id: string; productId: string };
}) {
  const sellerId = params.id;
  const productId = params.productId;

  if (!sellerId || !productId) notFound();

  await requireSellerOwner(sellerId);

  // ensures the product is owned by this seller
  const product = await fetchProductByIdForSeller(productId, sellerId);
  if (!product) notFound();

  const backHref = `/dashboard/sellers/profile/${sellerId}/products`;

  return (
    <main className="mx-auto max-w-4xl p-6">
      {/* Breadcrumbs */}
      <nav className="mb-4 text-sm text-gray-600">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link href="/dashboard/sellers" className="hover:underline">Sellers</Link></li>
          <li className="text-gray-400">/</li>
          <li><Link href={`/dashboard/sellers/profile/${sellerId}`} className="hover:underline">Profile</Link></li>
          <li className="text-gray-400">/</li>
          <li><Link href={backHref} className="hover:underline">Products</Link></li>
          <li className="text-gray-400">/</li>
          <li className="font-semibold text-gray-900">Edit</li>
        </ol>
      </nav>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit Product</h1>

        <Link
          href={backHref}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-green-600"
        >
          Back to products
        </Link>
      </div>

      <section className="rounded-xl border bg-white p-6">
        <EditProductForm sellerId={sellerId} backHref={backHref} product={product} />
      </section>
    </main>
  );
}