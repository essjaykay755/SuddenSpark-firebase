"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

export default function Modal({ children, onClose }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      >
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={onClose}
        ></div>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="relative w-full max-w-lg max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3rem)] bg-transparent rounded-lg overflow-hidden"
        >
          <div className="absolute top-2 right-2 z-10">
            <button
              onClick={onClose}
              className="p-1 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 transition-colors duration-200"
              aria-label="Close modal"
            >
              <X size={24} className="text-white" />
            </button>
          </div>
          <div className="w-full h-full overflow-y-auto pt-12 pb-6 px-6 bg-[#0F0D0E] rounded-lg">
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
