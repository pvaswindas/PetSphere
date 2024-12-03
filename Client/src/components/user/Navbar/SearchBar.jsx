import React from "react";
import searchIcon from "../../../assets/icon/search-icon.svg"

const SearchBar = ({ placeholder = "Search", onChange, value }) => {
  return (
    <div className="flex items-center py-1 px-3 bg-[#B9B9B9]/15 rounded-md w-1/2">
      <img src={searchIcon}
      alt="Search"
      className="w-4"
      />
      <input
        type="text"
        placeholder={placeholder}
        className="flex-1 bg-transparent focus:outline-none px-3 text-gray-500 placeholder-lightTextGrey"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default SearchBar;
