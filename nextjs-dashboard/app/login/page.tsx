import AcmeLogo from "@/app/ui/acme-logo";
import LoginForm from "@/app/ui/login-form";
import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { inter } from "../ui/fonts";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <AcmeLogo />
          </div>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>

        <Link href="/reset-user-password" className="text-sm text-blue-500">
          Forgot password?
        </Link>

        <div className={`${inter.className} flex justify-between`}>
          <p className="text-xs">
            Sign up for an account, if you don't previously have.
          </p>
          <Link href={"/sign-up"} className="text-blue-500 text-sm">
            <strong>Sign Up</strong>
          </Link>
        </div>
      </div>
    </main>
  );
}
