"use client";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect, useState, Suspense } from "react";
import { UserDetailContext } from "../../_context/UserDetailContext";

const CompleteOrderContent = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { user } = useUser();
  const { setUserDetail } = useContext(UserDetailContext);
  const [loading, setLoading] = useState(true);

  const completeOrder = async () => {
    try {
      await axios.post("/api/complete-order", {
        orderId: token,
        userEmail: user?.primaryEmailAddress?.emailAddress,
      });
      setUserDetail((prev) => ({ ...prev, credits: prev.credits + 50 }));
    } catch (error) {
      console.error("Capture error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && user) {
      const captureKey = `orderCaptured_${token}`;
      if (!sessionStorage.getItem(captureKey)) {
        sessionStorage.setItem(captureKey, "true");
        completeOrder();
      } else {
        console.log("Order already captured for token:", token);
      }
    }
  }, [token]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-4xl">Loading</h1>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
        <svg
          className="mx-auto mb-4 w-16 h-16 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2l4 -4m0 0a9 9 0 1 1 -8 4.9"
          />
        </svg>
        <h2 className="text-2xl font-semibold mb-2">Payment Successful!</h2>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your transaction has been completed
          successfully.
        </p>
        <button
          onClick={() => (window.location.href = "/dashboard")}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

const CompleteOrder = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <CompleteOrderContent />
  </Suspense>
);

export default CompleteOrder;
