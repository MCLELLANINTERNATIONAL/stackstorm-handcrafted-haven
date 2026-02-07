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
      <div className="">
        {reviews.map((review) => (
          <div key={review.id}>
            <div className="p-2 h-14 overflow-auto bg-gray-50 rounded-xl m-2 shadow-sm">
              <p
                className={`${inter.className} text-gray-600 text-xs text-left`}
              >
                <strong
                  className={`${lusitana.className} text-gray-800 text-sm`}
                >
                  {`${review.name} `}
                </strong>
                {`${review.message}`}
              </p>
            </div>
            <div className="flex m-2">
              <button>
                <PencilIcon className="w-3 mr-1" />
              </button>
              <button
                className="w-3"
                onClick={() => {
                  handleDelete(review.id);
                }}
              >
                <TrashIcon className="w-3 " />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export function AddReview() {
  const [isAddReview, setIsAddReview] = useState(false);
  return (
    <>
      <button>Add Review</button>
    </>
  );
}

{
  /* <h2
            className={`${lusitana.className} text-gray-800 text-sm text-left`}
          >{`${review.name}`}</h2>
          <p
            className={`${inter.className} text-gray-600 text-xs text-left pt-1`}
          >
            {`${review.message}`}
          </p> */
}
