import postgres from 'postgres';
import { auth } from '@/auth';
import { isAdminEmail, normalizeEmail } from '@/app/lib/auth-constants';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export type SellerAccess = {
  canManage: boolean;
  isAdmin: boolean;
  isOwner: boolean;
  userEmail: string | null;
};

export async function getSellerAccess(sellerId: string): Promise<SellerAccess> {
  const session = await auth();
  const userEmail = normalizeEmail(session?.user?.email);
  const isAdmin = isAdminEmail(userEmail);

  if (!userEmail) {
    return { canManage: false, isAdmin: false, isOwner: false, userEmail: null };
  }

  if (isAdmin) {
    return { canManage: true, isAdmin: true, isOwner: false, userEmail };
  }

  const rows = await sql<{ email: string }[]>`
    SELECT email
    FROM sellers
    WHERE id = ${sellerId}::uuid
    LIMIT 1;
  `;

  const sellerEmail = normalizeEmail(rows[0]?.email);
  const isOwner = sellerEmail.length > 0 && sellerEmail === userEmail;

  return { canManage: isOwner, isAdmin: false, isOwner, userEmail };
}

export async function assertCanManageSeller(sellerId: string) {
  const access = await getSellerAccess(sellerId);

  if (!access.canManage) {
    throw new Error('Not authorized to manage this seller.');
  }

  return access;
}