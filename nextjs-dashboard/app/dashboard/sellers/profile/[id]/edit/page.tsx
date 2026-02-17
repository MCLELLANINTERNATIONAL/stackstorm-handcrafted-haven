import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import Breadcrumbs from '@/app/ui/sellers/breadcrumbs';
import EditSellerProfileForm from '@/app/ui/sellers/edit-form';
import { fetchSellerById } from '@/app/lib/seller-data';
import { getSellerAccess } from '@/app/lib/authz';

export const metadata: Metadata = {
  title: 'Edit Seller Profile',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) notFound();

  const seller = await fetchSellerById(id);

  if (!seller) notFound();

  const access = await getSellerAccess(seller.id);
  if (!access.canManage) {
    redirect(`/dashboard/sellers/profile/${seller.id}`);
  }

  // Prefer whichever id your seller object actually has
  const sellerId = (seller as any).id ?? (seller as any).seller_id ?? id;

  return (
    <main className="max-w-4xl">
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Sellers', href: '/dashboard/sellers' },
          { label: 'Profile', href: `/dashboard/sellers/profile/${sellerId}` },
          {
            label: 'Edit',
            href: `/dashboard/sellers/profile/${sellerId}/edit`,
            active: true,
          },
        ]}
      />

      <h1 className="text-2xl font-semibold">Edit Seller Profile</h1>
      <p className="mt-2 text-gray-600">
        Update your story, links, and profile details.
      </p>

      <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
        <EditSellerProfileForm seller={seller} />
      </div>
    </main>
  );
}
