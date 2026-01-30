import { lusitana } from "@/app/ui/fonts";
import { Suspense } from "react";
import Search from "@/app/ui/search";
import Link from "next/link";
import Image from "next/image";

export default function SellerCard({
  sellerDetails,
}: {
  sellerDetails: {
    name: string;
    imagePath: string;
    address: string;
    phone: string;
    email: string;
    skills: string;
    id: string;
  };
}) {
  //   const sellers = [];
  return (
    <>
      <Link
        href={`/profile/${sellerDetails.id}`}
        className="hover: cursor-pointer"
      >
        <div className="mt-5 w-80 bg-gray-100 shadow-md, rounded overflow-hidden m-3">
          <Image
            src={`${sellerDetails.imagePath}`}
            className="mr-2"
            width={320}
            height={200}
            alt={`${sellerDetails.name}'s profile picture`}
          />
          <div className="p-2">
            <h2
              className={`${lusitana.className} text-3xl`}
            >{`${sellerDetails.name}`}</h2>
            <h3>{`${sellerDetails.address}`}</h3>
            <div className="flex justify-start text-sm">
              <p className="mr-2">{`${sellerDetails.phone}`}</p>
              <p>{`${sellerDetails.email}`}</p>
            </div>
            <p className="text-sm">
              <strong>Skills:</strong>
              {`${sellerDetails.skills}.`}
            </p>
          </div>
        </div>
      </Link>

      {/* {sellers.map((seller) => (
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
      ))} */}
    </>
  );
}
