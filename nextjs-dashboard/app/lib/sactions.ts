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
  date: z.string(),
  story: z.string().min(20, { message: 'Please write at least 20 characters.' }),
});

const CreateSeller = FormSchema.omit({ id: true });
const UpdateSeller = FormSchema.omit({ id: true });

export type State = {
  errors?: {
    sellerId?: string[];
    email?: string[];
    contact?: string[];
    date?: string[];
    story?: string[];
  };
  message?: string | null;
};

export async function createSeller(prevState: State, formData: FormData) {
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

  const { sellerId, email, contact, date } = validatedFields.data;

  try {
    await sql`
      INSERT INTO sellers (seller_id, email, contact_no, created_at)
      VALUES (${sellerId}, ${email}, ${contact}, ${date})
    `;
  } catch (error) {
    console.error(error);
    return {
      message: 'Database Error: Failed to create seller.',
    };
  }

  revalidatePath('/dashboard/sellers');
  redirect('/dashboard/sellers');
}

export async function updateSeller(
  id: string,
  prevState: State,
  formData: FormData,
) {
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
          created_at = ${date}
          story = ${story}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error(error);
    return {
      message: 'Database Error: Failed to update seller.',
    };
  }

  revalidatePath('/dashboard/sellers');
  redirect('/dashboard/sellers');
}

export async function deleteSeller(id: string,  _formData: FormData) {
  try {
    await sql`
      DELETE FROM sellers
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error(error);
    
    throw new Error('Database Error: Failed to delete seller.');
}

  revalidatePath('/dashboard/sellers');
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
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
