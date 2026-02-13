import { lusitana } from '@/app/ui/fonts';
import Link from 'next/link';
import Image from 'next/image';
import { CATEGORIES } from '@/app/lib/categories';

export default function CategoriesPage() {
  return (
    <div className="w-full rounded bg-gray-100 p-4">
      <h1 className={`${lusitana.className} text-2xl text-sky-800`}>
        Categories
      </h1>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/catalog/categories/${cat.slug}`}
            className="rounded-lg bg-white p-4 shadow hover:shadow-md transition"
          >
            {cat.imagePath && (
              <Image
                src={cat.imagePath}
                alt={cat.label}
                width={400}
                height={250}
                className="mb-3 rounded-md object-cover"
              />
            )}

            <h2 className="text-lg font-semibold text-gray-800">
              {cat.label}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
