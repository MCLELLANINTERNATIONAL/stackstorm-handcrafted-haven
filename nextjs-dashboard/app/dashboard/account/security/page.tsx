import type { Metadata } from 'next';
import ChangePasswordForm from '@/app/ui/account/change-password-form';

export const metadata: Metadata = {
  title: 'Account Security',
};

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-semibold">Account Security</h1>
      <p className="mt-2 text-sm text-gray-600">
        Update your login password. Use at least 8 characters.
      </p>

      <section className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
        <ChangePasswordForm />
      </section>
    </main>
  );
}