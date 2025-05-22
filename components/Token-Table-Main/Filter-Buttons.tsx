import type React from "react";
import { FilterButtonsProps } from '@/types/Token-Table'

const FilterButtons: React.FC<FilterButtonsProps> = ({ filterState, setFilterState }) => {
  return (
    <div className="mb-4 flex justify-center space-x-2">
      <button
        onClick={() => setFilterState("active")}
        className={`px-4 py-2 cursor-pointer rounded-md text-sm font-medium transition-colors duration-200 ${
          filterState === "active"
            ? "bg-indigo-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-indigo-100"
        }`}
      >
        Active Tokens
      </button>
      <button
        onClick={() => setFilterState("terminated")}
        className={`px-4 py-2 cursor-pointer rounded-md text-sm font-medium transition-colors duration-200 ${
          filterState === "terminated"
            ? "bg-indigo-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-indigo-100"
        }`}
      >
        Terminated Tokens
      </button>
    </div>
  );
};

export default FilterButtons;