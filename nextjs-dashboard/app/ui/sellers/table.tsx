import type { Metadata } from 'next';

import Breadcrumbs from '@/app/ui/sellers/breadcrumbs';
import Form from '@/app/ui/sellers/create-form';
import { fetchSellers } from '@/app/lib/seller-data';

export const metadata: Metadata = {
  title: 'Create Seller Profile',
};

export default async function Page() {
  const sellers = await fetchSellers();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Sellers', href: '/dashboard/sellers' },
          { label: 'Profile', href: '/dashboard/sellers/profile' },
          {
            label: 'Create',
            href: '/dashboard/sellers/profile/create',
            active: true,
          },
        ]}
      />

      <div className="max-w-4xl">
        <h1 className="text-2xl font-semibold">Create Seller Profile</h1>
        <p className="mt-2 text-gray-600">
          Set up your seller profile so customers can learn about your craft.
        </p>

        <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
          <Form sellers={sellers} />
        </div>
      </div>
    </main>
  );
}

