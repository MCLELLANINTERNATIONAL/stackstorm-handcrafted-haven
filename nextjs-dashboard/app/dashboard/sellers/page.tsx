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
      <h1 className="text-2xl font-semibold">Sellers</h1>

      <div className="mt-6">
        <SellersTable sellers={sellers} />
export default function SellersPage() {
    return (
      <div className="max-w-4xl">
        <h1 className="text-2xl font-semibold">Sellers</h1>
        <p className="mt-2 text-gray-600">
          Share your craftsmanship, your story, and what makes your work unique.
        </p>
  
        {/* Put your profile form here: displayName, story, avatar, socials */}
        <div className="mt-6 rounded-2xl border p-6 shadow-sm">
          <p className="text-sm text-gray-700">
            Profile form/cards goes here (display name, story, links, etc.)
          </p>
        </div>
      </div>
    </main>
  );
}

