'use server';

import postgres from 'postgres';
import { revalidatePath } from 'next/cache';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export type ReviewErrors = {
  rating?: string[];
  comment?: string[];
  customer_name?: string[];
};

export type ReviewState = {
  message: string;
  errors?: ReviewErrors;
};

export async function createProductReview(
  prevState: ReviewState,
  formData: FormData,
): Promise<ReviewState> {
  const productId = String(formData.get('productId') ?? '').trim();
  const ratingRaw = String(formData.get('rating') ?? '').trim();
  const comment = String(formData.get('comment') ?? '').trim();
  const customerNameRaw = String(formData.get('customerName') ?? '').trim();

  const errors: ReviewErrors = {};
  const rating = Number(ratingRaw);

  if (!productId) {
    return { message: 'Missing product id.', errors: {} };
  }

  if (!ratingRaw || Number.isNaN(rating) || rating < 1 || rating > 5) {
    errors.rating = ['Please choose a rating between 1 and 5.'];
  }

  if (!comment) {
    errors.comment = ['Comment is required.'];
  }

  const customerName = customerNameRaw || 'Customer';

  if (Object.keys(errors).length > 0) {
    return { message: 'Please fix the errors below.', errors };
  }

  try {
    await sql`
      INSERT INTO product_reviews (
        product_id,
        rating,
        comment,
        customer_name
      )
      VALUES (
        ${productId}::uuid,
        ${rating},
        ${comment},
        ${customerName}
      );
    `;
  } catch (error) {
    console.error('Database Error (createProductReview):', error);
    return { message: 'Failed to submit review.', errors: {} };
  }

  /* Revalidate ONLY the product detail page */
  revalidatePath(`/catalog/products/${productId}`);

  return {
    message: 'Thanks! Your review was submitted.',
    errors: {},
  };
}