import { useState } from 'react'

const testimonials = [
  {
    name: 'Maria Santos',
    text: '"Fiz meu implante com a Dra. Ana e o resultado superou todas as minhas expectativas. Profissionalismo impecável e atendimento humanizado. Recomendo de olhos fechados!"',
    stars: 5,
    img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80',
  },
  {
    name: 'João Oliveira',
    text: '"Excelente atendimento! A equipe é muito atenciosa e o ambiente é extremamente confortável. Meu tratamento ortodôntico está sendo incrível."',
    stars: 5,
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
  },
  {
    name: 'Ana Paula Lima',
    text: '"Sempre tive medo de dentista, mas na Rivera me sinto completamente à vontade. O clareamento ficou perfeito, meu sorriso está lindo!"',
    stars: 5,
    img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
  },
]

export default function Testimonials() {
  const [current, setCurrent] = useState(0)
  const t = testimonials[current]

  return (
    <section id="depoimentos" className="py-20 bg-white">
      <div className="w-full px-8 sm:px-14 lg:px-20">
        <div className="text-center mb-14">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">O que nossos pacientes dizem sobre nós</h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-50 rounded-3xl p-10 flex flex-col md:flex-row gap-8 items-center shadow-sm">
            <img
              src={t.img}
              alt={t.name}
              className="w-24 h-24 rounded-full object-cover flex-shrink-0 border-4 border-teal-100"
            />
            <div>
              <p className="text-gray-600 text-lg leading-relaxed mb-6 italic">{t.text}</p>
              <div className="flex items-center gap-1 mb-1">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="font-bold text-gray-800">— {t.name}</p>
            </div>
          </div>

          <div className="flex justify-center gap-3 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-3 h-3 rounded-full transition-colors ${i === current ? 'bg-teal-500' : 'bg-gray-300 hover:bg-gray-400'}`}
                aria-label={`Depoimento ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
