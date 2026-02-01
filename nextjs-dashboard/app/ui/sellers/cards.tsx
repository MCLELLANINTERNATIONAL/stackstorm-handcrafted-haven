import Link from 'next/link';
import {
  UserCircleIcon,
  InboxIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { fetchSellerCardData } from '@/app/lib/seller-data';

const iconMap = {
  sellers: UserCircleIcon,
  products: InboxIcon,
  reviews: ClockIcon,
};

export default async function SellerCardWrapper() {
  const { numberOfSellers, numberOfProducts, numberOfReviews } =
    await fetchSellerCardData();

  return (
    <>
      {/* Profile button */}
      <div className="mb-3 flex justify-end">
        <Link
          href="/dashboard/sellers/profile"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          View Seller Profiles
        </Link>
      </div>

      <SellerCard title="Total Sellers" value={numberOfSellers} type="sellers" />
      <SellerCard title="Total Products" value={numberOfProducts} type="products" />
      <SellerCard title="Total Reviews" value={numberOfReviews} type="reviews" />
    </>
  );
}

export function SellerCard({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'sellers' | 'products' | 'reviews';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className} truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
} 