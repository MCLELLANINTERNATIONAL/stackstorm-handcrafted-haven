"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { ProductForm } from "@/app/lib/definitions";
import { updateProductAsOwner, type ProductState } from "@/app/lib/product-actions";
import { Button } from "@/app/ui/button";

export default function EditProductForm({
  product,
  sellerId,
  backHref,
}: {
  product: ProductForm;
  sellerId: string;
  backHref: string;
}) {
  const initialState: ProductState = { message: "", errors: {} };

  const action = async (prevState: ProductState, formData: FormData) => {
    return updateProductAsOwner(product.id, sellerId, prevState, formData);
  };

  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction}>
      {/* ...your existing fields unchanged... */}

      {state.message ? <p className="mt-2 text-sm text-red-500">{state.message}</p> : null}

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href={backHref}
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
}
