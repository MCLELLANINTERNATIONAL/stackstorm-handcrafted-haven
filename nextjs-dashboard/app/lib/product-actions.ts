'use server';

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

export async function createProduct(
  prevState: ProductState,
  formData: FormData,
): Promise<ProductState> {
  const errors: ProductErrors = {};

  const productName = String(formData.get('productName') ?? '').trim();
  const category = String(formData.get('category') ?? '').trim();
  const priceRaw = String(formData.get('price') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const contact = String(formData.get('contact') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const imageUrl = String(formData.get('imageUrl') ?? '').trim();

  if (!productName) errors.productName = ['Product name is required.'];
  if (!category) errors.category = ['Category is required.'];

  const price = Number(priceRaw);
  if (!priceRaw || Number.isNaN(price) || price <= 0) {
    errors.price = ['Please enter a valid price (greater than 0).'];
  }

  if (!email) errors.email = ['Email is required.'];
  if (!contact) errors.contact = ['Contact number is required.'];
  if (!description) errors.description = ['Description is required.'];

  // Optional simple URL/path check (optional)
  if (imageUrl && !(imageUrl.startsWith('/') || imageUrl.startsWith('http'))) {
    errors.imageUrl = ['Use a relative path (/) or a full URL (http/https).'];
  }

  if (Object.keys(errors).length > 0) {
    return { message: 'Please fix the errors below.', errors };
  }

  // TODO: Save to DB here
  // Example:
  // await db.insert(products).values({ productName, category, price, email, contact, description, imageUrl });

  return { message: '', errors: {} };
}
