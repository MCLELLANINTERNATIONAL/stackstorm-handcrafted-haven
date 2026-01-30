import type { Metadata } from 'next';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs'; // or create seller breadcrumbs if you want
import SellerForm from '@/app/ui/sellers/create-form';
import { fetchSellers } from '@/app/lib/seller-data';

export const metadata: Metadata = {
  title: 'Create Seller Profile',
};

export const dynamic = 'force-dynamic';

export default async function Page() {
  const sellers = await fetchSellers();

  return (
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

      <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
        <SellerForm sellers={sellers} />
      </div>
    </main>
  );
}


  