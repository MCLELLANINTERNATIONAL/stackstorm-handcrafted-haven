import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { customers, revenue, users } from '../lib/placeholder-data';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function ensureUuid() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
}

async function seedUsers() {
  await ensureUuid();

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  // DB generates id (we do NOT insert id)
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

async function seedCustomers() {
  await ensureUuid();

  // Make email unique so we can safely re-run seed
  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      image_url VARCHAR(255) NOT NULL
    );
  `;

  // DB generates id (we do NOT insert id)
  await Promise.all(
    customers.map((customer) => sql`
      INSERT INTO customers (name, email, image_url)
      VALUES (${customer.name}, ${customer.email}, ${customer.image_url})
      ON CONFLICT (email) DO NOTHING;
    `),
  );
}

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

async function seedProducts() {
  await ensureUuid();

  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,

      -- products belong to a seller (seller_id is a reference, not “manual id”)
      seller_id UUID REFERENCES sellers(id) ON DELETE CASCADE,

      product_name TEXT NOT NULL,
      category TEXT NOT NULL,

      price NUMERIC(10,2) NOT NULL CHECK (price > 0),

      email TEXT NOT NULL,
      contact TEXT,

      description TEXT,
      image_url TEXT,

      created_at TIMESTAMP DEFAULT NOW()
    );
  `;
}

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

export async function GET() {
  try {
    await sql.begin(() => [
      seedUsers(),
      seedCustomers(),
      seedSellers(),
      seedProducts(),
      seedSellerReviews(),
      seedProductReviews(),
      // invoices intentionally not seeded (placeholder requires manual customer_id)
      seedRevenue(),
    ]);

    return Response.json({ message: 'Database seeded successfully (DB-generated IDs only).' });
  } catch (error) {
    console.error('Seed error:', error);
    return Response.json({ error }, { status: 500 });
  }
}
