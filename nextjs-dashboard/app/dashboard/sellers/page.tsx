import Link from 'next/link';
import type { Metadata } from 'next';

import Search from '@/app/ui/search';
import Pagination from '@/app/ui/sellers/pagination';
import SellersTable from '@/app/ui/sellers/table';

import { fetchFilteredSellers, fetchSellersPages } from '@/app/lib/seller-data';

export const metadata: Metadata = { title: 'Sellers' };
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page(props: {
  searchParams?: { query?: string; page?: string };
}) {
  const query = props.searchParams?.query ?? '';
  const currentPage = Number(props.searchParams?.page ?? '1');

  const [sellers, totalPages] = await Promise.all([
    fetchFilteredSellers(query, currentPage),
    fetchSellersPages(query),
  ]);

  return (
    <main className="max-w-5xl p-6">
      <h1 className="text-2xl font-semibold">Seller Directory</h1>
      <p className="mt-2 text-gray-600">
        Discover our artisans craftsmanship, stories, and what makes their work unique.
      </p>

      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search seller..." />

        <Link
          href="/dashboard/sellers/profile/create"
          className="inline-flex h-10 cursor-pointer items-center rounded-lg bg-green-600 px-4 text-sm font-bold text-white transition-colors hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
        >
          Create Seller Profile +
        </Link>
      </div>

      <div className="mt-6">
        <SellersTable sellers={sellers} />
      </div>

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </main>
  );
}
