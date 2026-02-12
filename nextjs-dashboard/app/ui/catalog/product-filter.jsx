import { lusitana, inter } from "@/app/ui/fonts";
import Link from "next/link";
import Image from "next/image";
import DiscountTag from "./discount-tag";
import { Button } from "../button";
import PriceTag from "./price-tag";

export default function ProductsFilters() {
  return (
    <>
      <div>
        <div>
          <p>Filter By:</p>
        </div>
        <div>
          <select
            className="p-2 border rounded border-gray-500"
            name="category"
            id=""
            defaultValue={""}
          >
            <option value="">Category...</option>
            <option value="1">Christmas</option>
            <option value="2">Crochet knitted</option>
            <option value="3">Wood</option>
          </select>
        </div>
        <div></div>
      </div>
    </>
  );
}
