import { lusitana } from "@/app/ui/fonts";
import { Suspense } from "react";
import Search from "@/app/ui/search";
import Link from "next/link";
import Image from "next/image";

export default function SellerCard() {
  return (
    <>
      <div>
        <Search placeholder="Search invoices..." />
      </div>
    </>
  );
}
