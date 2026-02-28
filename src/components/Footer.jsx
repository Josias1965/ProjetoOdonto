const cols = [
  {
    title: 'Serviços',
    links: ['Implantes Dentários', 'Ortodontia', 'Clareamento Dental', 'Periodontia', 'Harmonização Facial'],
  },
  {
    title: 'Sobre Nós',
    links: ['Nossa Equipe', 'Tecnologia', 'Depoimentos', 'Blog'],
  },
  {
    title: 'Recursos',
    links: ['Agendamento Online', 'Formas de Pagamento', 'Convênios', 'Perguntas Frequentes'],
  },
  {
    title: 'Legal',
    links: ['Política de Privacidade', 'Termos de Uso', 'LGPD', 'Contato'],
  },
]

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="w-full px-8 sm:px-14 lg:px-20 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-10">
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-4 lg:mb-0">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">R</span>
              </div>
              <span className="font-bold text-white text-lg">Rivera <span className="text-teal-400">Odontologia</span></span>
            </div>
            <p className="text-sm leading-relaxed">Cuidando do seu sorriso com excelência.</p>
          </div>

          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="text-white font-semibold mb-4">{c.title}</h4>
              <ul className="space-y-2">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm hover:text-teal-400 transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs">© 2025 Rivera Odontologia. Todos os direitos reservados.</p>
          <div className="flex gap-3">
            {['instagram', 'facebook', 'youtube'].map((s) => (
              <a key={s} href="#" className="text-gray-500 hover:text-teal-400 transition-colors text-xs capitalize">
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
