'use server';

import postgres from 'postgres';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const ReviewSchema = z.object({
  sellerId: z.string().min(1, 'Missing seller id.'),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().min(3, 'Please write a little more.'),
  productName: z.string().optional(),
});

export type ReviewState = {
  message: string;
  errors: {
    sellerId?: string[];
    rating?: string[];
    comment?: string[];
    productName?: string[];
  };
};

function dbErrorMessage(error: unknown): string {
  const e = error as any;
  return [e?.message, e?.code, e?.detail].filter(Boolean).join(' | ') || 'Unknown database error';
}

export async function createSellerReview(
  _prevState: ReviewState,
  formData: FormData,
): Promise<ReviewState> {
  const validated = ReviewSchema.safeParse({
    sellerId: formData.get('sellerId')?.toString(),
    rating: formData.get('rating')?.toString(),
    comment: formData.get('comment')?.toString(),
    productName: formData.get('productName')?.toString() || undefined,
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: 'Missing/invalid fields. Failed to submit review.',
    };
  }

  const { sellerId, rating, comment, productName } = validated.data;

  try {
    // NO manual IDs: Postgres generates seller_reviews.id (DEFAULT uuid_generate_v4()).
    // sellerId must be an existing sellers.id (FK).
    await sql`
      INSERT INTO seller_reviews (seller_id, rating, comment, product_name)
      VALUES (${sellerId}::uuid, ${rating}, ${comment}, ${productName ?? null})
    `;
  } catch (error: unknown) {
    console.error('DB ERROR createSellerReview:', error);
    return { errors: {}, message: `Database Error: ${dbErrorMessage(error)}` };
  }
  
  revalidatePath('/dashboard/sellers');
  return { errors: {}, message: '' };
}
