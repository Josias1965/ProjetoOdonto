import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import * as db from '../lib/supabaseService'
import { initialPosts as fallbackPosts } from '../data/posts'

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const data = await db.getPosts()
        setPosts(data.length ? data.slice(0, 3) : fallbackPosts.slice(0, 3))
      } catch (err) {
        console.error(err)
        setPosts(fallbackPosts.slice(0, 3))
      } finally {
        setLoading(false)
      }
    }
    fetchLatest()
  }, [])

  const getTagColor = (tag) => {
    const tagColors = {
      'Prevenção': 'bg-teal-50 text-teal-600',
      'Tratamentos': 'bg-blue-50 text-blue-600',
      'Ortodontia': 'bg-purple-50 text-purple-600',
      'Estética': 'bg-pink-50 text-pink-600',
      'Odontopediatria': 'bg-orange-50 text-orange-600',
    }
    return tagColors[tag] || 'bg-gray-100 text-gray-600'
  }

  return (
    <section id="blog" className="py-20 bg-gray-50">
      <div className="w-full px-8 sm:px-14 lg:px-20">
        <div className="text-center mb-14">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">Dicas e Novidades Odontológicas</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Fique por dentro das últimas novidades e aprenda a cuidar melhor da sua saúde bucal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full py-10 flex justify-center">
              <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : posts.map((p) => (
            <article key={p.id || p.title} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 group">
              <div className="overflow-hidden">
                <img
                  src={p.img}
                  alt={p.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-8">
                <span className={`inline-block ${getTagColor(p.tag)} text-sm font-bold uppercase px-3 py-1 rounded mb-4`}>
                  {p.tag}
                </span>
                <h3 className="font-bold text-gray-800 mb-3 leading-snug text-xl">{p.title}</h3>
                <p className="text-base text-gray-500 leading-relaxed mb-5">{p.excerpt || p.desc}</p>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>{new Date(p.date).toLocaleDateString('pt-BR')}</span>
                  <span>{p.readTime || '5 min'}</span>
                </div>
                <Link to={`/blog/${p.id}`} className="mt-4 inline-flex items-center text-base text-teal-500 font-semibold hover:text-teal-700 transition-colors">
                  Ler mais →
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/blog"
            className="inline-block border-2 border-teal-500 text-teal-600 font-semibold px-8 py-3 rounded-full hover:bg-teal-500 hover:text-white transition-colors"
          >
            Ver Todos os Artigos
          </Link>
        </div>
      </div>
    </section>
  )
}
