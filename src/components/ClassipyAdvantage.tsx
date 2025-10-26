import GradientText from "./GradientText";

const ClassipyAdvantage = () => {
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
  return (
    <div className="py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Vantagens do <GradientText>ClassiPy</GradientText>
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Tecnologia avançada para automatizar seu processo de classificação de
          Part Numbers.
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
                <div className="p-4 bg-gray-50 rounded-2xl">{feature.icon}</div>
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
  );
};

export default ClassipyAdvantage;
