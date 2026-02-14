import type { Metadata } from "next";
import Link from "next/link";
import { lusitana } from "@/app/ui/fonts";

export const metadata: Metadata = {
  title: "Product",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  params: { id: string };
  searchParams?: {
    category?: string; // e.g. ?category=chairs
    from?: string;     // e.g. ?from=category (optional)
  };
};

export default async function ProductPage({ params, searchParams }: PageProps) {
  const { id } = params;

  const category = searchParams?.category?.trim();
  const from = searchParams?.from?.trim();

  /**
   * ✅ Most reliable behavior:
   * - If you have a category slug and the user came from a category page, go back to that category page
   * - Otherwise go back to the public catalog directory at /catalog
   */
  const backHref =
    category && from === "category"
      ? `/catalog/categories/${encodeURIComponent(category)}`
      : "/catalog";

  return (
    <div className="w-full rounded bg-gray-100 p-4">
      <div className="mb-4">
        <Link
          href={backHref}
          className="inline-block rounded-md bg-gray-200 px-4 py-2 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-300"
        >
          ← Back to Catalog Categories Directory
        </Link>
      </div>

      <h1 className={`${lusitana.className} text-2xl text-sky-800`}>
        Product Details
      </h1>

      <p className="mt-2 text-sm text-gray-600">
        Product ID: <span className="font-mono">{id}</span>
      </p>

      <div className="mt-6 rounded-lg border bg-white p-4 shadow-sm">
        <p className="text-gray-700">Render your product details here.</p>
      </div>
    </div>
  );
}