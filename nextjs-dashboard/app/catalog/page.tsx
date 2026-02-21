import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';
import CategoryCard from '@/app/ui/catalog/category-card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Categories',
};

export default function Page() {
  return (
    <div className="w-full rounded bg-gray-100 p-2">
      {/* Header row */}
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl text-sky-800`}>
          Catalog Categories Directory
        </h1>

        {/* Back to Home button */}
        <Link
          href="/"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white 
          transition-colors duration-200 hover:bg-green-600 hover:cursor-pointer"
        >
          ← Back to Home
        </Link>
      </div>

      <div className="mx-auto mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <CategoryCard />
      </div>
    </div>
  );
}
