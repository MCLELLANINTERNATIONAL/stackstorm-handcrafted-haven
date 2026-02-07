import { lusitana, inter } from "@/app/ui/fonts";
import Link from "next/link";
import Image from "next/image";
import DiscountTag from "./discount-tag";
import { Button } from "../button";
import PriceTag from "./price-tag";

export default function CategoryCard() {
  const categories = [
    {
      name: "Christmas",
      imagePath: "/products/christmas/c10.jpeg",
      description:
        "Uniquely crafted christmas items for a beautiful season. Bring the spirit of christmas to your home.",
      id: "1",
    },
    {
      name: "Crochet Knitted",
      imagePath: "/products/crochet_knitted/ck2.png",
      description:
        "Amazing crafted crochet knitted piece for you, family, and friends.",
      id: "2",
    },
    {
      name: "Woods",
      imagePath: "/products/wood/ls5.png",
      description: "Beautiful wood craft for home and offices decorations ",
      id: "3",
    },
    {
      name: "Arts",
      imagePath: "/products/christmas/c5.jpeg",
      description:
        "Inspired painting of some of the greatest mind ever lived. Embrace the beauty of creativity. ",
      id: "4",
    },
    {
      name: "Carvings",
      imagePath: "/products/christmas/c7.jpeg",
      description:
        "Wonderful sculptures to fill those empty spaces at home and offices.",
      id: "5",
    },
  ];
  //   const sellers = [];
  return (
    <>
      {categories.map((category) => (
        <Link
          href={`catalog/${category.id}`}
          className="hover: cursor-pointer"
          key={category.id}
        >
          <div className="mt-5 w-60 h-72 bg-gray-100 shadow-md shadow-gray-400 rounded-lg overflow-auto m-3 p-2 hover:scale-95 transition-all">
            <div className="rounded-lg w-full overflow-hidden h-44 relative ">
              <Image
                src={`${category.imagePath}`}
                className="mr-2 object-cover w-full h-full"
                width={250}
                height={180}
                alt={`${category.name}'s profile picture`}
              />
            </div>
            <div className="p-2">
              <h2
                className={`${inter.className} text-xl font-bold`}
              >{`${category.name}`}</h2>
              <p
                className={`${inter.className} text-xs text-gray-600`}
              >{`${category.description}`}</p>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}
