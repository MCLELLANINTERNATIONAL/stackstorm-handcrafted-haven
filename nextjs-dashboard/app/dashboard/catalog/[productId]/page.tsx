import { lusitana } from "@/app/ui/fonts";
import { Suspense } from "react";
import ProductsCard from "@/app/ui/catalog/products-card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
};

export default async function Page({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  console.log(productId);
  return (
    <>
      <div className="w-full bg-gray-100 p-2 rounded">
        <div className="flex w-full items-center justify-between">
          <h1 className={`${lusitana.className} text-2xl text-sky-800`}>
            Products {productId}
          </h1>
        </div>
        {/* <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <Search placeholder="Search products..." />
        </div> */}
        <div className="mt-6 mx-auto flex flex-wrap ml:grid grid-cols-3 gap-4">
          <ProductsCard />
        </div>
      </div>
    </>
  );
}
