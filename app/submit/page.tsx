"use client";

import { useState } from "react";
import SubmitForm from "@/components/SubmitForm";
import { useRouter } from "next/navigation";
import { getFilteredThoughts } from "@/lib/thoughts";

export default function SubmitPage() {
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      await getFilteredThoughts("new"); // Refresh the thoughts
      router.push("/"); // Redirect to home page after submission
    } catch (error) {
      console.error("Error submitting thought:", error);
    }
  };

  const handleClose = () => {
    router.push("/"); // Redirect to home page when closing the form
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#0F0D0E] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <SubmitForm onClose={handleClose} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
