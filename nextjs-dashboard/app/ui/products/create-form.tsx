"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createProductAsOwner, type ProductState } from "@/app/lib/product-actions";
// (keep your heroicons imports as-is)

export default function ProductForm({
  sellerId,
  backHref,
}: {
  sellerId: string;
  backHref: string;
}) {
  const initialState: ProductState = { message: "", errors: {} };

  const action = async (prev: ProductState, formData: FormData) => {
    return createProductAsOwner(sellerId, prev, formData);
  };

  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction}>
      {/* ...your existing fields unchanged... */}

      <div className="mt-6 flex justify-center gap-4">
        <Link
          href={backHref}
          className="inline-flex h-11 w-56 items-center justify-center rounded-lg bg-gray-200 px-4 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-300"
        >
          Cancel
        </Link>

        <button
          type="submit"
          className="inline-flex h-11 w-56 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-bold text-white transition-colors hover:bg-green-600"
        >
          Add New Product
        </button>
      </div>

      {state.message ? <p className="mt-3 text-sm text-red-500">{state.message}</p> : null}
    </form>
  );
}
