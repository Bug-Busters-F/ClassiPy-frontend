import { NavLink } from "react-router-dom";

const Home = () => {
  return (
    <div className="px-[3%]">
      <div className="pt-8 flex justify-between">
        <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
        <NavLink
          to={"/process"}
          className={
            "bg-blue-600 text-white flex items-center rounded-lg px-5 py-3"
          }
        >
          + Iniciar Novo Processo
        </NavLink>
      </div>
    </div>
  );
};

export default Home;
