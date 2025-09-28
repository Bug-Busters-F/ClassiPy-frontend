interface LoadingProps {
  loadingTitle: string;
  loadingMessage: string;
}

function Loading ({loadingTitle, loadingMessage}: LoadingProps){
  return (
    <div className="flex p-8 justify-center items-center h-[450px]">
      <div className="text-center space-y-6">
        <div className="w-24 h-24 border-4 border-t-blue-600 border-gray-200 rounded-full animate-spin mx-auto"></div>
        <div className="text-blue-600 font-semibold text-4xl opacity-90 animate-fadeIn">
          {loadingTitle}
        </div>
        <div className="text-gray-400 text-sm opacity-80 animate-fadeIn">
          <p>{loadingMessage}</p>
          <p>Por favor, aguarde um momento.</p>
        </div>
      </div>
    </div>
  );
};

export default Loading;
