import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as db from '../lib/supabaseService'
import { initialDoctors as fallbackDoctors } from '../data/doctors' // I should create this
import { initialPosts as fallbackPosts } from '../data/posts'
import { initialAppointments as fallbackAppointments } from '../data/appointments'

const localInitialDoctors = [
  { id: 1, name: 'Dra. Ana Carolina Silva', specialty: 'Implantodontia e Prótese', cro: 'CRO-SP 45678', img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&q=80' },
  { id: 2, name: 'Dr. Roberto Mendes', specialty: 'Ortodontia', cro: 'CRO-SP 34567', img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=120&q=80' },
  { id: 3, name: 'Dra. Juliana Costa', specialty: 'Odontopediatria', cro: 'CRO-SP 56789', img: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=120&q=80' },
  { id: 4, name: 'Dr. Fernando Oliveira', specialty: 'Periodontia e Estética', cro: 'CRO-SP 67890', img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120&q=80' },
]

const localInitialPosts = [
  { id: 1, title: 'A Importância da Higiene Bucal Diária', tag: 'Prevenção', date: '2024-12-15', img: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=120&q=80' },
  { id: 2, title: 'Quando Fazer um Implante Dentário?', tag: 'Tratamentos', date: '2024-12-10', img: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=120&q=80' },
  { id: 3, title: 'Ortodontia para Adultos: Nunca é Tarde', tag: 'Ortodontia', date: '2024-12-05', img: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=120&q=80' },
  { id: 4, title: 'Clareamento Dental: Mitos e Verdades', tag: 'Estética', date: '2024-11-28', img: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=120&q=80' },
  { id: 5, title: 'Cuidados com a Saúde Bucal das Crianças', tag: 'Odontopediatria', date: '2024-11-20', img: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=120&q=80' },
  { id: 6, title: 'Doença Periodontal: Como Prevenir', tag: 'Prevenção', date: '2024-11-15', img: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=120&q=80' },
]

const iconDash = <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
const iconUser = <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
const iconDoc = <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
const iconExit = <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
const iconLink = <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
const iconPlus = <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
const iconX = <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
const iconCalendar = <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>



function StatCard({ icon, count, label }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 px-8 py-7 flex items-center gap-6 shadow-sm">
      <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center flex-shrink-0">
        <span className="text-teal-500">{icon}</span>
      </div>
      <div>
        <p className="text-5xl font-bold text-gray-800 leading-none">{count}</p>
        <p className="text-gray-500 text-lg mt-1">{label}</p>
      </div>
    </div>
  )
}

function DashboardView({ doctors, posts, appointments, setView }) {
  return (
    <div className="p-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-lg mt-1">Visão geral do conteúdo do site</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>} count={doctors.length} label="Especialistas" />
        <StatCard icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} count={appointments.length} label="Agendamentos" />
        <StatCard icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>} count={posts.length} label="Postagens" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-800 text-xl">Especialistas</h2>
            <button onClick={() => setView('especialistas')} className="text-teal-500 font-bold text-base hover:text-teal-700 transition-colors">Gerenciar</button>
          </div>
          <ul className="divide-y divide-gray-50">
            {doctors.map((d) => (
              <li key={d.id} className="flex items-center gap-5 px-7 py-4">
                <img src={d.img} alt={d.name} className="w-14 h-14 rounded-full object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 text-base truncate">{d.name}</p>
                  <p className="text-sm text-gray-400 mt-0.5">{d.specialty}</p>
                </div>
                <span className="text-sm text-gray-400 flex-shrink-0">{d.cro}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-800 text-xl">Últimas Postagens</h2>
            <button onClick={() => setView('blog')} className="text-teal-500 font-bold text-base hover:text-teal-700 transition-colors">Gerenciar</button>
          </div>
          <ul className="divide-y divide-gray-50">
            {posts.slice(0, 5).map((p) => (
              <li key={p.id} className="flex items-center gap-5 px-7 py-4">
                <img src={p.img} alt={p.title} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 text-base truncate">{p.title}</p>
                  <p className="text-sm text-gray-400 mt-0.5">{p.tag} · {p.date}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function Modal({ title, fields, data, onChange, onSave, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 flex-shrink-0">
          <h3 className="font-bold text-gray-800 text-xl">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">{iconX}</button>
        </div>
        <div className="p-8 space-y-5 overflow-y-auto">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-semibold text-gray-600 mb-2">{f.label}</label>
              {f.textarea ? (
                <>
                  <textarea
                    rows={f.rows || 4}
                    maxLength={f.maxLength}
                    value={data[f.key] || ''}
                    onChange={(e) => onChange(f.key, e.target.value)}
                    placeholder={f.placeholder || ''}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
                  />
                  {f.maxLength && (
                    <p className="text-xs text-gray-400 mt-1">{(data[f.key] || '').length}/{f.maxLength}</p>
                  )}
                </>
              ) : f.select ? (
                <select
                  value={data[f.key] || ''}
                  onChange={(e) => onChange(f.key, e.target.value)}
                  className="w-full border border-gray-300 bg-white rounded-xl px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-teal-400"
                >
                  {f.select.map(opt => (
                    typeof opt === 'string'
                      ? <option key={opt} value={opt}>{opt}</option>
                      : <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={f.type || "text"}
                  value={data[f.key] || ''}
                  onChange={(e) => onChange(f.key, e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              )}
            </div>
          ))}
        </div>
        <div className="px-8 pb-7 pt-4 flex gap-3 justify-end flex-shrink-0 border-t border-gray-100">
          <button onClick={onClose} className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-base hover:bg-gray-50 transition">Cancelar</button>
          <button onClick={onSave} className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-base transition">Salvar</button>
        </div>
      </div>
    </div>
  )
}

function EspecialistasView({ doctors, setDoctors, setView }) {
  const empty = { name: '', specialty: '', cro: '', img: '', bio: '' }
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(empty)

  const openAdd = () => { setForm(empty); setModal('add') }
  const openEdit = (d) => { setForm({ ...d }); setModal('edit') }
  const handleChange = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const save = async () => {
    try {
      const saved = await db.saveDoctor(form)
      if (modal === 'add') setDoctors((p) => [...p, saved])
      else setDoctors((p) => p.map((d) => (d.id === form.id ? saved : d)))
      setModal(null)
    } catch (err) {
      alert('Erro ao salvar especialista')
    }
  }
  const remove = async (id) => {
    if (confirm('Remover especialista?')) {
      try {
        await db.deleteDoctor(id)
        setDoctors((p) => p.filter((d) => d.id !== id))
      } catch (err) {
        alert('Erro ao remover especialista')
      }
    }
  }

  const fields = [
    { key: 'name', label: 'Nome Completo *' },
    { key: 'specialty', label: 'Especialidade *' },
    { key: 'cro', label: 'CRO *' },
    { key: 'img', label: 'URL da Foto' },
    { key: 'bio', label: 'Biografia', textarea: true, rows: 4, maxLength: 500, placeholder: 'Descreva a trajetória e experiência do especialista...' },
  ]

  return (
    <div className="p-10">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Especialistas</h1>
          <p className="text-gray-500 text-lg mt-1">Gerencie os profissionais da clínica</p>
        </div>
        <button onClick={openAdd} className="bg-teal-500 hover:bg-teal-600 text-white font-bold text-base px-6 py-3.5 rounded-xl flex items-center gap-2 transition shadow-sm">
          {iconPlus} Novo Especialista
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-7 py-4 text-base font-bold text-gray-500">Profissional</th>
              <th className="text-left px-7 py-4 text-base font-bold text-gray-500">Especialidade</th>
              <th className="text-left px-7 py-4 text-base font-bold text-gray-500">CRO</th>
              <th className="px-7 py-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {doctors.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50 transition">
                <td className="px-7 py-5">
                  <div className="flex items-center gap-4">
                    <img
                      src={d.img} alt={d.name}
                      className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                      onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(d.name)}&background=0d9488&color=fff` }}
                    />
                    <span className="font-bold text-gray-800 text-base">{d.name}</span>
                  </div>
                </td>
                <td className="px-7 py-5 text-base text-gray-500">{d.specialty}</td>
                <td className="px-7 py-5 text-base text-gray-500">{d.cro}</td>
                <td className="px-7 py-5">
                  <div className="flex items-center gap-2 justify-end">
                    <button onClick={() => setView({ name: 'agendamentos', doctorId: d.id })} className="text-base font-black text-gray-800 hover:text-teal-500 px-4 py-2 transition decoration-0">Agendar</button>
                    <button onClick={() => openEdit(d)} className="text-sm font-bold text-teal-500 hover:text-teal-700 px-4 py-2 rounded-xl hover:bg-teal-50 transition">Editar</button>
                    <button onClick={() => remove(d.id)} className="text-sm font-bold text-red-400 hover:text-red-600 px-4 py-2 rounded-xl hover:bg-red-50 transition">Remover</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal && <Modal title={modal === 'add' ? 'Novo Especialista' : 'Editar Especialista'} fields={fields} data={form} onChange={handleChange} onSave={save} onClose={() => setModal(null)} />}
    </div>
  )
}

function AgendamentosView({ appointments, setAppointments, filterDoctorId, doctors }) {
  const empty = { patientName: '', doctorId: filterDoctorId || doctors[0]?.id, doctorName: doctors.find(d => d.id === (filterDoctorId || doctors[0]?.id))?.name, date: '', time: '', phone: '', email: '', status: 'Aguardando' }
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(empty)

  const openAdd = () => { setForm(empty); setModal('add') }
  const openEdit = (a) => { setForm({ ...a }); setModal('edit') }
  const handleChange = (k, v) => {
    if (k === 'doctorId') {
      const doc = doctors.find(d => d.id === Number(v))
      setForm(f => ({ ...f, doctorId: doc.id, doctorName: doc.name }))
    } else {
      setForm(f => ({ ...f, [k]: v }))
    }
  }

  const save = async () => {
    try {
      const saved = await db.saveAppointment(form)
      if (modal === 'add') setAppointments(p => [...p, saved])
      else setAppointments(p => p.map(a => (a.id === form.id ? saved : a)))
      setModal(null)
    } catch (err) {
      alert('Erro ao salvar agendamento')
    }
  }
  const remove = async (id) => {
    if (confirm('Remover agendamento?')) {
      try {
        await db.deleteAppointment(id)
        setAppointments(p => p.filter(a => a.id !== id))
      } catch (err) {
        alert('Erro ao remover agendamento')
      }
    }
  }

  const filtered = filterDoctorId
    ? appointments.filter(a => a.doctorId === filterDoctorId)
    : appointments;

  const getDoctorName = (id) => doctors.find(d => d.id === id)?.name || 'Especialista';

  const fields = [
    { key: 'patientName', label: 'Nome do Paciente *' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Telefone' },
    { key: 'date', label: 'Data', type: 'date' },
    { key: 'time', label: 'Horário (ex: 14:30) *' },
    { key: 'status', label: 'Status', select: ['Aguardando', 'Confirmado', 'Cancelado'] }
  ]

  // Add doctor select if not filtered
  const finalFields = filterDoctorId ? fields : [
    { key: 'doctorId', label: 'Especialista', select: doctors.map(d => ({ value: d.id, label: d.name })) },
    ...fields
  ]

  return (
    <div className="p-10">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">
            {filterDoctorId ? `Agendamentos: ${getDoctorName(filterDoctorId)}` : 'Todos os Agendamentos'}
          </h1>
          <p className="text-gray-500 text-lg mt-1">Lista de consultas marcadas</p>
        </div>
        <button onClick={openAdd} className="bg-teal-500 hover:bg-teal-600 text-white font-bold text-base px-6 py-3.5 rounded-xl flex items-center gap-2 transition shadow-sm">
          {iconPlus} Novo Agendamento
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-7 py-4 text-base font-bold text-gray-500">Paciente</th>
              <th className="text-left px-7 py-4 text-base font-bold text-gray-500">Especialista</th>
              <th className="text-left px-7 py-4 text-base font-bold text-gray-500">Data/Hora</th>
              <th className="text-left px-7 py-4 text-base font-bold text-gray-500">Status</th>
              <th className="px-7 py-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50 transition">
                <td className="px-7 py-5">
                  <p className="font-bold text-gray-800 text-base">{a.patientName}</p>
                  <p className="text-sm text-gray-400">{a.phone}</p>
                </td>
                <td className="px-7 py-5 text-base text-gray-600 font-medium">
                  {a.doctorName}
                </td>
                <td className="px-7 py-5 text-base text-gray-500">
                  {new Date(a.date).toLocaleDateString('pt-BR')} às {a.time}
                </td>
                <td className="px-7 py-5">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${a.status === 'Confirmado' ? 'bg-green-50 text-green-600' :
                    a.status === 'Cancelado' ? 'bg-red-50 text-red-600' :
                      'bg-yellow-50 text-yellow-600'
                    }`}>
                    {a.status}
                  </span>
                </td>
                <td className="px-7 py-5 text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <button onClick={() => openEdit(a)} className="text-sm font-bold text-teal-500 hover:text-teal-700 px-4 py-2 rounded-xl hover:bg-teal-50 transition">Editar</button>
                    <button onClick={() => remove(a.id)} className="text-sm font-bold text-red-400 hover:text-red-600 px-4 py-2 rounded-xl hover:bg-red-50 transition">Remover</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="5" className="px-7 py-10 text-center text-gray-400 text-lg italic">
                  Nenhum agendamento encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {modal && (
        <Modal
          title={modal === 'add' ? 'Novo Agendamento' : 'Editar Agendamento'}
          fields={finalFields}
          data={form}
          onChange={handleChange}
          onSave={save}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}

function BlogManageView({ posts, setPosts }) {
  const empty = { title: '', tag: '', date: '', img: '', excerpt: '', content: '' }
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(empty)

  const openAdd = () => { setForm(empty); setModal('add') }
  const openEdit = (p) => { setForm({ ...p }); setModal('edit') }
  const handleChange = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const save = async () => {
    try {
      const saved = await db.savePost(form)
      if (modal === 'add') setPosts((p) => [saved, ...p])
      else setPosts((p) => p.map((x) => (x.id === form.id ? saved : x)))
      setModal(null)
    } catch (err) {
      alert('Erro ao salvar postagem')
    }
  }
  const remove = async (id) => {
    if (confirm('Remover postagem?')) {
      try {
        await db.deletePost(id)
        setPosts((p) => p.filter((x) => x.id !== id))
      } catch (err) {
        alert('Erro ao remover postagem')
      }
    }
  }

  const tagColors = {
    'Prevenção': 'bg-teal-50 text-teal-600',
    'Tratamentos': 'bg-blue-50 text-blue-600',
    'Ortodontia': 'bg-purple-50 text-purple-600',
    'Estética': 'bg-pink-50 text-pink-600',
    'Odontopediatria': 'bg-orange-50 text-orange-600',
  }

  const fields = [
    { key: 'title', label: 'Título *' },
    { key: 'tag', label: 'Categoria' },
    { key: 'date', label: 'Data de Publicação' },
    { key: 'img', label: 'URL da Imagem de Capa' },
    { key: 'excerpt', label: 'Resumo (Excerpt) *', textarea: true, rows: 3, maxLength: 300, placeholder: 'Breve descrição que aparece na listagem do blog...' },
    { key: 'content', label: 'Conteúdo Completo', textarea: true, rows: 6, maxLength: 500, placeholder: 'Conteúdo completo do artigo...' },
  ]

  return (
    <div className="p-10">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Postagens do Blog</h1>
          <p className="text-gray-500 text-lg mt-1">Gerencie os artigos publicados</p>
        </div>
        <button onClick={openAdd} className="bg-teal-500 hover:bg-teal-600 text-white font-bold text-base px-6 py-3.5 rounded-xl flex items-center gap-2 transition shadow-sm">
          {iconPlus} Nova Postagem
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-7 py-4 text-base font-bold text-gray-500">Postagem</th>
              <th className="text-left px-7 py-4 text-base font-bold text-gray-500">Categoria</th>
              <th className="text-left px-7 py-4 text-base font-bold text-gray-500">Data</th>
              <th className="px-7 py-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {posts.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition">
                <td className="px-7 py-5">
                  <div className="flex items-center gap-4">
                    <img
                      src={p.img} alt={p.title}
                      className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                      onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=Post&background=0d9488&color=fff' }}
                    />
                    <span className="font-bold text-gray-800 text-base">{p.title}</span>
                  </div>
                </td>
                <td className="px-7 py-5">
                  <span className={`text-sm font-bold px-3 py-1.5 rounded-full ${tagColors[p.tag] || 'bg-gray-100 text-gray-600'}`}>{p.tag}</span>
                </td>
                <td className="px-7 py-5 text-base text-gray-500">{p.date}</td>
                <td className="px-7 py-5">
                  <div className="flex items-center gap-2 justify-end">
                    <button onClick={() => openEdit(p)} className="text-sm font-bold text-teal-500 hover:text-teal-700 px-4 py-2 rounded-xl hover:bg-teal-50 transition">Editar</button>
                    <button onClick={() => remove(p.id)} className="text-sm font-bold text-red-400 hover:text-red-600 px-4 py-2 rounded-xl hover:bg-red-50 transition">Remover</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal && <Modal title={modal === 'add' ? 'Nova Postagem' : 'Editar Postagem'} fields={fields} data={form} onChange={handleChange} onSave={save} onClose={() => setModal(null)} />}
    </div>
  )
}

const iconSettings = <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>

function Sidebar({ view, setView, navigate }) {
  const items = [
    { key: 'dashboard', label: 'Dashboard', icon: iconDash },
    { key: 'especialistas', label: 'Especialistas', icon: iconUser },
    { key: 'agendamentos', label: 'Agendamentos', icon: iconCalendar },
    { key: 'blog', label: 'Postagens do Blog', icon: iconDoc },
    { key: 'settings', label: 'Configurações', icon: iconSettings },
  ]
  return (
    <aside className="w-72 min-h-screen bg-slate-900 flex flex-col flex-shrink-0">
      <div className="px-7 py-7 border-b border-slate-700 flex items-center gap-4">
        <div className="w-12 h-12 bg-teal-500 rounded-2xl flex-shrink-0" />
        <div>
          <p className="text-white font-bold text-lg leading-tight">Painel Admin</p>
          <p className="text-slate-400 text-sm mt-0.5">Clínica Odontológica</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-5 space-y-1">
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => setView(item.key)}
            className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-base font-semibold transition-colors text-left ${view === item.key
              ? 'bg-teal-500 text-white'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="px-4 pb-6 border-t border-slate-700 pt-4 space-y-1">
        <Link
          to="/"
          className="flex items-center gap-4 px-5 py-3.5 rounded-2xl text-base font-semibold text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          {iconLink}
          Ver Site
        </Link>
        <button
          onClick={() => navigate('/admin')}
          className="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-base font-semibold text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          {iconExit}
          Sair
        </button>
      </div>
    </aside>
  )
}

function SettingsView() {
  const [form, setForm] = useState({ user: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState({ type: '', text: '' })

  const save = async (e) => {
    e.preventDefault()
    if (!form.user || !form.password) {
      setMsg({ type: 'error', text: 'Preencha usuário e senha.' })
      return
    }
    if (form.password !== form.confirm) {
      setMsg({ type: 'error', text: 'As senhas não coincidem.' })
      return
    }
    setLoading(true)
    try {
      await db.updateAdmin({ user: form.user, password: form.password })
      setMsg({ type: 'success', text: 'Credenciais atualizadas com sucesso!' })
      setForm({ user: '', password: '', confirm: '' })
    } catch (err) {
      setMsg({ type: 'error', text: 'Erro ao atualizar credenciais.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-10 max-w-2xl">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Configurações</h1>
        <p className="text-gray-500 text-lg mt-1">Altere os dados de acesso administrativo</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <form onSubmit={save} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Novo Usuário Admin</label>
            <input
              type="text"
              value={form.user}
              onChange={e => setForm({ ...form, user: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-teal-400"
              placeholder="Ex: josias_admin"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Nova Senha</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-teal-400"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Confirmar Nova Senha</label>
            <input
              type="password"
              value={form.confirm}
              onChange={e => setForm({ ...form, confirm: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-teal-400"
              placeholder="••••••••"
            />
          </div>

          {msg.text && (
            <p className={`text-sm font-medium ${msg.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
              {msg.text}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-lg py-4 rounded-xl transition shadow-md disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Atualizar Credenciais'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function AdminDashboard({ initialView = 'dashboard' }) {
  const [view, setView] = useState(initialView)
  const [doctors, setDoctors] = useState([])
  const [posts, setPosts] = useState([])
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docs, pts, apps] = await Promise.all([
          db.getDoctors(),
          db.getPosts(),
          db.getAppointments()
        ])
        setDoctors(docs.length ? docs : [])
        setPosts(pts.length ? pts : [])
        setAppointments(apps.length ? apps : [])
      } catch (err) {
        console.error('Erro ao carregar dados:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const currentViewKey = typeof view === 'string' ? view : view.name;

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar view={currentViewKey} setView={setView} navigate={navigate} />
      <main className="flex-1 overflow-auto">
        {currentViewKey === 'dashboard' && <DashboardView doctors={doctors} posts={posts} appointments={appointments} setView={setView} />}
        {currentViewKey === 'especialistas' && <EspecialistasView doctors={doctors} setDoctors={setDoctors} setView={setView} />}
        {currentViewKey === 'agendamentos' && <AgendamentosView appointments={appointments} setAppointments={setAppointments} filterDoctorId={view?.doctorId} doctors={doctors} />}
        {currentViewKey === 'blog' && <BlogManageView posts={posts} setPosts={setPosts} />}
        {currentViewKey === 'settings' && <SettingsView />}
      </main>
    </div>
  )
}
