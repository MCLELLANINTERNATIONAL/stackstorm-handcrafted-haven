import Link from 'next/link';
import { formatDateToLocal } from '@/app/lib/utils';
import { UpdateSeller, DeleteSeller } from '@/app/ui/sellers/buttons';
import type { SellersTableType } from '@/app/lib/definitions';

export default function SellersTable({ sellers }: { sellers: SellersTableType[] }) {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="min-w-full text-gray-900">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Seller ID
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Contact
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Created
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {sellers?.map((seller) => (
                <tr
                  key={seller.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none
                    [&:first-child>td:first-child]:rounded-tl-lg
                    [&:first-child>td:last-child]:rounded-tr-lg
                    [&:last-child>td:first-child]:rounded-bl-lg
                    [&:last-child>td:last-child]:rounded-br-lg"
                >
                  {/* Make seller_id clickable to the profile */}
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <Link
                      href={`/dashboard/sellers/${seller.id}`}
                      className="font-medium text-blue-600 underline underline-offset-2 hover:text-blue-800"
                    >
                      {seller.seller_id}
                    </Link>
                  </td>

                  <td className="whitespace-nowrap px-3 py-3">{seller.email}</td>

                  <td className="whitespace-nowrap px-3 py-3">{seller.contact_no}</td>

                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(seller.created_at)}
                  </td>

                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      {/* New: View profile */}
                      <Link
                        href={`/dashboard/sellers/${seller.id}`}
                        className="rounded-md border px-2 py-1 text-xs font-medium hover:bg-gray-50"
                      >
                        View
                      </Link>

                      {/* Existing actions */}
                      <UpdateSeller id={seller.id} />
                      <DeleteSeller id={seller.id} />
                    </div>
                  </td>
                </tr>
              ))}

              {!sellers?.length && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                    No sellers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
