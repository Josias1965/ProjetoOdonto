const services = [
  {
    icon: '🦷',
    title: 'Implantes Dentários',
    desc: 'Recupere seu sorriso com implantes de última geração. Procedimento seguro e indolor com tecnologia 3D para planejamento preciso.',
  },
  {
    icon: '😁',
    title: 'Ortodontia',
    desc: 'Alinhadores invisíveis e aparelhos fixos estéticos. Tratamento personalizado para todas as idades com acompanhamento digital.',
  },
  {
    icon: '✨',
    title: 'Clareamento Dental',
    desc: 'Clareamento a laser e caseiro com resultados visíveis desde a primeira sessão. Dentes mais brancos de forma segura.',
  },
  {
    icon: '🩺',
    title: 'Periodontia',
    desc: 'Tratamento especializado de gengivas e prevenção de doenças periodontais. Mantenha sua saúde bucal em dia.',
  },
  {
    icon: '🔬',
    title: 'Endodontia',
    desc: 'Tratamento de canal com tecnologia rotária e microscopia. Procedimento confortável e eficiente.',
  },
  {
    icon: '👶',
    title: 'Odontopediatria',
    desc: 'Cuidado dental para crianças em ambiente lúdico e acolhedor. Profissionais treinados para os primeiros dentes.',
  },
  {
    icon: '🦴',
    title: 'Próteses Dentárias',
    desc: 'Próteses fixas e removíveis com materiais de alta qualidade. Restaure função e a estética do seu sorriso.',
  },
  {
    icon: '💆',
    title: 'Harmonização Facial',
    desc: 'Procedimentos estéticos com preenchimento e toxina botulínica. Realce sua beleza natural.',
  },
]

export default function Services() {
  return (
    <section id="servicos" className="py-24 bg-gray-50">
      <div className="w-full px-8 sm:px-14 lg:px-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-5">Nossos Serviços Especializados</h2>
          <p className="text-gray-500 text-xl max-w-2xl mx-auto">
            Oferecemos tratamentos com tecnologia de ponta e profissionais altamente qualificados.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s) => (
            <div
              key={s.title}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100 group flex flex-col"
            >
              <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-teal-100 transition-colors">
                {s.icon}
              </div>
              <h3 className="font-bold text-gray-800 mb-3 text-xl">{s.title}</h3>
              <p className="text-base text-gray-500 leading-relaxed flex-1">{s.desc}</p>
              <a href="#contato" className="mt-5 inline-flex items-center text-base text-teal-500 font-semibold hover:text-teal-700 transition-colors">
                Saiba mais →
              </a>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="#contato"
            className="inline-block border-2 border-teal-500 text-teal-600 font-semibold text-lg px-10 py-3.5 rounded-full hover:bg-teal-500 hover:text-white transition-colors"
          >
            Ver Todos os Serviços
          </a>
        </div>
      </div>
    </section>
  )
}
