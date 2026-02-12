"use client";

import { lusitana, inter } from "@/app/ui/fonts";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/app/ui/button";
import { useState } from "react";
import {
  DivideIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

// The imports from the review file of seller
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { StarIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";

// import { createSellerReview, type ReviewState } from "@/app/lib/review-actions";

export default function Review() {
  const [reviews, setReviews] = useState([
    {
      name: "John Big",
      message: "This is a good work, It looks lovely.",
      id: 1,
    },
    {
      name: "John Big",
      message: "This is a good work, It looks lovely.",
      id: 2,
    },
    {
      name: "John Big",
      message: "This is a good work, It looks lovely.",
      id: 3,
    },
  ]);

  function handleDelete(id: number) {
    setReviews(reviews.filter((review) => review.id !== id));
  }

  return (
    <>
      <div className="my-8">
        {reviews.map((review) => (
          <div key={review.id}>
            <div className="p-2 h-14 max-h-28 overflow-auto bg-gray-50 rounded-xl my-3 mx-4 shadow-sm relative group">
              <p
                className={`${inter.className} text-gray-600 text-xs text-left`}
              >
                <strong
                  className={`${lusitana.className} text-gray-800 text-sm`}
                >
                  {`${review.name} `}
                </strong>{" "}
                <br />
                {`${review.message}`}
              </p>

              <div className="mx-3 absolute right-3 top-1 hidden group-hover:flex">
                <button>
                  <PencilIcon className="w-5 mr-1" />
                </button>
                <button
                  onClick={() => {
                    handleDelete(review.id);
                  }}
                >
                  <TrashIcon className="w-5 " />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
