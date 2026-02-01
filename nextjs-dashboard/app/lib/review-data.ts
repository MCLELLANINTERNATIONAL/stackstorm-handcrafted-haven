import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export type SellerReview = {
  id: string;
  seller_id: string; // this refers to sellers.id (primary key) if you store it that way
  rating: number;
  comment: string | null;
  created_at: string | Date;
  product_name?: string | null;
  customer_name?: string | null;
};

export async function fetchSellerReviewsBySellerId(sellerId: string) {
  if (!sellerId) return []; // ✅ avoid UNDEFINED_VALUE crash

  try {
    const data = await sql<SellerReview[]>`
      SELECT
        id,
        seller_id,
        rating,
        comment,
        created_at,
        product_name,
        customer_name
      FROM seller_reviews
      WHERE seller_id = ${sellerId}
      ORDER BY created_at DESC
      LIMIT 50
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}
