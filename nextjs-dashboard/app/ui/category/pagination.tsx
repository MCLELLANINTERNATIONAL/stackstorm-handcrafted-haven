'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

type PaginationProps = {
  totalPages: number;
};

export default function Pagination({ totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get('page') ?? '1') || 1;

  if (!totalPages || totalPages <= 1) return null;

  function makeHref(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    return `${pathname}?${params.toString()}`;
  }

  const prevDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= totalPages;

  return (
    <div className="flex items-center gap-2">
      <Link
        aria-disabled={prevDisabled}
        className={`rounded-md border px-3 py-2 text-sm ${
          prevDisabled ? 'pointer-events-none opacity-50' : 'hover:bg-white'
        }`}
        href={makeHref(Math.max(1, currentPage - 1))}
      >
        Prev
      </Link>

      <div className="text-sm text-gray-600">
        Page <span className="font-semibold">{currentPage}</span> of{' '}
        <span className="font-semibold">{totalPages}</span>
      </div>

      <Link
        aria-disabled={nextDisabled}
        className={`rounded-md border px-3 py-2 text-sm ${
          nextDisabled ? 'pointer-events-none opacity-50' : 'hover:bg-white'
        }`}
        href={makeHref(Math.min(totalPages, currentPage + 1))}
      >
        Next
      </Link>
    </div>
  );
}

