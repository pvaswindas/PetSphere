import React from "react";

const SearchBar = ({ placeholder = "Search", onChange, value }) => {
  return (
    <div className="flex items-center p-1 bg-[#B9B9B9]/15 rounded-md w-1/2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-gray-600 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11 17a6 6 0 100-12 6 6 0 000 12zm0 0l6 6"
        />
      </svg>
      <input
        type="text"
        placeholder={placeholder}
        className="flex-1 bg-transparent focus:outline-none text-gray-800 placeholder-gray-500"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default SearchBar;
