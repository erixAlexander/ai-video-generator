"use client";
import React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  return (
    <div className="h-[calc(100vh-100px)] w-full flex flex-col items-center justify-center gap-8">
      <div className=" flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
          <h2 className="text-2xl font-semibold mb-4 text-primary">
            Complete Your Payment on Paypal
          </h2>
          <p className="text-gray-600 mb-6">
            Each <strong>10</strong> credits gives you access to one video, you
            can buy <strong>50</strong> credits below for just <strong>1 Dollar</strong>!
          </p>
        </div>
      </div>
      <button
        onClick={async () => {
          const result = await axios.post("/api/checkout");

          router.push(result.data.link);
        }}
        className="bg-yellow-400 text-blue-700 font-bold py-1 px-20 rounded-lg shadow-md hover:bg-yellow-500 transition-all"
      >
        Buy 50 Credits
      </button>
    </div>
  );
};

export default Page;
