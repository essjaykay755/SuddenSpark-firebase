"use client";

import { useState, useEffect } from "react";
import { voteThought, getThoughtById } from "@/lib/thoughts";
import { Thought } from "@/types/thought";
import Modal from "./Modal";
import { X, Loader2 } from "lucide-react";
import tinycolor from "tinycolor2";
import { Timestamp } from "firebase/firestore";

export default function ThoughtList({
  thoughts: initialThoughts,
}: {
  thoughts: Thought[];
}) {
  const [thoughts, setThoughts] = useState<Thought[]>(initialThoughts);
  const [selectedThought, setSelectedThought] = useState<Thought | null>(null);
  const [filteredUsername, setFilteredUsername] = useState<string | null>(null);
  const [userVotes, setUserVotes] = useState<Record<string, string>>(() => {
    if (typeof window !== "undefined") {
      const savedVotes = localStorage.getItem("userVotes");
      return savedVotes ? JSON.parse(savedVotes) : {};
    }
    return {};
  });
  const [isVoting, setIsVoting] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setThoughts(initialThoughts);
  }, [initialThoughts]);

  useEffect(() => {
    localStorage.setItem("userVotes", JSON.stringify(userVotes));
  }, [userVotes]);

  const filteredThoughts = filteredUsername
    ? thoughts.filter((thought) => thought.username === filteredUsername)
    : thoughts;

  const handleUsernameClick = (username: string) => {
    setFilteredUsername(username);
    setSelectedThought(null);
  };

  const resetFilter = () => {
    setFilteredUsername(null);
  };

  const handleVote = async (
    thoughtId: string,
    voteType: keyof Thought["votes"]
  ) => {
    setIsVoting((prev) => ({ ...prev, [thoughtId]: true }));
    const prevVote = userVotes[thoughtId] as keyof Thought["votes"] | undefined;

    try {
      if (prevVote === voteType) {
        // User is trying to vote for the same type, do nothing
        return;
      }

      // Optimistically update the UI
      setThoughts((prevThoughts) =>
        prevThoughts.map((thought) => {
          if (thought.id === thoughtId) {
            const updatedVotes = { ...thought.votes };
            if (prevVote) {
              updatedVotes[prevVote] = Math.max(0, updatedVotes[prevVote] - 1);
            }
            updatedVotes[voteType] = (updatedVotes[voteType] || 0) + 1;
            return { ...thought, votes: updatedVotes };
          }
          return thought;
        })
      );

      // Update user votes
      setUserVotes((prev) => ({ ...prev, [thoughtId]: voteType }));

      // Send vote to server
      await voteThought(thoughtId, voteType, prevVote || null);

      // Fetch the updated thought from the server to ensure consistency
      const updatedThought = await getThoughtById(thoughtId);

      if (updatedThought) {
        setThoughts((prevThoughts) =>
          prevThoughts.map((thought) =>
            thought.id === thoughtId ? updatedThought : thought
          )
        );

        if (selectedThought && selectedThought.id === thoughtId) {
          setSelectedThought(updatedThought);
        }
      }
    } catch (error) {
      console.error("Error voting:", error);
      // Revert optimistic update if there's an error
      const originalThought = await getThoughtById(thoughtId);
      if (originalThought) {
        setThoughts((prevThoughts) =>
          prevThoughts.map((thought) =>
            thought.id === thoughtId ? originalThought : thought
          )
        );
        if (selectedThought && selectedThought.id === thoughtId) {
          setSelectedThought(originalThought);
        }
      }
      setUserVotes((prev) => {
        const newUserVotes = { ...prev };
        if (prevVote) {
          newUserVotes[thoughtId] = prevVote;
        } else {
          delete newUserVotes[thoughtId];
        }
        return newUserVotes;
      });
    } finally {
      setIsVoting((prev) => ({ ...prev, [thoughtId]: false }));
    }
  };

  return (
    <>
      {filteredUsername && (
        <div className="mb-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg flex justify-between items-center">
          <span>Showing all thoughts from user: {filteredUsername}</span>
          <button
            onClick={resetFilter}
            className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            aria-label="Clear filter"
          >
            <X size={20} />
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredThoughts.map((thought) => (
          <ThoughtCard
            key={thought.id}
            thought={thought}
            onClick={() => setSelectedThought(thought)}
            onUsernameClick={handleUsernameClick}
            onVote={handleVote}
            userVote={userVotes[thought.id]}
            isVoting={isVoting[thought.id]}
          />
        ))}
      </div>
      {selectedThought && (
        <Modal onClose={() => setSelectedThought(null)}>
          <ThoughtCard
            thought={selectedThought}
            fullContent
            isModal
            onUsernameClick={handleUsernameClick}
            onVote={handleVote}
            userVote={userVotes[selectedThought.id]}
            isVoting={isVoting[selectedThought.id]}
          />
        </Modal>
      )}
    </>
  );
}

function ThoughtCard({
  thought,
  onClick,
  onUsernameClick,
  onVote,
  userVote,
  isVoting,
  fullContent = false,
  isModal = false,
}: {
  thought: Thought;
  onClick?: () => void;
  onUsernameClick: (username: string) => void;
  onVote: (thoughtId: string, voteType: keyof Thought["votes"]) => void;
  userVote?: string;
  isVoting?: boolean;
  fullContent?: boolean;
  isModal?: boolean;
}) {
  const bgColor = tinycolor(thought.bgColor);
  const textColor = bgColor.isLight() ? "#000000" : "#FFFFFF";
  const buttonBgColor = bgColor.isLight()
    ? "rgba(0, 0, 0, 0.1)"
    : "rgba(255, 255, 255, 0.2)";

  const handleClick = (e: React.MouseEvent) => {
    if (onClick && !e.defaultPrevented) {
      onClick();
    }
  };

  const formatDate = (
    timestamp:
      | Timestamp
      | { seconds: number; nanoseconds: number }
      | Date
      | string
      | number
  ) => {
    let date: Date;
    try {
      if (timestamp instanceof Timestamp) {
        date = timestamp.toDate();
      } else if (timestamp instanceof Date) {
        date = timestamp;
      } else if (typeof timestamp === "number") {
        date = new Date(timestamp);
      } else if (
        typeof timestamp === "object" &&
        "seconds" in timestamp &&
        "nanoseconds" in timestamp
      ) {
        date = new Date(
          timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
        );
      } else {
        date = new Date(timestamp);
      }

      if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
      }

      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  const getVoteCount = (voteType: keyof Thought["votes"]) => {
    const count = thought.votes[voteType];
    return typeof count === "number" ? Math.max(0, count) : 0;
  };

  return (
    <div
      className={`card rounded-lg shadow-lg relative flex flex-col cursor-pointer overflow-hidden ${
        fullContent ? "min-h-[400px]" : "h-[300px]"
      }`}
      style={{ backgroundColor: thought.bgColor, color: textColor }}
      onClick={handleClick}
    >
      <div className="p-6 flex flex-col h-full">
        <div className={`flex-grow ${fullContent ? "" : "overflow-y-auto"}`}>
          <p
            className={`text-lg font-semibold ${
              fullContent ? "" : "line-clamp-4"
            }`}
          >
            {thought.content}
          </p>
        </div>
      </div>
      <div
        className={`${
          fullContent ? "absolute left-6 bottom-6" : "absolute left-4 bottom-4"
        } flex flex-col`}
      >
        <button
          className="text-sm hover:underline flex items-center"
          onClick={(e) => {
            e.preventDefault();
            onUsernameClick(thought.username);
          }}
          style={{ color: textColor }}
        >
          {thought.twitter ? (
            <>
              <X size={14} className="mr-1" />@{thought.twitter}
            </>
          ) : (
            <>By {thought.username}</>
          )}
        </button>
        <span className="text-xs opacity-75" style={{ color: textColor }}>
          Posted on {formatDate(thought.createdAt)}
        </span>
      </div>
      <div
        className={`${
          fullContent
            ? "absolute right-6 bottom-6"
            : "absolute right-4 bottom-4"
        } flex flex-col space-y-2`}
      >
        <VoteButton
          icon="👍"
          count={getVoteCount("like")}
          bgColor={buttonBgColor}
          textColor={textColor}
          onClick={() => onVote(thought.id, "like")}
          active={userVote === "like"}
          isVoting={isVoting}
        />
        <VoteButton
          icon="❤️"
          count={getVoteCount("heart")}
          bgColor={buttonBgColor}
          textColor={textColor}
          onClick={() => onVote(thought.id, "heart")}
          active={userVote === "heart"}
          isVoting={isVoting}
        />
        <VoteButton
          icon="🤯"
          count={getVoteCount("mind_blown")}
          bgColor={buttonBgColor}
          textColor={textColor}
          onClick={() => onVote(thought.id, "mind_blown")}
          active={userVote === "mind_blown"}
          isVoting={isVoting}
        />
        <VoteButton
          icon="💩"
          count={getVoteCount("poop")}
          bgColor={buttonBgColor}
          textColor={textColor}
          onClick={() => onVote(thought.id, "poop")}
          active={userVote === "poop"}
          isVoting={isVoting}
        />
      </div>
    </div>
  );
}

function VoteButton({
  icon,
  count,
  bgColor,
  textColor,
  onClick,
  active,
  isVoting,
}: {
  icon: string;
  count: number;
  bgColor: string;
  textColor: string;
  onClick: () => void;
  active: boolean;
  isVoting?: boolean;
}) {
  return (
    <button
      className={`flex items-center justify-between rounded-full px-2 py-1 text-sm hover:bg-opacity-50 transition-colors duration-200 ${
        active ? "ring-2 ring-offset-2 ring-[#FCBA28]" : ""
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      style={{ backgroundColor: bgColor, color: textColor }}
      aria-label={`Vote ${icon}`}
      disabled={isVoting}
    >
      {isVoting ? (
        <Loader2 className="animate-spin" size={12} />
      ) : (
        <span aria-hidden="true">{icon}</span>
      )}
      <span className="ml-1">{count}</span>
    </button>
  );
}
