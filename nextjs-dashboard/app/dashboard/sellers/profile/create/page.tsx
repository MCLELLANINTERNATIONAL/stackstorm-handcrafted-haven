import type { Metadata } from 'next';

import Breadcrumbs from '@/app/ui/sellers/breadcrumbs';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs'; // or create seller breadcrumbs if you want
import SellerForm from '@/app/ui/sellers/create-form';
import { fetchSellers } from '@/app/lib/seller-data';

export const metadata: Metadata = {
  title: 'Create Seller Profile',
};

// Ensures this page is rendered dynamically (good while developing DB features)
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function Page() {
  const sellers = await fetchSellers();

  return (
    <main className="max-w-4xl">
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Sellers', href: '/dashboard/sellers' },
          { label: 'Profile', href: '/dashboard/sellers/profile' },
          {
            label: 'Create',
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Sellers', href: '/dashboard/sellers' },
          {
            label: 'Create Seller Profile',
            href: '/dashboard/sellers/profile/create',
            active: true,
          },
        ]}
      />

      <h1 className="text-2xl font-semibold">Create Seller Profile</h1>
      <p className="mt-2 text-gray-600">
        Set up your seller profile so customers can learn about your craft.
      </p>

      <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
        <SellerForm sellers={sellers} />
      </div>
    </main>
  );
}


  
