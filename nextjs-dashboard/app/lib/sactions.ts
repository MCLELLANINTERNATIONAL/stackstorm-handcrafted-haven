'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const FormSchema = z.object({
  id: z.string(),
  sellerId: z.string({ invalid_type_error: 'Please select a seller.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  contact: z.string().min(1, { message: 'Please enter a contact number.' }),
  date: z.string().min(1, { message: 'Please select a date.' }),
  story: z.string().min(20, { message: 'Please write at least 20 characters.' }),
});

const CreateSeller = FormSchema.omit({ id: true });
const UpdateSeller = FormSchema.omit({ id: true });

export type State = {
  message: string;
  errors: {
    sellerId?: string[];
    email?: string[];
    contact?: string[];
    date?: string[];
    story?: string[];
  };
};

export async function createSeller(_prevState: State, formData: FormData): Promise<State> {
  const validatedFields = CreateSeller.safeParse({
    sellerId: formData.get('sellerId'),
    email: formData.get('email'),
    contact: formData.get('contact'),
    date: formData.get('date'),
    story: formData.get('story'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing fields. Failed to create seller.',
    };
  }

  const { sellerId, email, contact, date, story } = validatedFields.data;

  try {
    await sql`
      INSERT INTO sellers (seller_id, email, contact_no, created_at, story)
      VALUES (${sellerId}, ${email}, ${contact}, ${date}, ${story})
    `;
  } catch (error: unknown) {
    console.error(error);
    return {
      errors: {},
      message: 'Database Error: Failed to create seller.',
    };
  }

  revalidatePath('/dashboard/sellers');
  redirect('/dashboard/sellers');
}

export async function updateSeller(
  id: string,
  _prevState: State,
  formData: FormData,
): Promise<State> {
  const validatedFields = UpdateSeller.safeParse({
    sellerId: formData.get('sellerId'),
    email: formData.get('email'),
    contact: formData.get('contact'),
    date: formData.get('date'),
    story: formData.get('story'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing fields. Failed to update seller.',
    };
  }

  const { sellerId, email, contact, date, story } = validatedFields.data;

  try {
    await sql`
      UPDATE sellers
      SET seller_id = ${sellerId},
          email = ${email},
          contact_no = ${contact},
          created_at = ${date},
          story = ${story}
      WHERE id = ${id}
    `;
  } catch (error: unknown) {
    console.error(error);
    return {
      errors: {},
      message: 'Database Error: Failed to update seller.',
    };
  }

  revalidatePath('/dashboard/sellers');
  redirect('/dashboard/sellers');
}

export async function deleteSeller(id: string): Promise<void> {
  try {
    await sql`
      DELETE FROM sellers
      WHERE id = ${id}
    `;
  } catch (error: unknown) {
    console.error(error);
    throw new Error('Database Error: Failed to delete seller.');
  }

  revalidatePath('/dashboard/sellers');
}

export async function authenticate(
  _prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}