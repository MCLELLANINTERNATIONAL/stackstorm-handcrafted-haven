import { lusitana, inter } from "@/app/ui/fonts";

export default function PriceTag({ price }: { price: number }) {
  return (
    <>
      <div
        className={`${inter.className} p-1 rounded-xl w-14 bg-gray-200 text-center shadow-md`}
      >
        <p className=" text-gray-900 font-normal text-sm">
          {`$${price.toFixed(2)}`}
        </p>
      </div>
    </>
  );
}
