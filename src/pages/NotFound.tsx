import { NavLink } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-30 gap-5">
      <span className="text-blue-600">
        <i className="fa-solid fa-triangle-exclamation fa-5x"></i>
      </span>
      <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Página não encontrada</h1>
      <p className="max-w-lg text-center text-gray-600 mx-auto">
        A página que você está procurando não existe ou foi movida. Por favor, verifique o endereço ou retorne ao painel principal. 
      </p>
      <NavLink to={"/"} className={"bg-blue-600 text-white flex items-center rounded-lg px-5 py-3 hover:bg-blue-500 hover:-translate-y-0.5 active:translate-y-0.5 transition duration-200 ease-in-out"}>
          <p>Voltar para o Dashboard</p>
      </NavLink>
    </div>
  );
};

export default NotFound;
