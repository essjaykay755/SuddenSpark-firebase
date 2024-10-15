import { useState } from "react";
import { Flame, Clock, TrendingUp } from "lucide-react";

interface FilterBarProps {
  onFilterChange: (filter: "hot" | "new" | "top") => void;
  activeFilter: "hot" | "new" | "top";
}

export default function FilterBar({
  onFilterChange,
  activeFilter,
}: FilterBarProps) {
  const filters = [
    { name: "hot", icon: Flame },
    { name: "new", icon: Clock },
    { name: "top", icon: TrendingUp },
  ] as const;

  return (
    <div className="flex justify-center space-x-4">
      {filters.map(({ name, icon: Icon }) => (
        <button
          key={name}
          onClick={() => onFilterChange(name)}
          className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 flex items-center space-x-2 ${
            activeFilter === name
              ? "bg-[#FCBA28] text-[#0F0D0E]"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-[#231F20] dark:text-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          <Icon size={20} />
          <span>{name.charAt(0).toUpperCase() + name.slice(1)}</span>
        </button>
      ))}
    </div>
  );
}
