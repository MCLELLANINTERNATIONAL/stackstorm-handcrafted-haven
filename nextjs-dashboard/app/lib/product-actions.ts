'use server';

import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
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

function validateProduct(formData: FormData): {
  errors: ProductErrors;
  data: {
    productName: string;
    category: string;
    price: number;
    email: string;
    contact: string;
    description: string;
    imageUrl: string | null;
  } | null;
} {
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
   CREATE PRODUCT
===================================================== */

export async function createProduct(
  prevState: ProductState,
  formData: FormData,
): Promise<ProductState> {
  const { errors, data } = validateProduct(formData);
  if (!data) return { message: 'Please fix the errors below.', errors };

  try {
    await sql`
      INSERT INTO products (
        product_name,
        category,
        price,
        email,
        contact,
        description,
        image_url
      )
      VALUES (
        ${data.productName},
        ${data.category},
        ${data.price},
        ${data.email},
        ${data.contact},
        ${data.description},
        ${data.imageUrl}
      );
    `;
  } catch (error) {
    console.error('Database Error (createProduct):', error);
    return {
      message: 'Database error: failed to create product.',
      errors: {},
    };
  }

  revalidatePath('/dashboard/catalog/products');
  redirect('/dashboard/catalog/products');
}

/* =====================================================
   UPDATE PRODUCT
===================================================== */

export async function updateProduct(
  id: string,
  prevState: ProductState,
  formData: FormData,
): Promise<ProductState> {
  if (!id) return { message: 'Missing product id.', errors: {} };

  const { errors, data } = validateProduct(formData);
  if (!data) return { message: 'Please fix the errors below.', errors };

  try {
    await sql`
      UPDATE products
      SET
        product_name = ${data.productName},
        category = ${data.category},
        price = ${data.price},
        email = ${data.email},
        contact = ${data.contact},
        description = ${data.description},
        image_url = ${data.imageUrl}
      WHERE id = ${id}::uuid;
    `;
  } catch (error) {
    console.error('Database Error (updateProduct):', error);
    return {
      message: 'Database error: failed to update product.',
      errors: {},
    };
  }

  revalidatePath('/dashboard/catalog/products');
  redirect('/dashboard/catalog/products');
}

/* =====================================================
   DELETE (OWNER-SECURED)
===================================================== */

export async function deleteProductAsOwner(productId: string) {
  const session = await auth();
  const userEmail = session?.user?.email?.toLowerCase();

  if (!userEmail) {
    throw new Error('You must be logged in.');
  }

  if (!productId) {
    throw new Error('Missing product id.');
  }

  // Verify ownership
  const rows = await sql<
    { seller_id: string; seller_email: string }[]
  >`
    SELECT p.seller_id, s.email AS seller_email
    FROM products p
    JOIN sellers s ON s.id = p.seller_id
    WHERE p.id = ${productId}::uuid
    LIMIT 1;
  `;

  const row = rows[0];
  if (!row) throw new Error('Product not found.');

  if (row.seller_email.toLowerCase() !== userEmail) {
    throw new Error('Not authorized to delete this product.');
  }

  // Delete
  await sql`
    DELETE FROM products
    WHERE id = ${productId}::uuid;
  `;

  // Refresh seller product list
  revalidatePath(`/dashboard/sellers/profile/${row.seller_id}/products`);

  return { sellerId: row.seller_id };
}
