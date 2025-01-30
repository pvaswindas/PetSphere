import React, { useState } from "react";
import searchIcon from "../../../assets/icon/search-icon.svg";
import { useDispatch, useSelector } from "react-redux";
import { clearGlobalSearch, setGlobalSearch } from "../../../redux/slices/GlobalSearchSlice";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useDebounce from "../../../hooks/useDebounce";

const SearchBar = ({ placeholder = "Search", addedStyles = "w-1/2 mx-12" }) => {
  const search = useSelector((state) => state.globalSearch.search);
  const [inputValue, setInputValue] = useState(search || "");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const debouncedSetSearch = useDebounce((value) => {
    dispatch(setGlobalSearch(value));
  }, 500);

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSetSearch(value);
  };

  const handleClear = () => {
    setInputValue("");
    dispatch(clearGlobalSearch());
  };


  return (
    <div className={`flex items-center py-1 px-3 bg-[#B9B9B9]/15 rounded-full lg:rounded-md ${addedStyles}`}>
      <img
        src={searchIcon}
        alt="Search"
        className="w-4 cursor-pointer"
        onClick={() => navigate("/explore")}
      />
      <input
        id="global-search"
        name="global-search"
        type="text"
        autoComplete="off"
        placeholder={placeholder}
        className="flex-1 bg-transparent focus:outline-none px-3 text-gray-500 placeholder-lightTextGrey"
        value={inputValue}
        onChange={handleChange}
      />
      {inputValue && (
        <X
          className="w-4 h-4 text-gray-500 cursor-pointer ml-2"
          onClick={handleClear}
        />
      )}
    </div>
  );
};

export default SearchBar;
