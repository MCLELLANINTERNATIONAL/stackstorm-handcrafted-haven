import type { Metadata } from 'next';
import ForgotPasswordForm from '@/app/ui/auth/forgot-password-form';

export const metadata: Metadata = {
  title: 'Forgot Password',
};

export default function ForgotPasswordPage() {
  return (
    <main className="mx-auto mt-10 w-full max-w-lg p-4">
      <h1 className="text-2xl font-semibold">Forgot Password</h1>
      <p className="mt-2 text-sm text-gray-600">
        Enter your email and we&apos;ll generate a password reset link.
      </p>

      <div className="mt-6">
        <ForgotPasswordForm />
      </div>
    </main>
  );
}