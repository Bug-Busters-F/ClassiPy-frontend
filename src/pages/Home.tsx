import { NavLink } from "react-router-dom";
import RecentPartnumber from "../components/RecentPartnumber";

const Home = () => {
  const features = [
    {
      icon: <i className="fa-solid fa-upload fa-4x h-12 w-12 text-blue-600" />,
      title: "Upload Simples",
      description:
        "Arraste e solte arquivos PDF ou clique para selecionar arquivos do seu computador",
    },
    {
      icon: (
        <i className="fa-solid fa-magnifying-glass fa-4x h-12 w-12 text-green-600" />
      ),
      title: "Extração Automática",
      description:
        "Nossa IA avançada extrai Part Numbers automaticamente dos documentos PDF",
    },
    {
      icon: (
        <i className="fa-solid fa-list-check fa-4x h-12 w-12 text-purple-600" />
      ),
      title: "Classificação Precisa",
      description:
        "Identifica país de origem e classifica cada componente com alta precisão",
    },
  ];
  const steps = [
    {
      step: "1",
      title: "Upload do PDF",
      desc: "Envie seu arquivo PDF com Part Numbers",
      color: "bg-blue-600",
    },
    {
      step: "2",
      title: "Processamento IA",
      desc: "Nossa IA analisa e extrai os dados",
      color: "bg-green-600",
    },
    {
      step: "3",
      title: "Extração de Dados",
      desc: "Part Numbers são identificados automaticamente",
      color: "bg-purple-600",
    },
    {
      step: "4",
      title: "Resultados",
      desc: "Visualize e valide todos os dados extraídos",
      color: "bg-orange-600",
    },
  ];

  return (
    <div className="px-[10%] w-screen">
      <div className="pt-8 flex justify-between">
        <h2 className="text-4xl font-bold text-gray-800">Dashboard</h2>
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
      <RecentPartnumber />
      <div className="py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Vantagens do ClassiPy
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tecnologia avançada para automatizar seu processo de classificação
            de Part Numbers.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-10 rounded-2xl text-center hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0 shadow-lg bg-white/80 backdrop-blur-sm"
            >
              <div className="pb-4">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    {feature.icon}
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h2>
              </div>
              <div>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100 mb-20">
        <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
          Como Funciona
        </h2>
        <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Processo simples e automatizado em 4 etapas
        </p>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((item, index) => (
            <div key={index} className="text-center relative">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gray-200"></div>
              )}

              <div
                className={`w-16 h-16 ${item.color} text-white rounded-2xl flex items-center justify-center font-bold text-2xl mx-auto mb-6 shadow-lg relative z-10`}
              >
                {item.step}
              </div>

              <h3 className="font-bold text-xl mb-3 text-gray-900">
                {item.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
