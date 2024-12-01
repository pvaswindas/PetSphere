import React from "react";
import SearchBar from "./SearchBar";
import mainLogo from "../../../assets/logo/main-logo.png";
import Button from "../../forms/Button";

const Navbar = () => {
  return (
    <nav className="w-full bg-white shadow-md flex items-center justify-between px-4 md:px-6" style={{ height: '65px' }}>
      {/* Start Section */}
      <div className="flex items-center space-x-4">
        {/* Logo */}
        <img
          src={mainLogo}
          alt="PetSphere Logo"
          className="w-[100px] h-[40px] md:w-[131px] md:h-[50px]"
        />
      </div>

      {/* Middle Section */}
      <div className="hidden md:flex items-center justify-start gap-16 ml-30 md:ml-40 w-3/4">
        <SearchBar />
        <Button
          rounded="rounded-md"
          paddingx="px-10"
          paddingy="py-1.5"
          text="Add New Post"
          backgroundColor="bg-og-gradient"
          className="whitespace-nowrap"
        />
      </div>

      {/* End Section  */}
      <div className="flex-grow"></div>
    </nav>
  );
};

export default Navbar;
