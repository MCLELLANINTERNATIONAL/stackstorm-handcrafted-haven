import { lusitana } from "@/app/ui/fonts";
import { Suspense } from "react";
import Search from "@/app/ui/search";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/app/ui/catalog/product-card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
};

export default function Page() {
  const productsDatails = {
    name: "Merry Christmas",
    imagePath: "/products/christmas/c10.jpeg",
    address: "Sweden",
    id: "1",
  };

  return (
    <>
      <div className="w-full bg-gray-100 p-2 rounded">
        <div className="flex w-full items-center justify-between">
          <h1 className={`${lusitana.className} text-2xl text-sky-800`}>
            Products
          </h1>
        </div>
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <Search placeholder="Search products..." />
        </div>
        <div className="mt-6 mx-auto flex flex-wrap ml:grid grid-cols-3 gap-4">
          <ProductCard sellerDetails={productsDatails} />
          <ProductCard sellerDetails={productsDatails} />
          <ProductCard sellerDetails={productsDatails} />
          <ProductCard sellerDetails={productsDatails} />
          <ProductCard sellerDetails={productsDatails} />
        </div>
      </div>
    </>
  );
}
