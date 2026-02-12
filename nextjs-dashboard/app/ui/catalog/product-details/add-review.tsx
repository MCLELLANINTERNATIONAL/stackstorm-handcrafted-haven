"use client";

import { lusitana, inter } from "@/app/ui/fonts";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/app/ui/button";
import { useState } from "react";
// import { reviewFormSchema } from "@/app/lib/prod-action";
import { processReviewForm } from "@/app/lib/review-action";

export function AddReview(pData: any) {
  const [isAddReview, setIsAddReview] = useState(false);

  function handleAddReview() {
    setIsAddReview((prev) => !prev);
  }

  const d = new Date();
  const theDate = d.toLocaleDateString();
  return (
    <>
      {isAddReview && (
        <div className="px-6">
          {/* ****************************************** */}

          <form
            action={async (fd) => {
              processReviewForm(fd);
            }}
            className="mt-6 space-y-4"
          >
            {/* Seller id is DB-generated; user never edits this */}
            <input type="hidden" name="product_id" value={`${pData}`} />

            <input type="hidden" name="review_date" value={`${theDate}`} />

            <div className="inline-block">
              <label
                htmlFor="customerName"
                className={`${inter.className} text-sm text-gray-500`}
              >
                Your Name:
              </label>
              <input
                id="customerName"
                name="customer_name"
                className="w-full rounded-md border p-2 text-sm"
                required
              />
            </div>

            <div className="inline-block">
              <label
                htmlFor="customerEmail"
                className={`${inter.className} text-sm text-gray-500`}
              >
                Your Email:
              </label>
              <input
                id="customerEmail"
                name="customer_email"
                className="w-full rounded-md border p-2 text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="review"
                className={`${inter.className} text-sm text-gray-500`}
              >
                Review text
              </label>
              <textarea
                id="review"
                name="cust_review"
                placeholder="Write your review about the product..."
                className="w-full rounded-md border p-2 text-sm"
                rows={3}
                required
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="rounded-md bg-blue-600 px-4 py-2  text-sm font-bold text-white
        transition-colors hover:bg-green-600"
              >
                Submit review
              </button>
            </div>
          </form>

          {/* ****************************************** */}
        </div>
      )}
      <Button className="bg-violet-600 mx-4" onClick={handleAddReview}>
        {isAddReview ? "Cancel" : "Add Review"}
      </Button>
    </>
  );
}

// The copied code from the seller component.
// export function ReviewForm({ prosuctId }: { productId: string }) {
//   const router = useRouter();
//   const initialState: ReviewState = { message: "", errors: {} };

//   const [rating, setRating] = useState(5);
//   const [state, formAction] = useActionState(createSellerReview, initialState);

//   return (
//     <form
//       action={async (fd) => {
//         // Inject star rating into form data (server action expects "rating")
//         fd.set("rating", String(rating));

//         // Ensure sellerId is present (DB-generated sellers.id)
//         fd.set("sellerId", prosuctId);

//         await formAction(fd);

//         // Refresh UI after submit (so new review appears)
//         router.refresh();
//       }}
//       className="mt-6 space-y-4"
//     >
//       {/* Seller id is DB-generated; user never edits this */}
//       <input type="hidden" name="sellerId" value={sellerId} />

//       <StarRating rating={rating} onChange={setRating} />
//       {state.errors?.rating?.map((e) => (
//         <p key={e} className="text-sm text-red-600">
//           {e}
//         </p>
//       ))}

//       <div>
//         <label htmlFor="productName" className="sr-only">
//           Product name
//         </label>
//         <input
//           id="productName"
//           name="productName"
//           placeholder="Product name (optional)"
//           className="w-full rounded-md border p-2 text-sm"
//         />
//         {state.errors?.productName?.map((e) => (
//           <p key={e} className="text-sm text-red-600">
//             {e}
//           </p>
//         ))}
//       </div>

//       <div>
//         <label htmlFor="comment" className="sr-only">
//           Review text
//         </label>
//         <textarea
//           id="comment"
//           name="comment"
//           placeholder="Write your review about the product..."
//           className="w-full rounded-md border p-2 text-sm"
//           rows={4}
//           required
//         />
//         {state.errors?.comment?.map((e) => (
//           <p key={e} className="text-sm text-red-600">
//             {e}
//           </p>
//         ))}
//       </div>

//       {state.message ? (
//         <p className="text-sm text-red-600">{state.message}</p>
//       ) : null}

//       <button
//         type="submit"
//         className="rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white
//         transition-colors hover:bg-green-600"
//       >
//         Submit review
//       </button>
//     </form>
//   );
// }

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
