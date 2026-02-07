import { lusitana, inter } from "@/app/ui/fonts";
import Link from "next/link";
import Image from "next/image";
import DiscountTag from "./discount-tag";
import { Button } from "../button";
import PriceTag from "./price-tag";
import Review from "./product-details/review";

export default function ProductDetails() {
  const products = {
    name: "Christmas",
    imagePath: "/products/christmas/c10.jpeg",
    address: "London",
    description:
      "Uniquely crafted christmas items for a beautiful season. Bring the spirit of christmas to your home.",
    id: "1",
  };

  const artist = {
    name: "Amy Brown",
    email: "example@gmail.com",
    image: "/customers/balazs-orban.png",
  };

  const review = {
    name: "John Big",
    message: "This is a good word, It looks lovely.",
  };

  return (
    <>
      <div className="mt-5 flex justify-start h-[360px] bg-gray-100 shadow-md shadow-gray-400 rounded-lg overflow-auto m-3 p-1 ">
        <div className="rounded-lg w-96 overflow-hidden h-full relative mr-8 ">
          <Image
            src={`${products.imagePath}`}
            className="mr-2 object-cover w-full h-full"
            width={250}
            height={280}
            alt={`${products.name}'s profile picture`}
          />
        </div>
        <div className="p-2">
          <h2
            className={`${inter.className} text-xl font-bold`}
          >{`${products.name}`}</h2>
          <p
            className={`${inter.className} text-sm text-gray-700`}
          >{`${products.address}`}</p>
          <p
            className={`${inter.className} text-xs text-gray-600 pt-3`}
          >{`${products.description}`}</p>
          {/* <div className="absolute top-0 ml-2 mt-2">
            <DiscountTag discount={30} />
          </div> */}
          <div className="flex justify-start mt-4">
            <p
              className={`${lusitana.className} text-xs text-gray-500 p-3 m-3`}
            >
              Artist
            </p>
            <div className="h-16 w-16 rounded-full border-4 border-violet-400 overflow-hidden">
              <Image
                src={`${artist.image}`}
                width={60}
                height={60}
                alt="Artist_image"
                className="w-full h-full object-cover"
              />
            </div>
            <div className={`${inter.className} text-sm text-gray-600 m-3`}>
              <p>{`${artist.name}`}</p>
              <p>{`${artist.email}`} </p>
            </div>
          </div>
          <div className="flex justify-between flex-row w-40 mt-10">
            <PriceTag price={87} />
            <Button children={"Buy Now"} className={"bg-violet-600"} />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex justify-start">
            <div>
              <Review />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

{
  /* <div className="rounded-lg w-full overflow-hidden h-44 relative ">
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
        </div> */
}
