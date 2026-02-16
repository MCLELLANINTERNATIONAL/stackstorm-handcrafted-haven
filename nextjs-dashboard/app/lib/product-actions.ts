'use server';

import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

/* =====================================================
   TYPES
===================================================== */

export type ProductErrors = {
  imageUrl?: string[];
  productName?: string[];
  category?: string[];
  price?: string[];
  email?: string[];
  contact?: string[];
  description?: string[];
};

export type ProductState = {
  message: string;
  errors?: ProductErrors;
};

/* =====================================================
   VALIDATION
===================================================== */

function validateProduct(formData: FormData) {
  const errors: ProductErrors = {};

  const productName = String(formData.get('productName') ?? '').trim();
  const category = String(formData.get('category') ?? '').trim();
  const priceRaw = String(formData.get('price') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const contact = String(formData.get('contact') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const imageUrlRaw = String(formData.get('imageUrl') ?? '').trim();

  if (!productName) errors.productName = ['Product name is required.'];
  if (!category) errors.category = ['Category is required.'];

  const price = Number(priceRaw);
  if (!priceRaw || Number.isNaN(price) || price <= 0) {
    errors.price = ['Please enter a valid price (greater than 0).'];
  }

  if (!email) errors.email = ['Email is required.'];
  if (!contact) errors.contact = ['Contact number is required.'];
  if (!description) errors.description = ['Description is required.'];

  if (
    imageUrlRaw &&
    !(imageUrlRaw.startsWith('/') || imageUrlRaw.startsWith('http'))
  ) {
    errors.imageUrl = ['Use a relative path (/) or a full URL (http/https).'];
  }

  if (Object.keys(errors).length > 0) {
    return { errors, data: null };
  }

  return {
    errors: {},
    data: {
      productName,
      category,
      price,
      email,
      contact,
      description,
      imageUrl: imageUrlRaw || null,
    },
  };
}

/* =====================================================
   CREATE PRODUCT (OWNER ONLY)
===================================================== */

export async function createProductAsOwner(
  sellerId: string,
  _prevState: ProductState,
  formData: FormData,
): Promise<ProductState> {
  const session = await auth();
  const userEmail = session?.user?.email?.toLowerCase();

  if (!userEmail) {
    return { message: 'You must be logged in.', errors: {} };
  }

  if (!sellerId) {
    return { message: 'Missing seller id.', errors: {} };
  }

  // Verify ownership
  const seller = await sql<{ email: string }[]>`
    SELECT email
    FROM sellers
    WHERE id = ${sellerId}::uuid
    LIMIT 1;
  `;

  if (!seller[0] || seller[0].email.toLowerCase() !== userEmail) {
    return { message: 'Not authorized.', errors: {} };
  }

  const { errors, data } = validateProduct(formData);
  if (!data) return { message: 'Please fix the errors below.', errors };

  try {
    await sql`
      INSERT INTO products (
        seller_id,
        product_name,
        category,
        price,
        email,
        contact,
        description,
        image_url
      )
      VALUES (
        ${sellerId}::uuid,
        ${data.productName},
        ${data.category}::product_category,
        ${data.price},
        ${data.email},
        ${data.contact},
        ${data.description},
        ${data.imageUrl}
      );
    `;
  } catch (error) {
    console.error('CREATE ERROR:', error);
    return { message: 'Database error: failed to create product.', errors: {} };
  }

  // Revalidate
  revalidatePath(`/dashboard/sellers/profile/${sellerId}/products`);
  revalidatePath('/catalog');
  revalidatePath(`/catalog/categories/${data.category}`);

  return { message: '' };
}

/* =====================================================
   UPDATE PRODUCT (OWNER ONLY)
===================================================== */

export async function updateProductAsOwner(
  productId: string,
  sellerId: string,
  _prevState: ProductState,
  formData: FormData,
): Promise<ProductState> {
  const session = await auth();
  const userEmail = session?.user?.email?.toLowerCase();

  if (!userEmail) {
    return { message: 'You must be logged in.', errors: {} };
  }

  if (!productId || !sellerId) {
    return { message: 'Missing product or seller id.', errors: {} };
  }

  const existing = await sql<
    { seller_id: string; seller_email: string; category: string }[]
  >`
    SELECT p.seller_id, p.category, s.email AS seller_email
    FROM products p
    JOIN sellers s ON s.id = p.seller_id
    WHERE p.id = ${productId}::uuid
    LIMIT 1;
  `;

  const row = existing[0];
  if (!row) return { message: 'Product not found.', errors: {} };

  if (
    row.seller_id !== sellerId ||
    row.seller_email.toLowerCase() !== userEmail
  ) {
    return { message: 'Not authorized.', errors: {} };
  }

  const oldCategory = row.category;

  const { errors, data } = validateProduct(formData);
  if (!data) return { message: 'Please fix the errors below.', errors };

  try {
    await sql`
      UPDATE products
      SET
        product_name = ${data.productName},
        category = ${data.category}::product_category,
        price = ${data.price},
        email = ${data.email},
        contact = ${data.contact},
        description = ${data.description},
        image_url = ${data.imageUrl}
      WHERE id = ${productId}::uuid
        AND seller_id = ${sellerId}::uuid;
    `;
  } catch (error) {
    console.error('UPDATE ERROR:', error);
    return { message: 'Database error: failed to update product.', errors: {} };
  }

  revalidatePath(`/dashboard/sellers/profile/${sellerId}/products`);
  revalidatePath('/catalog');

  // If category changed, revalidate both
  revalidatePath(`/catalog/categories/${oldCategory}`);
  revalidatePath(`/catalog/categories/${data.category}`);

  return { message: '' };
}

/* =====================================================
   DELETE PRODUCT (OWNER ONLY)
===================================================== */

export async function deleteProductAsOwner(
  productId: string,
  sellerId: string,
) {
  const session = await auth();
  const userEmail = session?.user?.email?.toLowerCase();

  if (!userEmail) throw new Error('You must be logged in.');
  if (!productId || !sellerId)
    throw new Error('Missing product or seller id.');

  const existing = await sql<
    { seller_id: string; seller_email: string; category: string }[]
  >`
    SELECT p.seller_id, p.category, s.email AS seller_email
    FROM products p
    JOIN sellers s ON s.id = p.seller_id
    WHERE p.id = ${productId}::uuid
    LIMIT 1;
  `;

  const row = existing[0];
  if (!row) throw new Error('Product not found.');

  if (
    row.seller_id !== sellerId ||
    row.seller_email.toLowerCase() !== userEmail
  ) {
    throw new Error('Not authorized.');
  }

  await sql`
    DELETE FROM products
    WHERE id = ${productId}::uuid
      AND seller_id = ${sellerId}::uuid;
  `;

  revalidatePath(`/dashboard/sellers/profile/${sellerId}/products`);
  revalidatePath('/catalog');
  revalidatePath(`/catalog/categories/${row.category}`);

  return { sellerId };
}
