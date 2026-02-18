// Type definitions for your data.
// Describes the shape of the data, and what data type each property should accept.
// However, these types are generated automatically
// =======================
// Users
// =======================
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

// =======================
// Customers
// =======================
export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

// =======================
// Sellers
// =======================
export type SellerField = {
  id: string;
  seller_name: string;
};

export type SellersTableType = {
  id: string;
  seller_name: string;
  category: string;
  email: string;
  contact_no: string | null;
  created_at: string;
  story: string | null;
  image_url: string | null;
};

// edit forms / fetchSellerById
export type SellerForm = {
  id: string;
  seller_name: string;
  category: string;
  email: string;
  contact_no: string | null;
  created_at: Date | string;
  story: string | null;
  image_url: string | null;
};

// Used for createSeller action
export type CreateSellerInput = {
  seller_name: string;
  category: string;
  email: string;
  contact_no?: string | null;
  story: string;
  image_url?: string | null;
};

// =======================
// Seller Reviews
// =======================

export type SellerReview = {
  id: string;
  seller_id: string;
  rating: number;
  comment: string | null;
  product_name: string | null;
  customer_name: string | null;
  created_at: string;
};


// =======================
// Products
// =======================
export type ProductField = {
  id: string;
  product_name: string;
};

export type ProductsTableType = {
  id: string;
  seller_id: string | null;
  product_name: string;
  category: string;
  price: number;
  email: string;
  contact: string | null;
  description: string | null;
  image_url: string | null;
  created_at: string;
};

// Used for edit forms / fetchProductById
export type ProductForm = {
  id: string;
  seller_id: string | null;
  product_name: string;
  category: string;
  price: number;
  email: string;
  contact: string | null;
  description: string | null;
  image_url: string | null;
  created_at: Date | string;
};

// Used for createProduct action
export type CreateProductInput = {
  product_name: string;
  category: string;
  price: number;
  email: string;
  contact?: string | null;
  description: string;
  image_url?: string | null;
};

// =======================
// Product Reviews
// =======================

export type ProductReview = {
  id: string;
  product_id: string;
  rating: number;
  comment: string;
  customer_name: string | null;
  created_at: string;
};

export type CreateProductReviewInput = {
  product_id: string;
  rating: number;
  comment: string;
};

// =======================
// Invoices & Revenue
// =======================
export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
  date: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type Revenue = {
  month: string;
  revenue: number;
};

