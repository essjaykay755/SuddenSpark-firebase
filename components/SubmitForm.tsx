"use client";

import { useState } from "react";
import { submitThought } from "@/lib/thoughts";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface SubmitFormProps {
  onClose: () => void;
  onSubmit: () => Promise<void>;
}

export default function SubmitForm({ onClose, onSubmit }: SubmitFormProps) {
  const [content, setContent] = useState("");
  const [username, setUsername] = useState("");
  const [twitter, setTwitter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitThought({ content, username, twitter });
      await onSubmit();
      onClose();
    } catch (error) {
      console.error("Error submitting thought:", error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      className="bg-[#FCBA28] rounded-lg p-6 relative"
    >
      <h2 className="text-2xl font-bold mb-4 text-[#0F0D0E]">
        Add Your Thought
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-[#0F0D0E]"
          >
            Your Thought
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0F0D0E] focus:ring-[#0F0D0E] bg-white dark:bg-[#0F0D0E] text-gray-900 dark:text-white p-3"
            rows={4}
            required
          />
        </div>
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-[#0F0D0E]"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0F0D0E] focus:ring-[#0F0D0E] bg-white dark:bg-[#0F0D0E] text-gray-900 dark:text-white p-3"
            required
          />
        </div>
        <div>
          <label
            htmlFor="twitter"
            className="block text-sm font-medium text-[#0F0D0E]"
          >
            X (Twitter) Handle (optional)
          </label>
          <input
            type="text"
            id="twitter"
            value={twitter}
            onChange={(e) => setTwitter(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0F0D0E] focus:ring-[#0F0D0E] bg-white dark:bg-[#0F0D0E] text-gray-900 dark:text-white p-3"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#0F0D0E] text-white rounded-md py-3 px-4 hover:bg-[#231F20] transition-colors duration-200 flex items-center justify-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin mr-2" size={20} />
              Submitting...
            </>
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </motion.div>
  );
}
