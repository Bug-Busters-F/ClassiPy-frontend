import { NavLink } from "react-router-dom";

interface ButtonNavProps {
  name: string;
  path: string;
}

function ButtonNav({ name, path }: ButtonNavProps) {
  return (
    <NavLink
      to={path}
      className={({ isActive }) => `
        relative 
        cursor-pointer 
        text-lg
        py-1 px-2 /* Adicionado padding para uma melhor área de clique */
        transition-colors duration-300 ease-in-out
        after:content-[''] 
        after:absolute 
        after:left-0 
        after:bottom-[-2px] 
        after:h-[2px] 
        after:bg-blue-600 
        after:transition-all after:duration-300 after:ease-in-out
        
        ${
          isActive
            ? "text-blue-600 after:w-full"
            : "hover:text-blue-600 hover:after:w-full after:w-0"
        }
      `}
    >
      {name}
    </NavLink>
  );
}

export default ButtonNav;
