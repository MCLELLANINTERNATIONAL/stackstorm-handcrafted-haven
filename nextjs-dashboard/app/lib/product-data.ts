import postgres from 'postgres';
import type { ProductForm, ProductsTableType } from './definitions';
import type { CategorySlug } from './categories';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const ITEMS_PER_PAGE = 6;

/* =====================================================
   FETCH PRODUCTS FOR ONE SELLER
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
   FILTERED PRODUCTS (SEARCH)
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
    const data = await sql`
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

    const totalPages = Math.ceil(Number(data[0].count ?? 0) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error (fetchProductsPages):', error);
    throw new Error('Failed to fetch total number of products.');
  }
}

/* =====================================================
   FETCH PRODUCT BY ID (DETAIL PAGE)
===================================================== */
export async function fetchProductById(id: string) {
  if (!id) {
    throw new Error(
      'fetchProductById: id is required (received undefined/empty).',
    );
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
   FETCH PRODUCTS BY CATEGORY (CATALOG CATEGORY PAGE)
===================================================== */
export async function fetchProductsByCategory(category: CategorySlug | 'all-products') {
  const cat = String(category ?? '').trim().toLowerCase();

  if (!cat) return [];

  try {
    // ✅ ALL PRODUCTS (special-case, no enum cast, no WHERE filter)
    if (cat === 'all-products') {
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
  category: CategorySlug | 'all-products',
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const cat = String(category ?? '').trim().toLowerCase();
  if (!cat) return [];

  try {
    // ✅ ALL PRODUCTS (special-case, no enum cast, no WHERE filter)
    if (cat === 'all-products') {
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
        ORDER BY created_at DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset};
      `;
      return products;
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
export async function fetchCategoryPages(category: CategorySlug | 'all-products') {
  const cat = String(category ?? '').trim().toLowerCase();
  if (!cat) return 0;

  try {
    // ✅ ALL PRODUCTS (count everything)
    if (cat === 'all-products') {
      const data = await sql`
        SELECT COUNT(*)::int AS count
        FROM products;
      `;
      return Math.ceil(Number(data[0].count ?? 0) / ITEMS_PER_PAGE);
    }

    const data = await sql`
      SELECT COUNT(*)::int AS count
      FROM products
      WHERE category = ${cat}::product_category;
    `;

    const totalPages = Math.ceil(Number(data[0].count ?? 0) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error (fetchCategoryPages):', error);
    throw new Error('Failed to fetch category pages.');
  }
}

/* =====================================================
   FILTER + PRICE RANGE + (OPTIONAL) CATEGORY DROPDOWN
   Used by category pages with filters, including /all-products
===================================================== */

const ALL_PRODUCTS_SLUG = 'all-products' as const;

const CATEGORY_SLUGS: readonly CategorySlug[] = [
  'christmas',
  'crochet-knitted',
  'home',
  'art',
  'wood',
] as const;

function isCategorySlug(v: string): v is CategorySlug {
  return (CATEGORY_SLUGS as readonly string[]).includes(v);
}

export async function fetchProductsForCategoryPage(args: {
  routeCategory: CategorySlug | typeof ALL_PRODUCTS_SLUG;
  currentPage: number;
  q: string;
  categoryFilter?: string; // only used for all-products
  minPrice: number;
  maxPrice: number;
}) {
  const offset = (args.currentPage - 1) * ITEMS_PER_PAGE;

  const q = String(args.q ?? '').trim();
  const min = Number.isFinite(args.minPrice) ? args.minPrice : 0;
  const max = Number.isFinite(args.maxPrice) ? args.maxPrice : 999999;

  const route = String(args.routeCategory).trim().toLowerCase();

  try {
    // ✅ all-products (optional category dropdown)
    if (route === ALL_PRODUCTS_SLUG) {
      const rawCat = String(args.categoryFilter ?? 'all').trim().toLowerCase();
      const useCategory = rawCat !== 'all' && isCategorySlug(rawCat);

      const products = await sql<ProductsTableType[]>`
        SELECT
          id, seller_id, product_name, category, price, email, contact,
          description, image_url, created_at
        FROM products
        WHERE
          price >= ${min} AND price <= ${max}
          AND (
            ${q === ''} OR
            product_name ILIKE ${`%${q}%`} OR
            category::text ILIKE ${`%${q}%`} OR
            COALESCE(email,'') ILIKE ${`%${q}%`} OR
            COALESCE(contact,'') ILIKE ${`%${q}%`} OR
            COALESCE(description,'') ILIKE ${`%${q}%`} OR
            price::text ILIKE ${`%${q}%`}
          )
          AND (
            ${!useCategory} OR category = ${rawCat}::product_category
          )
        ORDER BY created_at DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset};
      `;
      return products;
    }

    // ✅ normal category pages
    const cat = route as CategorySlug;

    const products = await sql<ProductsTableType[]>`
      SELECT
        id, seller_id, product_name, category, price, email, contact,
        description, image_url, created_at
      FROM products
      WHERE
        category = ${cat}::product_category
        AND price >= ${min} AND price <= ${max}
        AND (
          ${q === ''} OR
          product_name ILIKE ${`%${q}%`} OR
          category::text ILIKE ${`%${q}%`} OR
          COALESCE(email,'') ILIKE ${`%${q}%`} OR
          COALESCE(contact,'') ILIKE ${`%${q}%`} OR
          COALESCE(description,'') ILIKE ${`%${q}%`} OR
          price::text ILIKE ${`%${q}%`}
        )
      ORDER BY created_at DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset};
    `;
    return products;
  } catch (error) {
    console.error('Database Error (fetchProductsForCategoryPage):', error);
    throw new Error('Failed to fetch products for category page.');
  }
}

export async function fetchProductsForCategoryPagesCount(args: {
  routeCategory: CategorySlug | typeof ALL_PRODUCTS_SLUG;
  q: string;
  categoryFilter?: string;
  minPrice: number;
  maxPrice: number;
}) {
  const q = String(args.q ?? '').trim();
  const min = Number.isFinite(args.minPrice) ? args.minPrice : 0;
  const max = Number.isFinite(args.maxPrice) ? args.maxPrice : 999999;

  const route = String(args.routeCategory).trim().toLowerCase();

  try {
    if (route === ALL_PRODUCTS_SLUG) {
      const rawCat = String(args.categoryFilter ?? 'all').trim().toLowerCase();
      const useCategory = rawCat !== 'all' && isCategorySlug(rawCat);

      const data = await sql`
        SELECT COUNT(*)::int AS count
        FROM products
        WHERE
          price >= ${min} AND price <= ${max}
          AND (
            ${q === ''} OR
            product_name ILIKE ${`%${q}%`} OR
            category::text ILIKE ${`%${q}%`} OR
            COALESCE(email,'') ILIKE ${`%${q}%`} OR
            COALESCE(contact,'') ILIKE ${`%${q}%`} OR
            COALESCE(description,'') ILIKE ${`%${q}%`} OR
            price::text ILIKE ${`%${q}%`}
          )
          AND (
            ${!useCategory} OR category = ${rawCat}::product_category
          );
      `;

      return Math.ceil(Number(data[0].count ?? 0) / ITEMS_PER_PAGE);
    }

    const cat = route as CategorySlug;

    const data = await sql`
      SELECT COUNT(*)::int AS count
      FROM products
      WHERE
        category = ${cat}::product_category
        AND price >= ${min} AND price <= ${max}
        AND (
          ${q === ''} OR
          product_name ILIKE ${`%${q}%`} OR
          category::text ILIKE ${`%${q}%`} OR
          COALESCE(email,'') ILIKE ${`%${q}%`} OR
          COALESCE(contact,'') ILIKE ${`%${q}%`} OR
          COALESCE(description,'') ILIKE ${`%${q}%`} OR
          price::text ILIKE ${`%${q}%`}
        );
    `;

    return Math.ceil(Number(data[0].count ?? 0) / ITEMS_PER_PAGE);
  } catch (error) {
    console.error('Database Error (fetchProductsForCategoryPagesCount):', error);
    throw new Error('Failed to fetch category pages count.');
  }
}

/* =====================================================
  FETCH SELLER PRODUCTS BY SELLER + CATEGORY
  (USED ONLY FOR SELLER PROFILE PRODUCTS PAGE)
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
