import { Link } from "react-router-dom";

interface ButtonNavProps {
  name: string;
  path: string;
}

function ButtonNav(buttonNavProps: ButtonNavProps) {
  return (
    <Link to={buttonNavProps.path}>
      <button className="cursor-pointer  transition hover:border-b-2 border-b-blue-500 hover:text-blue-500">
        <div className="text-lg">
          <p>{buttonNavProps.name}</p>
        </div>
      </button>
    </Link>
  );
}

export default ButtonNav;
