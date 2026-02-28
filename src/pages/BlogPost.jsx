import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { User, Calendar, Clock, ArrowLeft } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import WhatsAppFloat from '../components/WhatsAppFloat'
import { supabase } from '../lib/supabase'
import { initialPosts } from '../data/posts'

export default function BlogPost() {
    const { id } = useParams()
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        window.scrollTo(0, 0)
        const fetchPost = async () => {
            try {
                const { data, error } = await supabase.from('posts').select('*').eq('id', id).single()
                if (data) setPost(data)
                else {
                    // Fallback
                    const found = initialPosts.find(p => String(p.id) === String(id))
                    if (found) setPost(found)
                }
            } catch (err) {
                console.error(err)
                const found = initialPosts.find(p => String(p.id) === String(id))
                if (found) setPost(found)
            } finally {
                setLoading(false)
            }
        }
        fetchPost()
    }, [id])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    if (!post) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Post não encontrado</h2>
                <Link to="/blog" className="text-teal-600 hover:text-teal-700 font-semibold px-6 py-3 border border-teal-500 rounded-xl">
                    Voltar para o Blog
                </Link>
            </div>
        )
    }

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-white pt-24 pb-20">
                <article className="max-w-7xl mx-auto px-8 sm:px-14 lg:px-20">

                    <div className="mb-8">
                        <Link
                            to="/blog"
                            className="inline-flex items-center text-gray-500 hover:text-teal-600 transition-colors gap-2 mb-8 font-medium"
                        >
                            <ArrowLeft size={20} />
                            Voltar para o Blog
                        </Link>

                        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-gray-500 text-sm sm:text-base border-b border-gray-100 pb-8">
                            <div className="flex items-center gap-2">
                                <User size={18} className="text-teal-500" />
                                <span className="font-medium text-gray-700">{post.author || 'Equipe Rivera'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={18} className="text-teal-500" />
                                <span>{new Date(post.date).toLocaleDateString('pt-BR')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={18} className="text-teal-500" />
                                <span>{post.readTime || '5 min'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl overflow-hidden mb-12 shadow-xl">
                        <img
                            src={post.img}
                            alt={post.title}
                            className="w-full h-auto object-cover max-h-[700px]"
                        />
                    </div>

                    <div
                        className="text-gray-600 leading-relaxed text-lg post-content"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    <style dangerouslySetInnerHTML={{
                        __html: `
                        .post-content h3 {
                            font-size: 1.875rem;
                            font-weight: 700;
                            color: #1f2937;
                            margin-top: 2.5rem;
                            margin-bottom: 1.25rem;
                        }
                        .post-content p {
                            margin-bottom: 1.5rem;
                        }
                        .post-content ul {
                            list-style-type: disc;
                            padding-left: 1.5rem;
                            margin-bottom: 2rem;
                        }
                        .post-content li {
                            margin-bottom: 0.5rem;
                        }
                        .post-content strong {
                            color: #111827;
                            font-weight: 600;
                        }
                    `}} />

                    <div className="mt-16 pt-10 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div>
                            <h4 className="font-bold text-gray-800 text-lg mb-2 text-center sm:text-left">Gostou deste conteúdo?</h4>
                            <p className="text-gray-500 text-center sm:text-left">Compartilhe com seus amigos e familiares.</p>
                        </div>
                        <div className="flex gap-4">
                            {/* Simplified share buttons */}
                            <button className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold hover:bg-blue-700 transition-colors">Facebook</button>
                            <button className="bg-teal-500 text-white px-6 py-2.5 rounded-full font-bold hover:bg-teal-600 transition-colors">WhatsApp</button>
                        </div>
                    </div>

                </article>
            </main>
            <Footer />
            <WhatsAppFloat />
        </>
    )
}
