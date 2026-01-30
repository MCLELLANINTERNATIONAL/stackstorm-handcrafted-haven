import { lusitana } from "@/app/ui/fonts";
import { Suspense } from "react";
import Search from "@/app/ui/search";
import Image from "next/image";
import SellerCard from "@/app/ui/sellers/seller-card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sellers",
};

export default function Page() {
  const sellerDetails = {
    name: "Amy Burns",
    imagePath: "/customers/amy-burns.png",
    address: "Lisbon, UK, 3875.",
    phone: "+2 8495 4859",
    email: "amyburns@gmail.com",
    skills: "Painting, Caving, Writing",
    id: "1",
  };

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Sellers</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search for sellers..." />
      </div>
      <div>
        <SellerCard sellerDetails={sellerDetails} />
      </div>
    </div>
  );
}
