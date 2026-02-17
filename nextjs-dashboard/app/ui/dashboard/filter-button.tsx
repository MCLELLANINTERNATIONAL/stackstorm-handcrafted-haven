"use client";
import { useState } from "react";
import { lusitana } from "@/app/ui/fonts";

export default function FilterButton() {
  const [status1, setStatus1] = useState(false);
  const [status2, setStatus2] = useState(true);
  function clicking1() {
    setStatus1((prev) => !prev);
    setStatus2((prev) => !prev);
  }

  function clicking2() {
    setStatus1((prev) => !prev);
    setStatus2((prev) => !prev);
  }
  return (
    <>
      {/* The filter buttons */}
      <div className="flex justify-center">
        <p className={`${lusitana.className} p-2 rounded-xl m-1`}>
          Filter By Price:
        </p>
        <button
          className={`${lusitana.className} p-2 rounded-xl m-2 ${status1 ? "bg-blue-400 text-white" : "bg-gray-200 "}`}
          onClick={clicking1}
        >
          High - Low
        </button>
        <button
          className={`${lusitana.className} p-2 rounded-xl m-2 ${status2 ? "bg-blue-400 text-white" : "bg-gray-200 "}`}
          onClick={clicking2}
        >
          Low - High
        </button>
      </div>
    </>
  );
}
