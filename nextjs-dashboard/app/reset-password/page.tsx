import type { Metadata } from 'next';
import Link from 'next/link';
import ResetPasswordForm from '@/app/ui/auth/reset-password-form';

export const metadata: Metadata = {
  title: 'Reset Password',
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams?: Promise<{ token?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const token = String(sp.token ?? '').trim();

  return (
    <main className="mx-auto mt-10 w-full max-w-lg p-4">
      <h1 className="text-2xl font-semibold">Reset Password</h1>
      <p className="mt-2 text-sm text-gray-600">
        Choose a new password to finish resetting your account.
      </p>

      <div className="mt-6">
        {token ? (
          <ResetPasswordForm token={token} />
        ) : (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-700">
              Reset token is missing. Request a new reset link.
            </p>
            <Link href="/forgot-password" className="mt-2 inline-block text-sm underline">
              Go to forgot password
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}