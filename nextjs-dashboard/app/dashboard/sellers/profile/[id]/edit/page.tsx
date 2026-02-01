import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Breadcrumbs from '@/app/ui/sellers/breadcrumbs';
import EditSellerProfileForm from '@/app/ui/sellers/edit-form';
import { fetchSellerById, fetchSellers } from '@/app/lib/seller-data';

export const metadata: Metadata = {
  title: 'Edit Seller Profile',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;

  if (!id) notFound();

  const [seller, sellers] = await Promise.all([
    fetchSellerById(id),
    fetchSellers(),
  ]);

  if (!seller) notFound();

  return (
    <main className="max-w-4xl">
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

      <h1 className="text-2xl font-semibold">Edit Seller Profile</h1>
      <p className="mt-2 text-gray-600">
        Update your story, links, and profile details.
      </p>

      <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
        <EditSellerProfileForm seller={seller} sellers={sellers} />
      </div>
    </main>
  );
}