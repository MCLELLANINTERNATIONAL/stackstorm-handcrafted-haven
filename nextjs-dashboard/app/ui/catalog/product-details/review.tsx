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

export function AddReview() {
  const [isAddReview, setIsAddReview] = useState(false);

  function handleAddReview() {
    setIsAddReview(true);
  }
  return (
    <>
      {isAddReview && <div>the form</div>}
      <Button className="bg-violet-600" onClick={handleAddReview}>
        {isAddReview ? "Submit" : "Add Review"}
      </Button>
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
