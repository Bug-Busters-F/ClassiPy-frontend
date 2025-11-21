import { useState } from "react";
import { Link } from "react-router-dom";
import ButtonNav from "./ButtonNav";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="px-4 sm:px-[3%] py-4 flex items-center border justify-between bg-white/75 backdrop-blur-lg border-gray-200">
      <Link to={"/"}>
        <div className="flex items-center">
          <div className="bg-blue-600 rounded-md w-10 h-10 flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-2xl">
              lan
            </span>
          </div>
          <h1 className="text-xl md:text-2xl text-gray-800 font-bold pl-2">
            ClassiPy
          </h1>
        </div>
      </Link>

      <button
        className="md:hidden p-2 text-gray-800 hover:text-blue-600 focus:outline-none"
        onClick={toggleMenu}
        aria-label="Toggle navigation"
      >
        <span className="material-symbols-outlined text-3xl">
          {isOpen ? "close" : "menu"}
        </span>
      </button>

      <div className="hidden md:flex items-center gap-4 md:gap-10">
        <ButtonNav name="Home" path="/" />
        <ButtonNav name="Histórico" path="/history" />
        <ButtonNav name="Processo" path="/process" />
      </div>

      <div
        className={`
          md:hidden 
          ${isOpen ? "flex" : "hidden"} 
          flex-col 
          absolute 
          top-full 
          left-0 
          w-full 
          bg-white 
          border-b 
          border-gray-200 
          shadow-lg
          z-10
        `}
      >
        <ButtonNav name="Home" path="/" isMobile onClick={toggleMenu} />
        <ButtonNav name="Histórico" path="/history" isMobile onClick={toggleMenu} />
        <ButtonNav name="Processo" path="/process" isMobile onClick={toggleMenu} />
      </div>
    </div>
  );
};

export default Navbar;