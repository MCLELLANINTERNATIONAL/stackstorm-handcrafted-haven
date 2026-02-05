import { lusitana } from "@/app/ui/fonts";
import { Suspense } from "react";
import Search from "@/app/ui/search";
import CategoryCard from "@/app/ui/catalog/category-card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories",
};

export default function Page() {
  return (
    <>
      <div className="w-full bg-gray-100 p-2 rounded">
        <div className="flex w-full items-center justify-between">
          <h1 className={`${lusitana.className} text-2xl text-sky-800`}>
            Categories
          </h1>
        </div>
        {/* <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <Search placeholder="Search products..." />
        </div> */}
        <div className="mt-6 mx-auto flex flex-wrap ml:grid grid-cols-3 gap-4">
          <CategoryCard />
        </div>
      </div>
    </>
  );
}
