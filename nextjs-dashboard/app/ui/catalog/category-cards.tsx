import { inter } from "@/app/ui/fonts";
import Link from "next/link";
import Image from "next/image";

export default function CategoryCardA() {
  const categories = [
    {
      slug: "christmas",
      name: "Christmas",
      imagePath: "/products/christmas/c15.png",
      description:
        "Uniquely crafted christmas items for the festive season. Bringing the spirit of christmas into your home.",
    },
    {
      slug: "crochet-knitted",
      name: "Crochet & Knitted",
      imagePath: "/products/crochet_knitted/ck2.png",
      description:
        "Amazing crafted crochet and knitted items for you, family, and friends.",
    },
    {
      slug: "home",
      name: "Home",
      imagePath: "/products/home/ls11.png",
      description: "Beautiful hand made home products.",
    },
    {
      slug: "art",
      name: "Art",
      imagePath: "/products/arts/a1.png",
      description:
        "Inspired paintings of some of the worlds greatest landscapes. Embrace the beauty of Gods creation.",
    },
    {
      slug: "wood",
      name: "Wood",
      imagePath: "/products/wood/w4.png",
      description: "Beautiful wood craft for your home and office decoration.",
    },
  ] as const;

  return (
    <>
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={`/dashboard/catalog/categories/${category.slug}`}
          className="hover:cursor-pointer"
        >
          <div className="mt-5 h-72 w-60 overflow-auto rounded-lg bg-gray-100 p-2 shadow-md shadow-gray-400 transition-all hover:scale-95">
            <div className="relative h-44 w-full overflow-hidden rounded-lg">
              <Image
                src={category.imagePath}
                className="h-full w-full object-cover"
                width={250}
                height={180}
                alt={`${category.name} category image`}
              />
            </div>

            <div className="p-2">
              <h2 className={`${inter.className} text-xl font-bold`}>
                {category.name}
              </h2>
              <p className={`${inter.className} text-xs text-gray-600`}>
                {category.description}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}