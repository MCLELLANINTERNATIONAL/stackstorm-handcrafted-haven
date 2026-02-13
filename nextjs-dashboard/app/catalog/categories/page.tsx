import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';
import { CATEGORIES } from '@/app/lib/categories';

export const metadata: Metadata = {
  title: 'Categories',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Page() {
  return (
    <div className="w-full rounded bg-gray-100 p-4">
      {/* Header */}
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl text-sky-800`}>
          Categories
        </h1>
      </div>

      {/* Grid */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/catalog/categories/${cat.slug}`}
            className="overflow-hidden rounded-lg border bg-white shadow-sm transition hover:shadow-md"
          >
            {/* Image */}
            <div className="relative h-40 w-full bg-white">
              <Image
                src={cat.imagePath || '/categories/placeholder.jpg'}
                alt={cat.label}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>

            {/* Text */}
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {cat.label}
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Browse {cat.label.toLowerCase()} products
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

