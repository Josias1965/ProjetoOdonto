import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminLogin() {
  const [form, setForm] = useState({ user: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    if (form.user === 'admin' && form.password === 'admin123') {
      navigate('/admin/dashboard')
    } else {
      setError('Usuário ou senha inválidos.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-3xl overflow-hidden shadow-xl">

        <div className="bg-slate-900 px-10 py-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-teal-500 rounded-2xl mb-5" />
          <h1 className="text-2xl font-bold text-white mb-1">Painel Administrativo</h1>
          <p className="text-slate-400 text-base">Clínica Odontológica</p>
        </div>

        <div className="bg-white px-10 py-10">
          <form onSubmit={submit} className="space-y-6">

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Usuário</label>
              <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3.5 focus-within:ring-2 focus-within:ring-teal-400 focus-within:border-transparent transition">
                <svg className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <input
                  type="text"
                  name="user"
                  value={form.user}
                  onChange={handle}
                  required
                  placeholder="Digite seu usuário"
                  className="flex-1 text-base text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Senha</label>
              <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3.5 focus-within:ring-2 focus-within:ring-teal-400 focus-within:border-transparent transition">
                <svg className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handle}
                  required
                  placeholder="Digite sua senha"
                  className="flex-1 text-base text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="ml-2 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                  aria-label="Mostrar senha"
                >
                  {showPass ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-lg py-4 rounded-xl transition-colors shadow-md mt-2"
            >
              Entrar no Painel
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
