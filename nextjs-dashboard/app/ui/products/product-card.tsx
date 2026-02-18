import Link from 'next/link';
import Image from 'next/image';
import { inter } from '@/app/ui/fonts';
import type { ProductsTableType } from '@/app/lib/definitions';

type ProductCardProps = {
  product: ProductsTableType;
  categoryFrom?: string;
  sellerFromId?: string;
};

export default function ProductCard({
  product,
  categoryFrom,
}: ProductCardProps) {
  const href = categoryFrom
    ? `/catalog/products/${product.id}?from=category&category=${encodeURIComponent(
        categoryFrom,
      )}`
    : `/catalog/products/${product.id}`;

  return (
    <Link href={href} className="block group">
      <div className="w-60 overflow-hidden rounded-lg bg-gray-100 p-2 shadow-md shadow-gray-400 transition-transform transition-shadow duration-200 hover:shadow-lg hover:scale-[1.02]">

        {/* Image */}
        <div className="relative h-44 w-full overflow-hidden rounded-lg bg-white flex items-center justify-center">
          <Image
            src={product.image_url || '/products/placeholder.jpg'}
            alt={product.product_name}
            fill
            className="object-contain transition-transform duration-200 group-hover:scale-105"
            sizes="240px"
          />
        </div>

        {/* Content */}
        <div className="p-2">
          <h2
            className={`${inter.className} text-sm font-semibold leading-snug text-gray-900 break-words line-clamp-2`}
            title={product.product_name}
          >
            {product.product_name}
          </h2>

          <p className="mt-1 text-xs text-gray-600 capitalize">
            {product.category}
          </p>

          <div className="mt-3 flex items-center justify-between">
            <p className="text-sm font-bold text-black">
              £{Number(product.price).toFixed(2)}
            </p>

            <span className="rounded-md bg-blue-600 px-3 py-1 text-xs font-bold text-white transition-colors group-hover:bg-green-600">
              View
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
