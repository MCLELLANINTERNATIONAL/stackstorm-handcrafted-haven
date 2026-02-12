import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { customers, revenue, users } from '../lib/placeholder-data';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

/* ---------------------------------------
   Helpers
---------------------------------------- */
async function ensureUuid() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
}

/* ---------------------------------------
   ENUM: Product Categories
---------------------------------------- */
async function seedProductCategoryEnum() {
  await sql`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'product_category') THEN
        CREATE TYPE product_category AS ENUM (
          'wood',
          'home',
          'art',
          'christmas',
          'crochet-knitted'
        );
      END IF;
    END $$;
  `;
}

/* ---------------------------------------
   Users
---------------------------------------- */
async function seedUsers() {
  await ensureUuid();

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  // ✅ DB generates id (no manual ids)
  await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO users (name, email, password)
        VALUES (${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (email) DO NOTHING;
      `;
    }),
  );
}

/* ---------------------------------------
   Customers
---------------------------------------- */
async function seedCustomers() {
  await ensureUuid();

  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      image_url TEXT NOT NULL
    );
  `;

  // ✅ DB generates id (no manual ids)
  await Promise.all(
    customers.map((c) => sql`
      INSERT INTO customers (name, email, image_url)
      VALUES (${c.name}, ${c.email}, ${c.image_url})
      ON CONFLICT (email) DO NOTHING;
    `),
  );
}

/* ---------------------------------------
   Sellers
---------------------------------------- */
async function seedSellers() {
  await ensureUuid();

  await sql`
    CREATE TABLE IF NOT EXISTS sellers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      seller_name TEXT NOT NULL,
      category TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      contact_no TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      story TEXT,
      image_url TEXT
    );
  `;
}

/* ---------------------------------------
   Products
---------------------------------------- */
async function seedProducts() {
  await ensureUuid();
  await seedProductCategoryEnum();

  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,

      -- ✅ link to seller (still DB-generated; this is a relationship, not “manual ids”)
      seller_id UUID REFERENCES sellers(id) ON DELETE CASCADE,

      product_name TEXT NOT NULL,
      category product_category NOT NULL,

      price NUMERIC(10,2) NOT NULL CHECK (price > 0),

      email TEXT NOT NULL,
      contact TEXT,
      description TEXT,
      image_url TEXT,

      created_at TIMESTAMP DEFAULT NOW()
    );
  `;
}

/* ---------------------------------------
   Seller Reviews
---------------------------------------- */
async function seedSellerReviews() {
  await ensureUuid();

  await sql`
    CREATE TABLE IF NOT EXISTS seller_reviews (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      seller_id UUID NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
      rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
      comment TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      product_name TEXT,
      customer_name TEXT
    );
  `;
}

/* ---------------------------------------
   Product Reviews (needed for product detail page)
---------------------------------------- */
async function seedProductReviews() {
  await ensureUuid();

  await sql`
    CREATE TABLE IF NOT EXISTS product_reviews (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
      comment TEXT NOT NULL,
      customer_name TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;
}

/* ---------------------------------------
   Revenue
---------------------------------------- */
async function seedRevenue() {
  await sql`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `;

  await Promise.all(
    revenue.map((rev) => sql`
      INSERT INTO revenue (month, revenue)
      VALUES (${rev.month}, ${rev.revenue})
      ON CONFLICT (month) DO NOTHING;
    `),
  );
}

/* ---------------------------------------
   SEED ROUTE
---------------------------------------- */
export async function GET() {
  try {
    await sql.begin(() => [
      seedUsers(),
      seedCustomers(),
      seedSellers(),
      seedProducts(),
      seedSellerReviews(),
      seedProductReviews(),
      seedRevenue(),
    ]);

    return Response.json({ message: 'Database seeded successfully (DB-generated IDs only).' });
  } catch (error) {
    console.error('Seed error:', error);
    return Response.json({ error }, { status: 500 });
  }
}
