"use client";

import { z } from "zod";
// import { reviewFormSchema } from "./prod-action";

export const reviewFormSchema = z.object({
  product_id: z.string(),
  customer_name: z.string().min(1, { message: "Please enter a seller name." }),
  customer_email: z.string().email({ message: "Please enter a valid email." }),
  review_date: z.string().min(1, { message: "Please select a date." }),
  cust_review: z
    .string()
    .min(5, { message: "Please write at least 20 characters." }),
});

export async function processReviewForm(formData: FormData) {
  const reviewData = {
    product_id: formData.get("product_id")?.toString(),
    review_date: formData.get("review_date")?.toString(),
    customer_name: formData.get("customer_name")?.toString(),
    customer_email: formData.get("customer_email")?.toString(),
    cust_review: formData.get("cust_review")?.toString(),
  };
  const reviewResult = reviewFormSchema.safeParse(reviewData);

  if (!reviewResult.success) {
    return {
      errors: reviewResult.error.flatten().fieldErrors,
      message: "Missing fields. Failed to create seller.",
    };
  }
  console.log(reviewResult);
}
