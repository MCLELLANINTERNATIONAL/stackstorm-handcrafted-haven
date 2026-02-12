import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export type ProductReviewRow = {
  id: string;
  product_id: string;
  rating: number;
  comment: string; // NOT NULL in DB
  customer_name: string | null;
  created_at: string; 
};

export async function fetchProductReviewsByProductId(productId: string) {
  if (!productId) {
    throw new Error('fetchProductReviewsByProductId: productId is required.');
  }

  try {
    const rows = await sql<ProductReviewRow[]>`
      SELECT
        id,
        product_id,
        rating,
        comment,
        customer_name,
        created_at
      FROM product_reviews
      WHERE product_id = ${productId}::uuid
      ORDER BY created_at DESC;
    `;
    return rows;
  } catch (error) {
    console.error('Database Error (fetchProductReviewsByProductId):', error);
    throw new Error('Failed to fetch product reviews.');
  }
}

export async function fetchProductAverageRating(productId: string) {
  if (!productId) {
    throw new Error('fetchProductAverageRating: productId is required.');
  }

  try {
    const rows = await sql<{ avg: number | null }[]>`
      SELECT AVG(rating)::float AS avg
      FROM product_reviews
      WHERE product_id = ${productId}::uuid;
    `;
    return rows[0]?.avg ?? null;
  } catch (error) {
    console.error('Database Error (fetchProductAverageRating):', error);
    throw new Error('Failed to fetch product average rating.');
  }
}
