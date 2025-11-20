import { NavLink } from "react-router-dom";

interface ButtonNavProps {
  name: string;
  path: string;
  isMobile?: boolean;
  onClick?: () => void;
}

function ButtonNav({ name, path, isMobile = false, onClick }: ButtonNavProps) {
  return (
    <NavLink
      to={path}
      onClick={onClick}
      className={({ isActive }) => `
        relative
        cursor-pointer
        transition-colors duration-300 ease-in-out
        ${isMobile 
          ? "w-full text-left px-4 py-3 text-lg border-t border-gray-100" 
          : "text-lg py-1 px-2 md:p-2"
        }
        
        ${isMobile ? 
          (isActive ? "text-blue-600 bg-blue-50/70" : "text-gray-700 hover:text-blue-600 hover:bg-gray-50") 
          : 
          `after:content-[''] 
          after:absolute 
          after:left-0 
          after:bottom-[-2px] 
          after:h-[2px] 
          after:bg-blue-600 
          after:transition-all after:duration-300 after:ease-in-out
          
          ${isActive
            ? "text-blue-600 after:w-full"
            : "text-gray-600 hover:text-blue-600 hover:after:w-full after:w-0"
          }`
        }
      `}
    >
      {name}
    </NavLink>
  );
}

export default ButtonNav;