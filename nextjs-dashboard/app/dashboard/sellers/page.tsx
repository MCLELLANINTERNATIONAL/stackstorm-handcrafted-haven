import type { Metadata } from 'next';
import { fetchSellers } from '@/app/lib/seller-data';
import SellersTable from '@/app/ui/sellers/table';

export const metadata: Metadata = {
  title: 'Sellers',
};

export const dynamic = 'force-dynamic';

export default async function Page() {
  const sellers = await fetchSellers();

  return (
    <main className="max-w-5xl">
      <h1 className="text-2xl font-semibold">Seller Directory</h1>
      <p className="mt-2 text-gray-600">
        Share your craftsmanship, your story, and what makes your work unique.
      </p>

      <div className="mt-6">
        <SellersTable sellers={sellers} />
      </div>
    </main>
  );
}