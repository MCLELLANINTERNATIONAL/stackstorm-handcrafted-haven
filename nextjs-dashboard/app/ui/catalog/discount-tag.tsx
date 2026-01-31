import { lusitana, inter } from "@/app/ui/fonts";

export default function DiscountTag({ discount }: { discount: number }) {
  return (
    <>
      <div
        className={`${inter.className} p-1 rounded-xl w-14 bg-blue-900 text-center`}
      >
        <p className=" text-white font-bold text-xs">
          {discount ? `-${discount}%` : ``}
        </p>
      </div>
    </>
  );
}
