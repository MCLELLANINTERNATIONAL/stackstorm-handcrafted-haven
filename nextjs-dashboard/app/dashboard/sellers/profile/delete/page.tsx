// app/dashboard/sellers/profile/[id]/delete/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Breadcrumbs from '@/app/ui/sellers/breadcrumbs';
import DeleteSellerForm from '@/app/ui/sellers/delete-form';
import { fetchSellerById } from '@/app/lib/seller-data';

export const metadata: Metadata = {
  title: 'Delete Seller Profile',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DeleteProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;
  if (!id) notFound();

  const seller = await fetchSellerById(id);
  if (!seller) notFound();

  return (
    <div className="max-w-4xl">
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Sellers', href: '/dashboard/sellers' },
          { label: 'Profile', href: `/dashboard/sellers/profile/${id}` },
          { label: 'Delete', href: `/dashboard/sellers/profile/${id}/delete`, active: true },
        ]}
      />

      <h1 className="text-2xl font-semibold text-red-600">Delete Seller Profile</h1>

      <p className="mt-2 text-gray-600">
        This action is permanent and cannot be undone. Deleting this seller will also remove
        related reviews (because of database cascade rules).
      </p>

      <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm text-gray-700">
          You are about to permanently delete:{' '}
          <span className="font-semibold">{seller.seller_name}</span>
        </p>

        <div className="mt-6">
          <DeleteSellerForm sellerId={id} />
        </div>
      </div>
    </div>
  );
}

