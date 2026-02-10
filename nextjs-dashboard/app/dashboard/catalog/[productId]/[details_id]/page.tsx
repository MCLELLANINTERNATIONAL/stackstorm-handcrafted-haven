import { lusitana, inter } from "@/app/ui/fonts";
import Link from "next/link";
import Image from "next/image";
import ProductDetails from "@/app/ui/catalog/product-details";

export default function Page() {
  const products = {
    name: "Christmas",
    imagePath: "/products/christmas/c10.jpeg",
    address: "London",
    id: "1",
  };

  return (
    <>
      <ProductDetails />
    </>
  );
}

{
  /* <Link href={`products/product-details`} className="hover: cursor-pointer">
        <div className="mt-5 w-60 mh-72 bg-gray-100 shadow-md shadow-gray-400 rounded-lg overflow-auto m-3 p-2 hover:scale-95 transition-all">
          <div className="rounded-lg w-full overflow-hidden h-44 relative ">
            <Image
              src={`${products.imagePath}`}
              className="mr-2 object-cover w-full h-full"
              width={250}
              height={180}
              alt={`${products.name}'s profile picture`}
            />
            <div className="absolute top-0 ml-2 mt-2">
              <DiscountTag discount={30} />
            </div>
          </div>
          <div className="p-2">
            <h2
              className={`${inter.className} text-xl font-bold`}
            >{`${products.name}`}</h2>
            <p
              className={`${inter.className} text-xs text-gray-600`}
            >{`${products.address}`}</p>
          </div>
          <div className="flex justify-between items-center">
            <PriceTag price={87} />
            <Button children={"Buy Now"} />
          </div>
        </div>
      </Link> */
}
