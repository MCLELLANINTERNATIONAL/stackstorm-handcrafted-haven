'use server';

import postgres from 'postgres';
import type { ProductForm, ProductsTableType } from './definitions';
import type { CategorySlug } from './categories';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const ITEMS_PER_PAGE = 6;

/* =====================================================
   FETCH PRODUCTS FOR ONE SELLER (NO SEARCH)
===================================================== */
export async function fetchProductsBySellerId(sellerId: string) {
  if (!sellerId) {
    throw new Error('fetchProductsBySellerId: sellerId is required.');
  }

  try {
    const products = await sql<ProductsTableType[]>`
      SELECT
        id,
        seller_id,
        product_name,
        category,
        price,
        email,
        contact,
        description,
        image_url,
        created_at
      FROM products
      WHERE seller_id = ${sellerId}::uuid
      ORDER BY created_at DESC;
    `;
    return products;
  } catch (error) {
    console.error('Database Error (fetchProductsBySellerId):', error);
    throw new Error('Failed to fetch products for this seller.');
  }
}

/* =====================================================
   FETCH PRODUCTS FOR ONE SELLER (WITH SEARCH)
   - Used by: /dashboard/sellers/profile/[id]/products/page.tsx
===================================================== */
export async function fetchProductsBySeller(sellerId: string, q?: string) {
  if (!sellerId) {
    throw new Error('fetchProductsBySeller: sellerId is required.');
  }

  const query = String(q ?? '').trim();

  try {
    if (!query) {
      return await fetchProductsBySellerId(sellerId);
    }

    const products = await sql<ProductsTableType[]>`
      SELECT
        id,
        seller_id,
        product_name,
        category,
        price,
        email,
        contact,
        description,
        image_url,
        created_at
      FROM products
      WHERE seller_id = ${sellerId}::uuid
        AND (
          product_name ILIKE ${`%${query}%`} OR
          category::text ILIKE ${`%${query}%`} OR
          COALESCE(email,'') ILIKE ${`%${query}%`} OR
          COALESCE(contact,'') ILIKE ${`%${query}%`} OR
          COALESCE(description,'') ILIKE ${`%${query}%`} OR
          price::text ILIKE ${`%${query}%`} OR
          created_at::text ILIKE ${`%${query}%`}
        )
      ORDER BY created_at DESC;
    `;

    return products;
  } catch (error) {
    console.error('Database Error (fetchProductsBySeller):', error);
    throw new Error('Failed to fetch seller products.');
  }
}

/* =====================================================
   FETCH PRODUCT BY ID (PUBLIC/DETAIL PAGE - NOT SELLER SCOPED)
===================================================== */
export async function fetchProductById(id: string) {
  if (!id) {
    throw new Error('fetchProductById: id is required.');
  }

  try {
    const data = await sql<ProductForm[]>`
      SELECT
        id,
        seller_id,
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

/* =====================================================
   FETCH PRODUCT BY ID FOR SELLER (OWNER-SCOPED)
   - Used by Edit/Delete pages to prevent cross-seller access
===================================================== */
export async function fetchProductByIdForSeller(productId: string, sellerId: string) {
  if (!productId || !sellerId) {
    throw new Error('fetchProductByIdForSeller: productId and sellerId are required.');
  }

  try {
    const data = await sql<ProductForm[]>`
      SELECT
        id,
        seller_id,
        product_name,
        category,
        price,
        email,
        contact,
        description,
        image_url,
        created_at
      FROM products
      WHERE id = ${productId}::uuid
        AND seller_id = ${sellerId}::uuid
      LIMIT 1;
    `;

    return data[0] ?? null;
  } catch (error) {
    console.error('Database Error (fetchProductByIdForSeller):', error);
    throw new Error('Failed to fetch seller-owned product.');
  }
}

/* =====================================================
   OPTIONAL HELPER: GET CATEGORY BY PRODUCT ID
   - Useful for revalidation or UI logic
===================================================== */
export async function fetchProductCategoryById(productId: string) {
  if (!productId) throw new Error('fetchProductCategoryById: productId is required.');

  const rows = await sql<{ category: string }[]>`
    SELECT category::text AS category
    FROM products
    WHERE id = ${productId}::uuid
    LIMIT 1;
  `;

  return rows[0]?.category ?? null;
}

/* =====================================================
   FETCH ALL PRODUCTS (CATALOG)
===================================================== */
export async function fetchProducts() {
  try {
    const products = await sql<ProductsTableType[]>`
      SELECT
        id,
        seller_id,
        product_name,
        category,
        price,
        email,
        contact,
        description,
        image_url,
        created_at
      FROM products
      ORDER BY created_at DESC;
    `;
    return products;
  } catch (error) {
    console.error('Database Error (fetchProducts):', error);
    throw new Error('Failed to fetch all products.');
  }
}

/* =====================================================
   FILTERED PRODUCTS (SEARCH) - CATALOG SEARCH
===================================================== */
export async function fetchFilteredProducts(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const products = await sql<ProductsTableType[]>`
      SELECT
        id,
        seller_id,
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
        category::text ILIKE ${`%${query}%`} OR
        COALESCE(email,'') ILIKE ${`%${query}%`} OR
        COALESCE(contact,'') ILIKE ${`%${query}%`} OR
        COALESCE(description,'') ILIKE ${`%${query}%`} OR
        price::text ILIKE ${`%${query}%`} OR
        created_at::text ILIKE ${`%${query}%`}
      ORDER BY created_at DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset};
    `;
    return products;
  } catch (error) {
    console.error('Database Error (fetchFilteredProducts):', error);
    throw new Error('Failed to fetch products.');
  }
}

/* =====================================================
   TOTAL PRODUCT PAGES (SEARCH PAGINATION)
===================================================== */
export async function fetchProductsPages(query: string) {
  try {
    const data = await sql<{ count: number }[]>`
      SELECT COUNT(*)::int AS count
      FROM products
      WHERE
        product_name ILIKE ${`%${query}%`} OR
        category::text ILIKE ${`%${query}%`} OR
        COALESCE(email,'') ILIKE ${`%${query}%`} OR
        COALESCE(contact,'') ILIKE ${`%${query}%`} OR
        COALESCE(description,'') ILIKE ${`%${query}%`} OR
        price::text ILIKE ${`%${query}%`} OR
        created_at::text ILIKE ${`%${query}%`};
    `;

    const totalPages = Math.ceil(Number(data[0]?.count ?? 0) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error (fetchProductsPages):', error);
    throw new Error('Failed to fetch total number of products.');
  }
}

/* =====================================================
   FETCH PRODUCTS BY CATEGORY (CATALOG CATEGORY PAGE)
===================================================== */
export async function fetchProductsByCategory(category: CategorySlug) {
  const cat = String(category ?? '').trim().toLowerCase() as CategorySlug;
  if (!cat) return [];

  try {
    const products = await sql<ProductsTableType[]>`
      SELECT
        id,
        seller_id,
        product_name,
        category,
        price,
        email,
        contact,
        description,
        image_url,
        created_at
      FROM products
      WHERE category = ${cat}::product_category
      ORDER BY created_at DESC;
    `;
    return products;
  } catch (error) {
    console.error('Database Error (fetchProductsByCategory):', error);
    throw new Error('Failed to fetch products by category.');
  }
}

/* =====================================================
   FETCH PRODUCTS BY CATEGORY (PAGINATED)
===================================================== */
export async function fetchProductsByCategoryPaginated(
  category: CategorySlug,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const cat = String(category).trim().toLowerCase() as CategorySlug;
  if (!cat) return [];

  try {
    const products = await sql<ProductsTableType[]>`
      SELECT
        id,
        seller_id,
        product_name,
        category,
        price,
        email,
        contact,
        description,
        image_url,
        created_at
      FROM products
      WHERE category = ${cat}::product_category
      ORDER BY created_at DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset};
    `;
    return products;
  } catch (error) {
    console.error('Database Error (fetchProductsByCategoryPaginated):', error);
    throw new Error('Failed to fetch paginated products by category.');
  }
}

/* =====================================================
   TOTAL CATEGORY PAGES (CATEGORY PAGINATION)
===================================================== */
export async function fetchCategoryPages(category: CategorySlug) {
  const cat = String(category).trim().toLowerCase() as CategorySlug;
  if (!cat) return 0;

  try {
    const data = await sql<{ count: number }[]>`
      SELECT COUNT(*)::int AS count
      FROM products
      WHERE category = ${cat}::product_category;
    `;

    const totalPages = Math.ceil(Number(data[0]?.count ?? 0) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error (fetchCategoryPages):', error);
    throw new Error('Failed to fetch category pages.');
  }
}

/* =====================================================
  FETCH SELLER PRODUCTS BY SELLER + CATEGORY
===================================================== */
export async function fetchProductsBySellerIdAndCategory(
  sellerId: string,
  category: CategorySlug | string,
) {
  const cat = String(category ?? '').trim().toLowerCase() as CategorySlug;
  if (!sellerId || !cat) return [];

  try {
    const products = await sql<ProductsTableType[]>`
      SELECT
        id,
        seller_id,
        product_name,
        category,
        price,
        email,
        contact,
        description,
        image_url,
        created_at
      FROM products
      WHERE seller_id = ${sellerId}::uuid
        AND category = ${cat}::product_category
      ORDER BY created_at DESC;
    `;
    return products;
  } catch (error) {
    console.error('Database Error (fetchProductsBySellerIdAndCategory):', error);
    throw new Error('Failed to fetch seller products by category.');
  }
}
