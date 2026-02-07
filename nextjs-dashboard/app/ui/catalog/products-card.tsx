import { lusitana, inter } from "@/app/ui/fonts";
import Link from "next/link";
import Image from "next/image";
import DiscountTag from "./discount-tag";
import { Button } from "../button";
import PriceTag from "./price-tag";

export default function ProductsCard() {
  const products = {
    name: "Christmas",
    imagePath: "/products/christmas/c10.jpeg",
    address: "London",
    id: "1",
  };

  return (
    <>
      <Link href={`products/product-details`} className="hover: cursor-pointer">
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
      </Link>
    </>
  );
}

{
  /* {sellers.map((seller) => (
        <Link
          href={`/profile/${seller.id}`}
          className="hover: cursor-pointer"
        >
          <div className="mt-5 w-80 bg-gray-100 shadow-md, rounded overflow-hidden m-3">
            <Image
              src={`${seller.imagePath}`}
              className="mr-2"
              width={320}
              height={200}
              alt={`${seller.name}'s profile picture`}
            />
            <div className="p-2">
              <h2
                className={`${lusitana.className} text-3xl`}
              >{`${seller.name}`}</h2>
              <h3>{`${seller.address}`}</h3>
              <div className="flex justify-start text-sm">
                <p className="mr-2">{`${seller.phone}`}</p>
                <p>{`${seller.email}`}</p>
              </div>
              <p className="text-sm">
                <strong>Skills:</strong>
                {`${seller.skills}.`}
              </p>
            </div>
          </div>
        </Link>
      ))} */
}
