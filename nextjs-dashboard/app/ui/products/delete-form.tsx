"use client";

import Link from "next/link";
import { useActionState } from "react";
import { deleteProductAsOwner } from "@/app/lib/product-actions";

type DeleteState = { message: string };

export default function DeleteProductForm({
  sellerId,
  productId,
  backHref,
}: {
  sellerId: string;
  productId: string;
  backHref: string;
}) {
  const initialState: DeleteState = { message: "" };

  const action = async (_prev: DeleteState, formData: FormData) => {
    try {
      const confirm = String(formData.get("confirm") ?? "").trim();
      if (confirm !== "DELETE") return { message: "Type DELETE exactly to confirm." };

      await deleteProductAsOwner(productId, sellerId);
      return { message: "" };
    } catch (err: unknown) {
      return { message: err instanceof Error ? err.message : "Failed to delete product." };
    }
  };

  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {/* unchanged UI */}
      <p className="text-sm text-gray-700">
        Type <span className="font-semibold">DELETE</span> below to confirm.
      </p>

      <input
        id="confirm"
        name="confirm"
        placeholder="Type DELETE to confirm"
        className="w-full rounded-md border border-red-200 bg-white p-2 text-sm outline-none focus:ring-2 focus:ring-red-300"
        required
      />

      {state.message ? <p className="text-sm text-red-700">{state.message}</p> : null}

      <div className="flex items-center gap-3">
        <Link
          href={backHref}
          className="rounded-md border bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
        >
          {isPending ? "Deleting…" : "Permanently Delete Product"}
        </button>
      </div>

      <p className="text-xs text-gray-600">
        Deleting this product will remove it permanently and cannot be undone.
      </p>
    </form>
  );
}