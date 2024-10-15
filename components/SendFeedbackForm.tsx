"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface SendFeedbackFormProps {
  onClose: () => void;
  onSubmit: () => void;
}

export default function SendFeedbackForm({
  onClose,
  onSubmit,
}: SendFeedbackFormProps) {
  const [feedback, setFeedback] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ feedback, email }),
    });
    onSubmit();
    onClose();
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      className="bg-[#FCBA28] rounded-lg p-6 relative"
    >
      <h2 className="text-2xl font-bold mb-4 text-[#0F0D0E]">Send Feedback</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="feedback"
            className="block text-sm font-medium text-[#0F0D0E]"
          >
            Your Feedback
          </label>
          <textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0F0D0E] focus:ring-[#0F0D0E] bg-white dark:bg-[#0F0D0E] text-gray-900 dark:text-white p-3"
            rows={4}
            required
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[#0F0D0E]"
          >
            Email (optional)
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0F0D0E] focus:ring-[#0F0D0E] bg-white dark:bg-[#0F0D0E] text-gray-900 dark:text-white p-3"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#0F0D0E] text-white rounded-md py-3 px-4 hover:bg-[#231F20] transition-colors duration-200"
        >
          Submit Feedback
        </button>
      </form>
    </motion.div>
  );
}
