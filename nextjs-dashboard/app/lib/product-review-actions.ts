// app/lib/product-review-actions.ts
'use server';

import postgres from 'postgres';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export type ReviewErrors = {
  rating?: string[];
  comment?: string[];
};

export type ReviewState = {
  message: string;
  errors?: ReviewErrors;
};

export async function createProductReview(
  prevState: ReviewState,
  formData: FormData,
): Promise<ReviewState> {
  const session = await auth();

  if (!session?.user) {
    return { message: 'You must be logged in to leave a review.', errors: {} };
  }

  const productId = String(formData.get('productId') ?? '').trim();
  const ratingRaw = String(formData.get('rating') ?? '').trim();
  const comment = String(formData.get('comment') ?? '').trim();

  const errors: ReviewErrors = {};
  const rating = Number(ratingRaw);

  if (!productId) return { message: 'Missing product id.', errors: {} };

  if (!ratingRaw || Number.isNaN(rating) || rating < 1 || rating > 5) {
    errors.rating = ['Please choose a rating between 1 and 5.'];
  }

  if (!comment) {
    errors.comment = ['Comment is required.'];
  }

  if (Object.keys(errors).length > 0) {
    return { message: 'Please fix the errors below.', errors };
  }

  const customerName = session.user.name ?? 'Customer';

  await sql`
    INSERT INTO product_reviews (product_id, rating, comment, customer_name)
    VALUES (${productId}::uuid, ${rating}, ${comment}, ${customerName});
  `;

  revalidatePath('/dashboard/products');
  return { message: '', errors: {} };
}
