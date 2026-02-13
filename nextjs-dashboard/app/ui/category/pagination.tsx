'use client';

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Pagination({
  totalPages,
}: {
  totalPages: number;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get('page')) || 1;

  if (totalPages <= 1) return null;

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      {/* Previous Arrow */}
      <Link
        href={createPageURL(currentPage - 1)}
        className={`flex h-10 w-10 items-center justify-center rounded-md border
          ${
            currentPage <= 1
              ? 'pointer-events-none text-gray-300'
              : 'hover:bg-gray-100'
          }`}
      >
        <ArrowLeftIcon className="w-4" />
      </Link>

      {/* Page Numbers */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Link
          key={page}
          href={createPageURL(page)}
          className={`flex h-10 w-10 items-center justify-center rounded-md border text-sm font-medium
            ${
              currentPage === page
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'hover:bg-gray-100'
            }`}
        >
          {page}
        </Link>
      ))}

      {/* Next Arrow */}
      <Link
        href={createPageURL(currentPage + 1)}
        className={`flex h-10 w-10 items-center justify-center rounded-md border
          ${
            currentPage >= totalPages
              ? 'pointer-events-none text-gray-300'
              : 'hover:bg-gray-100'
          }`}
      >
        <ArrowRightIcon className="w-4" />
      </Link>
    </div>
  );
}
