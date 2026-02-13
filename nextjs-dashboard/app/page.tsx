import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import styles from '@/app/ui/home.module.css';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      {/* <div className={styles.shape} /> */}
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
        <AcmeLogo />
      </div>

      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        {/* LEFT COLUMN */}
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <p
            className={`${lusitana.className} text-base text-gray-800 md:text-lg md:leading-relaxed`}
          >
            <strong>Welcome to Handcraft Haven</strong>
            <br />
            A home for artisans and makers who pour heart, skill, and creativity into every
            piece they create. Discover unique, handcrafted products and connect directly
            with the talented creators behind them. Every item here tells a story. Yours
            is just beginning!
          </p>

          <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col items-center justify-center gap-6 p-6 md:w-3/5 md:px-28 md:py-12">
          {/* Button ABOVE the hero image */}
          <Link
            href="/catalog"
            className="rounded-lg bg-green-600 px-6 py-3 text-sm font-bold text-white
                       transition-colors hover:bg-orange-500 hover:cursor-pointer md:text-base"
          >
            View Product Catalog
          </Link>

          {/* Larger Hero Image */}
          <Image
            src="/hero-desktop.png"
            width={1700}
            height={1200}
            className="hidden md:block w-full"
            alt="Screenshots of the dashboard project showing desktop version"
            priority
          />
        </div>
      </div>
    </main>
  );
}
