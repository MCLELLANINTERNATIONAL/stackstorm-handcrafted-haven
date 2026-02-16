// app/lib/seller-auth.ts

import postgres from 'postgres';
import { auth } from '@/auth';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

/**
 * Ensures the logged-in user owns the given seller profile.
 * Throws an error if not authenticated or not authorized.
 */
export async function requireSellerOwner(sellerId: string) {
  if (!sellerId) {
    throw new Error('Missing seller id.');
  }

  const session = await auth();
  const userEmail = session?.user?.email?.toLowerCase();

  if (!userEmail) {
    throw new Error('You must be logged in.');
  }

  const rows = await sql<{ email: string }[]>`
    SELECT email
    FROM sellers
    WHERE id = ${sellerId}::uuid
    LIMIT 1;
  `;

  const seller = rows[0];

  if (!seller) {
    throw new Error('Seller not found.');
  }

  if (seller.email.toLowerCase() !== userEmail) {
    throw new Error('Not authorized to access this seller profile.');
  }

  return true;
}