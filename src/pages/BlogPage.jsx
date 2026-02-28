import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import WhatsAppFloat from '../components/WhatsAppFloat'
import * as db from '../lib/supabaseService'
import { initialPosts as fallbackPosts } from '../data/posts'

export default function BlogPage() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await db.getPosts()
        setPosts(data.length ? data : fallbackPosts)
      } catch (err) {
        console.error('Erro:', err)
        setPosts(fallbackPosts)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  const subscribe = (e) => {
    e.preventDefault()
    if (email) { setSubscribed(true); setEmail('') }
  }

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
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-24">

        <div className="w-full px-8 sm:px-14 lg:px-20 py-14">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((p) => (
                <article
                  key={p.id || p.title}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 group flex flex-col"
                >
                  <div className="overflow-hidden">
                    <img
                      src={p.img}
                      alt={p.title}
                      className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-7 flex flex-col flex-1">
                    <span className={`inline-block text-sm font-semibold px-3 py-1 rounded-full mb-4 self-start ${getTagColor(p.tag)}`}>
                      {p.tag}
                    </span>
                    <h2 className="font-bold text-gray-800 text-xl mb-3 leading-snug">{p.title}</h2>
                    <p className="text-base text-gray-500 leading-relaxed mb-5 flex-1">{p.excerpt || p.desc}</p>
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <span>{new Date(p.date).toLocaleDateString('pt-BR')}</span>
                      <span>{p.readTime || '5 min'}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                      <span className="text-sm text-gray-500 font-medium">{p.author || 'Equipe Rivera'}</span>
                      <Link
                        to={`/blog/${p.id}`}
                        className="text-base text-teal-500 font-semibold hover:text-teal-700 transition-colors flex items-center gap-1"
                      >
                        Ler mais →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="bg-teal-600 py-16">
          <div className="w-full px-8 sm:px-14 lg:px-20 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Receba Nossas Dicas por Email</h2>
            <p className="text-teal-100 text-lg mb-8">Cadastre-se e receba conteúdos exclusivos sobre saúde bucal</p>
            {subscribed ? (
              <p className="text-white font-semibold text-lg">Obrigado! Você foi cadastrado com sucesso.</p>
            ) : (
              <form onSubmit={subscribe} className="flex flex-col sm:flex-row gap-3 justify-center max-w-lg mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Seu melhor email"
                  className="flex-1 bg-white border border-white rounded-full px-6 py-3.5 text-gray-700 text-base focus:outline-none focus:ring-2 focus:ring-teal-300"
                />
                <button
                  type="submit"
                  className="bg-white text-teal-700 font-bold px-8 py-3.5 rounded-full hover:bg-teal-50 transition-colors whitespace-nowrap"
                >
                  Inscrever-se
                </button>
              </form>
            )}
          </div>
        </div>

      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
