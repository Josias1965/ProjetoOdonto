const doctors = [
  {
    name: 'Dra. Ana Carolina Silva',
    specialty: 'Implantodontista e Prótese',
    img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80',
  },
  {
    name: 'Dr. Roberto Mendes',
    specialty: 'Ortodontia',
    img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80',
  },
  {
    name: 'Dra. Juliana Costa',
    specialty: 'Periodontia',
    img: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&q=80',
  },
  {
    name: 'Dr. Fernando Oliveira',
    specialty: 'Periodontia e Estética',
    img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80',
  },
]

export default function Team() {
  return (
    <section id="equipe" className="py-20 bg-white">
      <div className="w-full px-8 sm:px-14 lg:px-20">
        <div className="text-center mb-14">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">Conheça Nossa Equipe de Especialistas</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Profissionais altamente qualificados e dedicados ao seu bem-estar.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {doctors.map((d) => (
            <div key={d.name} className="text-center group">
              <div className="relative mb-5 overflow-hidden rounded-2xl">
                <img
                  src={d.img}
                  alt={d.name}
                  className="w-full h-80 object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-900/30 to-transparent" />
              </div>
              <h3 className="font-bold text-gray-800 mb-1 text-xl">{d.name}</h3>
              <p className="text-base text-teal-500 font-medium mb-4">{d.specialty}</p>
              <a
                href="#contato"
                className="inline-block bg-teal-500 hover:bg-teal-600 text-white text-base font-semibold px-6 py-2.5 rounded-full transition-colors"
              >
                Agendar Consulta
              </a>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="#equipe"
            className="inline-block border-2 border-teal-500 text-teal-600 font-semibold px-8 py-3 rounded-full hover:bg-teal-500 hover:text-white transition-colors"
          >
            Ver Equipe Completa
          </a>
        </div>
      </div>
    </section>
  )
}
