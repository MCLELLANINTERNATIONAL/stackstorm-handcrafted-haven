import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Breadcrumbs from '@/app/ui/sellers/breadcrumbs';
import Form from '@/app/ui/sellers/edit-form';
import { fetchSellerById } from '@/app/lib/seller-data';

export const metadata: Metadata = {
  title: 'Edit Seller Profile',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const seller = await fetchSellerById(id);

  if (!seller) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Sellers', href: '/dashboard/sellers' },
          { label: 'Profile', href: '/dashboard/sellers/profile' },
          {
            label: 'Edit',
            href: `/dashboard/sellers/profile/${id}/edit`,
            active: true,
          },
        ]}
      />

      <div className="max-w-4xl">
        <h1 className="text-2xl font-semibold">Edit Seller Profile</h1>
        <p className="mt-2 text-gray-600">
          Update your story, links, and profile details.
        </p>

        <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
          <Form seller={seller} />
        </div>
      </div>
    </main>
  );
}

  