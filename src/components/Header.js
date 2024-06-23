import React from "react";
import { FiHome } from "react-icons/fi";
import { RiBookletLine } from "react-icons/ri";
import { FiArchive } from "react-icons/fi";
import { GoGear } from "react-icons/go";
import { FaBars } from "react-icons/fa6";
import Brizadeiro from "../assets/brigadeiro-flat-background 1.png";
import { Link, useLocation } from "react-router-dom";

function Header() {
  const location = useLocation();
  const currentPath = location.pathname;

  const activeBorder = (
    <div className="absolute left-[-12px] top-1/2 transform -translate-y-1/2 h-8 w-1 bg-purple rounded-full"></div>
  );

  return (
    <div className="flex flex-col h-full items-center justify-start min-w-14 gap-6 pt-2 bg-lightBoxBackground dark:bg-darkBoxBackground text-darkBoxBackground dark:text-lightBoxBackground">
      <div>
        <img src={Brizadeiro} alt="brizadeiro" />
      </div>
      <Link to="/" className="relative">
        {currentPath === "/" && activeBorder}
        <FiHome className="text-xl" />
      </Link>
      <Link to="/produtos" className="relative">
        {currentPath === "/produtos" && activeBorder}
        <RiBookletLine className="text-xl" />
      </Link>
      <Link to="/estoque" className="relative">
        {currentPath === "/estoque" && activeBorder}
        <FiArchive className="text-xl" />
      </Link>
      <Link to="/configuracao" className="relative">
        {currentPath === "/configuracao" && activeBorder}
        <GoGear className="text-xl" />
      </Link>
      <div>
        <FaBars className="text-xl" />
      </div>
    </div>
  );
}

export default Header;
