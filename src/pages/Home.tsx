import { NavLink } from "react-router-dom";

const Home = () => {
  return (
    <div className="px-[3%] w-screen">
      <div className="pt-8 flex justify-between">
        <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
        <NavLink
          to={"/process"}
          className={
            "bg-blue-600 text-white flex items-center rounded-lg px-5 py-3 hover:bg-blue-500 hover:-translate-y-0.5 active:translate-y-0.5 transition duration-200 ease-in-out"
          }
        >
          <div className="flex items-center justify-between gap-3">
            <i className="fa-solid fa-plus fa-sm" />
            <p>Iniciar Novo Processo</p>
          </div>
        </NavLink>
      </div>
    </div>
  );
};

export default Home;
