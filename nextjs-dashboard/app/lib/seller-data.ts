import postgres from 'postgres';
import { SellerForm, SellersTableType } from './definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const ITEMS_PER_PAGE = 6;

export async function fetchSellers() {
  try {
    const sellers = await sql<SellersTableType[]>`
      SELECT
        id,
        seller_id,
        email,
        contact_no,
        created_at,
        story
      FROM sellers
      ORDER BY seller_id ASC
    `;

    return sellers;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch all sellers.');
  }
}

export async function fetchFilteredSellers(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const sellers = await sql<SellersTableType[]>`
      SELECT
        id,
        seller_id,
        email,
        contact_no,
        created_at,
        story
      FROM sellers
      WHERE
        seller_id ILIKE ${`%${query}%`} OR
        email ILIKE ${`%${query}%`} OR
        contact_no ILIKE ${`%${query}%`} OR
        created_at::text ILIKE ${`%${query}%`}
      ORDER BY created_at DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return sellers;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch sellers.');
  }
}

export async function fetchSellersPages(query: string) {
  try {
    const data = await sql`
      SELECT COUNT(*)
      FROM sellers
      WHERE
        seller_id ILIKE ${`%${query}%`} OR
        email ILIKE ${`%${query}%`} OR
        contact_no ILIKE ${`%${query}%`} OR
        created_at::text ILIKE ${`%${query}%`}
        story ILIKE ${`%${query}%`}
    `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of sellers.');
  }
}

export async function fetchSellerById(id: string) {
  if (!id) {
    throw new Error('fetchSellerById: id is required (received undefined/empty).');
  }
  try {
    const data = await sql<SellerForm[]>`
      SELECT
        id,
        seller_id,
        email,
        contact_no,
        created_at,
        story
      FROM sellers
      WHERE id = ${id};
    `;

    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch seller.');
  }
}

/**
 * ✅ Sellers dashboard cards data (like fetchCardData but for sellers)
 * Adjust table names if your schema differs.
 */
export async function fetchSellerCardData() {
  try {
    const sellerCountPromise = sql`SELECT COUNT(*) FROM sellers`;
    const productCountPromise = sql`SELECT COUNT(*) FROM products`;
    const reviewCountPromise = sql`SELECT COUNT(*) FROM reviews`;

    const data = await Promise.all([
      sellerCountPromise,
      productCountPromise,
      reviewCountPromise,
    ]);

    const numberOfSellers = Number(data[0][0].count ?? '0');
    const numberOfProducts = Number(data[1][0].count ?? '0');
    const numberOfReviews = Number(data[2][0].count ?? '0');

    return {
      numberOfSellers,
      numberOfProducts,
      numberOfReviews,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch seller card data.');
  }
}