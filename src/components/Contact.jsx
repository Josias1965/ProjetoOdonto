import { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    alert('Mensagem enviada! Em breve entraremos em contato.')
    setForm({ name: '', email: '', phone: '', subject: '', message: '' })
  }

  return (
    <section id="contato" className="py-20 bg-teal-700">
      <div className="w-full px-8 sm:px-14 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-3">Entre em Contato</h2>
            <p className="text-teal-200 mb-8">Estamos prontos para atender você. Preencha o formulário ou use nossos contatos diretos.</p>
            <form onSubmit={submit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handle}
                placeholder="Nome Completo"
                required
                className="w-full bg-white/10 border border-teal-500 text-white placeholder-teal-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-300"
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handle}
                placeholder="Email"
                required
                className="w-full bg-white/10 border border-teal-500 text-white placeholder-teal-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-300"
              />
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handle}
                placeholder="Telefone"
                className="w-full bg-white/10 border border-teal-500 text-white placeholder-teal-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-300"
              />
              <select
                name="subject"
                value={form.subject}
                onChange={handle}
                className="w-full bg-teal-700 border border-teal-500 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-300"
              >
                <option value="" className="text-gray-400">Serviço de Interesse</option>
                <option>Implantes Dentários</option>
                <option>Ortodontia</option>
                <option>Clareamento Dental</option>
                <option>Periodontia</option>
                <option>Harmonização Facial</option>
                <option>Outro</option>
              </select>
              <textarea
                name="message"
                value={form.message}
                onChange={handle}
                placeholder="Mensagem"
                rows={4}
                className="w-full bg-white/10 border border-teal-500 text-white placeholder-teal-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-300 resize-none"
              />
              <button
                type="submit"
                className="w-full bg-white text-teal-700 font-bold py-3 rounded-xl hover:bg-teal-50 transition-colors shadow-lg"
              >
                Enviar Mensagem
              </button>
            </form>
          </div>

          <div className="text-white">
            <h3 className="text-2xl font-bold mb-8">Informações de Contato</h3>
            <div className="space-y-6">
              {[
                {
                  icon: '📞',
                  label: 'Telefone',
                  value: '(11) 3333-4444',
                },
                {
                  icon: '💬',
                  label: 'WhatsApp',
                  value: '(11) 99999-8888',
                },
                {
                  icon: '✉️',
                  label: 'Email',
                  value: 'contato@rivera.com.br',
                },
                {
                  icon: '📍',
                  label: 'Endereço',
                  value: 'Av. Paulista, 1000 - São Paulo, SP',
                },
              ].map((c) => (
                <div key={c.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                    {c.icon}
                  </div>
                  <div>
                    <p className="text-teal-200 text-sm">{c.label}</p>
                    <p className="font-semibold">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <p className="text-teal-200 text-sm mb-3">Redes Sociais</p>
              <div className="flex gap-3">
                {[
                  { color: 'bg-pink-500', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
                  { color: 'bg-blue-600', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
                  { color: 'bg-red-600', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
                ].map((s, i) => (
                  <a key={i} href="#" className={`${s.color} w-9 h-9 rounded-lg flex items-center justify-center text-white hover:opacity-80 transition-opacity`}>
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
