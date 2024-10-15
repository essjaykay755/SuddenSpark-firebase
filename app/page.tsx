"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ThoughtList from "@/components/ThoughtList";
import FilterBar from "@/components/FilterBar";
import SubmitForm from "@/components/SubmitForm";
import SendFeedbackForm from "@/components/SendFeedbackForm";
import Modal from "@/components/Modal";
import { getFilteredThoughts } from "@/lib/thoughts";
import { PlusCircle } from "lucide-react";

import { Thought } from "@/types/thought";

// ... (rest of the file content remains the same)

// ... (rest of the file content remains the same)

export default function Home() {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [activeFilter, setActiveFilter] = useState<"hot" | "new" | "top">(
    "hot"
  );
  const [visibleThoughts, setVisibleThoughts] = useState(9);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  useEffect(() => {
    const fetchThoughts = async () => {
      const fetchedThoughts = await getFilteredThoughts(activeFilter);
      setThoughts(fetchedThoughts);
      setVisibleThoughts(9);
    };
    fetchThoughts();
  }, [activeFilter]);

  const handleFilterChange = (filter: "hot" | "new" | "top") => {
    setActiveFilter(filter);
  };

  const loadMore = () => {
    setVisibleThoughts((prevVisible) => prevVisible + 9);
  };

  const handleSubmit = async () => {
    const fetchedThoughts = await getFilteredThoughts(activeFilter);
    setThoughts(fetchedThoughts);
  };

  return (
    <>
      <div className="space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold mb-2">SuddenSpark</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Share your random thoughts. No account needed!
          </p>
        </header>
        <div className="flex justify-center">
          <button
            onClick={() => setShowSubmitForm(true)}
            className="bg-[#FCBA28] hover:bg-[#fcc85c] text-[#0F0D0E] font-bold py-3 px-6 rounded-full transition-colors duration-200 flex items-center"
          >
            <PlusCircle size={24} className="mr-2" />
            Add your best sudden spark
          </button>
        </div>
        <FilterBar
          onFilterChange={handleFilterChange}
          activeFilter={activeFilter}
        />
        <ThoughtList thoughts={thoughts.slice(0, visibleThoughts)} />
        {visibleThoughts < thoughts.length && (
          <div className="flex justify-center mt-12">
            <button
              onClick={loadMore}
              className="bg-[#FCBA28] hover:bg-[#fcc85c] text-[#0F0D0E] font-bold py-2 px-4 rounded-full transition-colors duration-200"
            >
              Load More
            </button>
          </div>
        )}
      </div>
      <div className="bg-gray-100 dark:bg-[#0F0D0E] text-gray-800 dark:text-white py-16 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6 text-center">
            What is a SuddenSpark?
          </h2>
          <p className="text-lg max-w-3xl mx-auto text-center">
            <strong>SuddenSpark</strong> is the place where your random, quirky,
            and fleeting thoughts find a home! Share those unexpected moments of
            brilliance, weird ideas, and shower musings that might not make
            total sense—but somehow feel right. Explore a world of spontaneous
            thoughts from others and ignite your own spark of inspiration!
          </p>
        </div>
      </div>
      <footer className="bg-gray-200 dark:bg-[#231F20] text-gray-800 dark:text-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="flex flex-col items-center md:items-start">
              <div className="w-16 h-16 bg-[#FCBA28] rounded-full mb-2"></div>
              <span className="font-bold text-xl">SuddenSpark</span>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Filters</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => handleFilterChange("hot")}
                    className="hover:text-[#FCBA28] transition-colors duration-200"
                  >
                    Hot
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleFilterChange("new")}
                    className="hover:text-[#FCBA28] transition-colors duration-200"
                  >
                    New
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleFilterChange("top")}
                    className="hover:text-[#FCBA28] transition-colors duration-200"
                  >
                    Top
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Links</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setShowSubmitForm(true)}
                    className="hover:text-[#FCBA28] transition-colors duration-200"
                  >
                    Add SuddenSpark
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setShowFeedbackForm(true)}
                    className="hover:text-[#FCBA28] transition-colors duration-200"
                  >
                    Send Feedback
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="bg-gray-300 dark:bg-[#0F0D0E] py-4 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
            <p>
              Made with ❤️ and ☕️ by{" "}
              <a
                href="https://github.com/essjaykay755"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FCBA28] hover:underline font-medium"
              >
                Subhojit Karmakar
              </a>
            </p>
          </div>
        </div>
      </footer>
      {showSubmitForm && (
        <Modal onClose={() => setShowSubmitForm(false)}>
          <SubmitForm
            onClose={() => setShowSubmitForm(false)}
            onSubmit={handleSubmit}
          />
        </Modal>
      )}
      {showFeedbackForm && (
        <Modal onClose={() => setShowFeedbackForm(false)}>
          <SendFeedbackForm
            onClose={() => setShowFeedbackForm(false)}
            onSubmit={() => {}}
          />
        </Modal>
      )}
    </>
  );
}
