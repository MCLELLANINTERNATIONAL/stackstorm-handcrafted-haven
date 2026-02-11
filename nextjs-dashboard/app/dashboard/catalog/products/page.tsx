import { lusitana } from '@/app/ui/fonts';
import ProductCard from '@/app/ui/products/product-card';
import { fetchProducts } from '@/app/lib/product-data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page() {
  const products = await fetchProducts();

  return (
    <div className="w-full rounded bg-gray-100 p-2">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl text-sky-800`}>Products</h1>
      </div>

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

