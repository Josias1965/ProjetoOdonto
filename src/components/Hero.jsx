import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-[500px] flex items-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f766e 0%, #134e4a 100%)' }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1600&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.25,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-teal-900/85 via-teal-800/60 to-teal-700/20" />

      <div className="relative w-full grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
        <div className="flex flex-col justify-center px-8 sm:px-14 lg:px-20 pt-28 pb-16">
          <span className="inline-block self-start bg-teal-400/20 text-teal-200 text-sm font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border border-teal-400/30">
            Cuidado Odontológico Completo
          </span>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-6">
            Seu Sorriso Merece<br />
            <span className="text-teal-300">o Melhor Cuidado</span>
          </h1>
          <p className="text-teal-100 text-xl mb-10 leading-relaxed max-w-xl">
            Tecnologia avançada e equipe especializada para transformar sua saúde bucal.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/agendamento"
              className="bg-teal-400 hover:bg-teal-300 text-teal-900 font-bold text-lg px-9 py-4 rounded-full transition-colors shadow-lg"
            >
              Agendar Agora
            </Link>
            <a
              href="#equipe"
              className="border-2 border-white/70 hover:border-white text-white font-semibold text-lg px-9 py-4 rounded-full transition-colors"
            >
              Conheça a Equipe
            </a>
          </div>
        </div>

        <div className="hidden lg:block relative">
          <img
            src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=900&q=80"
            alt="Clínica Rivera"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ clipPath: 'polygon(12% 0, 100% 0, 100% 100%, 0% 100%)' }}
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-teal-900/60 via-transparent to-transparent"
            style={{ clipPath: 'polygon(12% 0, 100% 0, 100% 100%, 0% 100%)' }}
          />
        </div>
      </div>
    </section>
  )
}
