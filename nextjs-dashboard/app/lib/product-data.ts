// app/lib/product-data.ts
import postgres from 'postgres';
import type { ProductForm, ProductsTableType } from './definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const ITEMS_PER_PAGE = 6;

export async function fetchProducts() {
  try {
    const products = await sql<ProductsTableType[]>`
      SELECT
        id,
        product_name,
        category,
        price,
        email,
        contact,
        description,
        image_url,
        created_at
      FROM products
      ORDER BY created_at DESC
    `;
    return products;
  } catch (error) {
    console.error('Database Error (fetchProducts):', error);
    throw new Error('Failed to fetch all products.');
  }
}

export async function fetchFilteredProducts(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const products = await sql<ProductsTableType[]>`
      SELECT
        id,
        product_name,
        category,
        price,
        email,
        contact,
        description,
        image_url,
        created_at
      FROM products
      WHERE
        product_name ILIKE ${`%${query}%`} OR
        category ILIKE ${`%${query}%`} OR
        email ILIKE ${`%${query}%`} OR
        contact ILIKE ${`%${query}%`} OR
        description ILIKE ${`%${query}%`} OR
        price::text ILIKE ${`%${query}%`} OR
        created_at::text ILIKE ${`%${query}%`}
      ORDER BY created_at DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return products;
  } catch (error) {
    console.error('Database Error (fetchFilteredProducts):', error);
    throw new Error('Failed to fetch products.');
  }
}

export async function fetchProductsPages(query: string) {
  try {
    const data = await sql`
      SELECT COUNT(*)::int AS count
      FROM products
      WHERE
        product_name ILIKE ${`%${query}%`} OR
        category ILIKE ${`%${query}%`} OR
        email ILIKE ${`%${query}%`} OR
        contact ILIKE ${`%${query}%`} OR
        description ILIKE ${`%${query}%`} OR
        price::text ILIKE ${`%${query}%`} OR
        created_at::text ILIKE ${`%${query}%`}
    `;

    const totalPages = Math.ceil(Number(data[0].count ?? 0) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error (fetchProductsPages):', error);
    throw new Error('Failed to fetch total number of products.');
  }
}

export async function fetchProductById(id: string) {
  if (!id) {
    throw new Error('fetchProductById: id is required (received undefined/empty).');
  }

  try {
    const data = await sql<ProductForm[]>`
      SELECT
        id,
        product_name,
        category,
        price,
        email,
        contact,
        description,
        image_url,
        created_at
      FROM products
      WHERE id = ${id}::uuid
      LIMIT 1;
    `;

    return data[0] ?? null;
  } catch (error) {
    console.error('Database Error (fetchProductById):', error);
    throw new Error('Failed to fetch product.');
  }
}

