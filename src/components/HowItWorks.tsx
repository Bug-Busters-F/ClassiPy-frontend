const HowItWorks = () => {
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
  );
};

export default HowItWorks;
