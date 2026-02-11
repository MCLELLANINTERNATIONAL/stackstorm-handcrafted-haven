import Link from 'next/link';
import Image from 'next/image';
import { inter } from '@/app/ui/fonts';
import type { ProductsTableType } from '@/app/lib/definitions';

export default function ProductCard({
  product,
  categoryFrom,
}: {
  product: ProductsTableType;
  categoryFrom?: string;
}) {
  const href = categoryFrom
    ? `/catalog/products/${product.id}?from=category&category=${encodeURIComponent(
        categoryFrom,
      )}`
    : `/catalog/products/${product.id}`;

  return (
    <Link href={href} className="block hover:cursor-pointer">
      <div className="w-60 overflow-hidden rounded-lg bg-gray-100 p-2 shadow-md shadow-gray-400 transition hover:shadow-lg">
        <div className="relative h-44 w-full overflow-hidden rounded-lg">
          <Image
            src={product.image_url || '/products/placeholder.jpg'}
            alt={product.product_name}
            fill
            className="object-cover"
            sizes="240px"
          />
        </div>

        <div className="p-2">
          <h2 className={`${inter.className} line-clamp-1 text-lg font-bold`}>
            {product.product_name}
          </h2>
          <p className={`${inter.className} mt-1 text-xs text-gray-600`}>
            {product.category}
          </p>

          <div className="mt-3 flex items-center justify-between">
            <p className="text-sm font-bold text-black">
              £{Number(product.price).toFixed(2)}
            </p>

            <span className="rounded-md bg-blue-600 px-3 py-1 text-xs font-bold text-white transition-colors hover:bg-green-600">
              View
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
