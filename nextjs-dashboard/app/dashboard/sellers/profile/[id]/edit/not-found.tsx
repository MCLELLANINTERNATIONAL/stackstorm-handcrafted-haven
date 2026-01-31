import Link from 'next/link';
import { FaceFrownIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-2">
      <FaceFrownIcon className="w-10 text-gray-400" />

      <h2 className="text-xl font-semibold">Seller Not Found</h2>

      <p className="text-sm text-gray-600">
        The seller profile you are trying to edit does not exist.
      </p>

      <Link
        href="/dashboard/sellers"
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
      >
        Back to Sellers
      </Link>
    </main>
  );
}
