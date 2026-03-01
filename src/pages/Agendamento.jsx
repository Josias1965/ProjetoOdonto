import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import WhatsAppFloat from '../components/WhatsAppFloat'
import * as db from '../lib/supabaseService'
import { initialDoctors as fallbackDoctors } from '../data/doctors'

const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']

const perks = [
  'Agendamento rápido e fácil',
  'Escolha seu dentista preferido',
  'Confirmação direta via WhatsApp',
  'Lembretes automáticos',
]

export default function Agendamento() {
  const [doctorsList, setDoctorsList] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    doctorId: '',
    doctorName: '',
    name: '',
    phone: '',
    date: '',
    time: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await db.getDoctors()
        if (data && data.length > 0) {
          setDoctorsList(data)
          setForm(f => ({
            ...f,
            doctorId: data[0].id,
            doctorName: data[0].name
          }))
        } else {
          // Fallback if DB is empty
          setDoctorsList(fallbackDoctors)
          setForm(f => ({
            ...f,
            doctorId: fallbackDoctors[0].id,
            doctorName: fallbackDoctors[0].name
          }))
        }
      } catch (err) {
        console.error('Erro:', err)
        setDoctorsList(fallbackDoctors)
      } finally {
        setLoading(false)
      }
    }
    fetchDoctors()
  }, [])

  const handle = (e) => {
    if (e.target.name === 'doctorId') {
      const selected = doctorsList.find(d => d.id === Number(e.target.value))
      setForm({ ...form, doctorId: selected.id, doctorName: selected.name })
    } else {
      setForm({ ...form, [e.target.name]: e.target.value })
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!form.time) { alert('Selecione um horário disponível.'); return }
    setIsSubmitting(true)
    try {
      await db.saveAppointment({
        doctorId: form.doctorId,
        doctorName: form.doctorName,
        patientName: form.name,
        phone: form.phone,
        date: form.date,
        time: form.time,
        status: 'Aguardando'
      })
      setSubmitted(true)
    } catch (err) {
      console.error('Erro de agendamento:', err)
      alert(`Erro no agendamento: ${err.message || 'Verifique se todos os campos estão corretos e tente novamente.'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="w-full px-8 sm:px-14 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">

            <div className="pt-6">
              <h1 className="text-4xl sm:text-5xl font-black text-gray-800 leading-tight mb-6">
                Agende com Seu<br />Dentista Preferido
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed mb-10 max-w-md">
                Sistema de agendamento online individualizado. Escolha o profissional, data e horário que melhor se adequam à sua rotina.
              </p>
              <ul className="space-y-5">
                {perks.map((p) => (
                  <li key={p} className="flex items-center gap-4 text-gray-700 text-lg">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-teal-50 flex items-center justify-center">
                      <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-teal-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">Agendamento Confirmado!</h2>
                  <p className="text-gray-500 text-lg mb-2">
                    <strong>{form.doctorName}</strong>
                  </p>
                  <p className="text-gray-500 mb-6">
                    {new Date(form.date + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} às {form.time}
                  </p>
                  <p className="text-gray-400 text-sm mb-8">Entraremos em contato em breve para confirmar.</p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ doctorId: doctorsList[0]?.id, doctorName: doctorsList[0]?.name, name: '', phone: '', date: '', time: '' }) }}
                    className="border-2 border-teal-500 text-teal-600 font-semibold px-8 py-3 rounded-full hover:bg-teal-500 hover:text-white transition-colors"
                  >
                    Novo Agendamento
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-800 mb-8">Preencha seus dados</h2>
                  <form onSubmit={submit} className="space-y-6">

                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Selecione o Dentista</label>
                      <select
                        name="doctorId"
                        value={form.doctorId}
                        onChange={handle}
                        disabled={loading}
                        className="w-full border border-gray-400 bg-gray-50 rounded-xl px-4 py-3.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400 text-base disabled:opacity-50"
                      >
                        {loading ? (
                          <option>Carregando dentistas...</option>
                        ) : (
                          doctorsList.map((d) => (
                            <option key={d.id} value={d.id}>{d.name} - {d.specialty}</option>
                          ))
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Nome Completo</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handle}
                        required
                        className="w-full border border-gray-400 bg-gray-50 rounded-xl px-4 py-3.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400 text-base"
                      />
                    </div>



                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Telefone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handle}
                        className="w-full border border-gray-400 bg-gray-50 rounded-xl px-4 py-3.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400 text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Data da Consulta</label>
                      <input
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handle}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full border border-gray-400 bg-gray-50 rounded-xl px-4 py-3.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400 text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-3">Horário Disponível</label>
                      <div className="grid grid-cols-3 gap-3">
                        {timeSlots.map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setForm({ ...form, time: t })}
                            className={`py-3 rounded-xl text-base font-medium transition-colors ${form.time === t
                              ? 'bg-teal-500 text-white shadow-sm'
                              : 'bg-gray-100 text-gray-600 hover:bg-teal-50 hover:text-teal-600'
                              }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-lg py-4 rounded-2xl transition-colors mt-2 shadow-md disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Processando...
                        </>
                      ) : 'Confirmar Agendamento'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <WhatsAppFloat />
    </>
  )
}
