import ButtonNav from "./ButtonNav";

const Navbar = () => {
  return (
    <div className="px-[3%] py-4 flex items-center border justify-between border-gray-200">
      <div className="flex items-center">
        <div className="bg-blue-600 rounded-md w-10 h-10 flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-2xl">
            lan
          </span>
        </div>
        <h1 className="text-2xl text-gray-800 font-bold pl-2">ClassiPy</h1>
      </div>

      <div className="flex items-center gap-10">
        <ButtonNav name="Home" path="/" />
        <ButtonNav name="Histórico" path="/history" />
        <ButtonNav name="Processo" path="/process" />
      </div>
    </div>
  );
};

export default Navbar;
