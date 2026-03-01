import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as db from '../lib/supabaseService'
import { initialDoctors as fallbackDoctors } from '../data/doctors'
import { initialPosts as fallbackPosts } from '../data/posts'
import { initialAppointments as fallbackAppointments } from '../data/appointments'

// Icons
const iconDash = <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
const iconUser = <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
const iconDoc = <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
const iconExit = <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
const iconLink = <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
const iconPlus = <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
const iconX = <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
const iconCalendar = <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
const iconSettings = <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>

const FIX_DRIVE_URL = (url) => {
  if (!url || typeof url !== 'string') return url;
  if (url.includes('drive.google.com')) {
    let fileId = '';
    const dMatch = url.match(/\/file\/d\/([^/#?&]+)/) || url.match(/\/d\/([^/#?&]+)/);
    if (dMatch) fileId = dMatch[1];
    if (!fileId) {
      const idMatch = url.match(/[?&]id=([^&#]+)/);
      if (idMatch) fileId = idMatch[1];
    }
    if (fileId) {
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
    }
  }
  return url;
};

function ActionSelect({ onEdit, onRemove, onSchedule }) {
  return (
    <div className="relative inline-block w-[100px] sm:w-[110px]">
      <select
        onChange={(e) => {
          const val = e.target.value
          if (val === 'edit') onEdit()
          if (val === 'remove') onRemove()
          if (val === 'schedule' && onSchedule) onSchedule()
          e.target.value = ''
        }}
        className="w-full bg-white border border-teal-500 text-teal-600 font-bold py-1 px-2 pr-6 rounded-lg focus:outline-none appearance-none text-[10px] transition-all shadow-sm cursor-pointer"
        defaultValue=""
      >
        <option value="" disabled>Ações</option>
        {onSchedule && <option value="schedule">Agendar</option>}
        <option value="edit">Editar</option>
        <option value="remove">Remover</option>
      </select>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-teal-500">
        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </div>
    </div>
  )
}

function StatCard({ icon, count, label }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 px-8 py-7 flex items-center gap-6 shadow-sm">
      <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center flex-shrink-0 text-teal-500">
        {icon}
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
    <div className="p-6 lg:p-10">
      <div className="mb-10 text-gray-800">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="text-gray-500 text-lg mt-1">Visão geral do conteúdo do site</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard icon={iconUser} count={doctors.length} label="Especialistas" />
        <StatCard icon={iconCalendar} count={appointments.length} label="Agendamentos" />
        <StatCard icon={iconDoc} count={posts.length} label="Postagens" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-800 text-xl">Especialistas</h2>
            <button onClick={() => setView('especialistas')} className="text-teal-500 font-bold text-sm hover:underline">Gerenciar</button>
          </div>
          <ul className="divide-y divide-gray-50">
            {doctors.slice(0, 5).map((d) => (
              <li key={d.id} className="flex items-center gap-5 px-7 py-4">
                <img src={d.img} alt={d.name} className="w-12 h-12 rounded-full object-cover shadow-sm" onError={(e) => e.target.src = 'https://ui-avatars.com/api/?name=' + d.name} />
                <div className="flex-1 min-w-0 text-gray-800">
                  <p className="font-bold text-base truncate">{d.name}</p>
                  <p className="text-sm text-gray-400">{d.specialty}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-800 text-xl">Blog Recente</h2>
            <button onClick={() => setView('blog')} className="text-teal-500 font-bold text-sm hover:underline">Gerenciar</button>
          </div>
          <ul className="divide-y divide-gray-50">
            {posts.slice(0, 5).map((p) => (
              <li key={p.id} className="flex items-center gap-5 px-7 py-4">
                <img src={p.img} alt={p.title} className="w-12 h-12 rounded-xl object-cover shadow-sm" onError={(e) => e.target.src = 'https://ui-avatars.com/api/?name=Post'} />
                <div className="flex-1 min-w-0 text-gray-800">
                  <p className="font-bold text-base truncate">{p.title}</p>
                  <p className="text-sm text-gray-400">{p.date}</p>
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 flex-shrink-0">
          <h3 className="font-bold text-gray-800 text-xl">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-50 rounded-lg">{iconX}</button>
        </div>
        <div className="p-8 space-y-5 overflow-y-auto">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-semibold text-gray-600 mb-2">{f.label}</label>
              {f.textarea ? (
                <textarea
                  rows={f.rows || 4}
                  value={data[f.key] || ''}
                  onChange={(e) => onChange(f.key, e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none text-gray-800"
                />
              ) : f.select ? (
                <select
                  value={data[f.key] || ''}
                  onChange={(e) => onChange(f.key, e.target.value)}
                  className="w-full border border-gray-300 bg-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-800"
                >
                  <option value="">Selecione...</option>
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
                  className="w-full border border-gray-300 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-800"
                />
              )}
              {f.key === 'img' && data[f.key] && (
                <div className="mt-3 flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <img src={data[f.key]} alt="Preview" className="w-16 h-16 rounded-lg object-cover shadow-sm bg-white" onError={(e) => e.target.style.display = 'none'} />
                  <span className="text-xs text-gray-500 font-medium">Visualização da Imagem</span>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="px-8 pb-7 pt-4 flex gap-3 justify-end flex-shrink-0 border-t border-gray-100">
          <button onClick={onClose} className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition">Cancelar</button>
          <button onClick={onSave} className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold transition shadow-md">Salvar</button>
        </div>
      </div>
    </div>
  )
}

function EspecialistasView({ doctors, setDoctors, setView }) {
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({ name: '', specialty: '', cro: '', img: '', bio: '' })

  const openAdd = () => { setForm({ name: '', specialty: '', cro: '', img: '', bio: '' }); setModal('add') }
  const openEdit = (d) => { setForm({ ...d }); setModal('edit') }
  const handleChange = (k, v) => setForm((f) => ({ ...f, [k]: k === 'img' ? FIX_DRIVE_URL(v) : v }))

  const save = async () => {
    try {
      const saved = await db.saveDoctor(form)
      if (modal === 'add') setDoctors(prev => [...prev, saved])
      else setDoctors(prev => prev.map(d => d.id === form.id ? saved : d))
      setModal(null)
      setForm({ name: '', specialty: '', cro: '', img: '', bio: '' })
    } catch (err) {
      alert('Erro ao salvar especialista')
    }
  }

  const remove = async (id) => {
    if (confirm('Remover especialista?')) {
      try {
        await db.deleteDoctor(id)
        setDoctors(prev => prev.filter(d => d.id !== id))
      } catch (err) {
        alert('Erro ao remover')
      }
    }
  }

  return (
    <div className="p-6 lg:p-10 text-gray-800">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">Especialistas</h1>
        <button onClick={openAdd} className="w-full sm:w-auto bg-teal-500 hover:bg-teal-600 px-6 py-3 rounded-xl text-white font-bold flex items-center gap-2 shadow-md">
          {iconPlus} Novo Especialista
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full min-w-[300px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-left font-bold text-gray-500 text-xs uppercase">Especialista</th>
              <th className="hidden sm:table-cell px-6 py-4 text-left font-bold text-gray-500 text-xs uppercase">Especialidade</th>
              <th className="px-6 py-4 text-right font-bold text-gray-500 text-xs uppercase w-[150px]">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {doctors.map(d => (
              <tr key={d.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img src={d.img} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover" alt="" onError={(e) => e.target.src = 'https://ui-avatars.com/api/?name=' + d.name} />
                    <p className="font-bold text-sm sm:text-base">{d.name}</p>
                  </div>
                </td>
                <td className="hidden sm:table-cell px-6 py-4 text-gray-500 text-sm">{d.specialty}</td>
                <td className="px-6 py-4 text-right">
                  <ActionSelect
                    onSchedule={() => setView({ name: 'agendamentos', doctorId: d.id })}
                    onEdit={() => openEdit(d)}
                    onRemove={() => remove(d.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal && <Modal title={modal === 'add' ? 'Adicionar' : 'Editar'} fields={[{ key: 'name', label: 'Nome*' }, { key: 'specialty', label: 'Especialidade*' }, { key: 'cro', label: 'CRO*' }, { key: 'img', label: 'URL da Imagem' }, { key: 'bio', label: 'Bio', textarea: true }]} data={form} onChange={handleChange} onSave={save} onClose={() => setModal(null)} />}
    </div>
  )
}

function AgendamentosView({ appointments, setAppointments, filterDoctorId, doctors }) {
  const [modal, setModal] = useState(null)
  const defaultDoc = doctors.length > 0 ? doctors[0] : { id: '', name: '' }
  const [form, setForm] = useState({ patientName: '', patientPhone: '', date: '', time: '', status: 'Aguardando', doctorId: filterDoctorId || defaultDoc.id })

  const openAdd = () => {
    setForm({ patientName: '', patientPhone: '', date: '', time: '', status: 'Aguardando', doctorId: filterDoctorId || defaultDoc.id })
    setModal('add')
  }
  const openEdit = (a) => { setForm({ ...a }); setModal('edit') }

  const save = async () => {
    if (!form.patientName || !form.date || !form.time || !form.doctorId) {
      alert('Preencha os campos obrigatórios (*)')
      return
    }

    // Verificar se o horário já está ocupado
    const isBusy = appointments.some(a =>
      String(a.doctorId) === String(form.doctorId) &&
      a.date === form.date &&
      a.time === form.time &&
      a.id !== form.id
    )

    if (isBusy) {
      alert('Este horário já está ocupado para este especialista!')
      return
    }

    try {
      const doc = doctors.find(d => String(d.id) === String(form.doctorId))
      const payload = { ...form, doctorName: doc?.name || '' }
      const savedDocs = await db.saveAppointment(payload)
      if (modal === 'add') setAppointments(p => [...p, savedDocs])
      else setAppointments(p => p.map(x => x.id === form.id ? savedDocs : x))
      setModal(null)
      setForm({ patientName: '', patientPhone: '', date: '', time: '', status: 'Aguardando', doctorId: filterDoctorId || defaultDoc.id })
    } catch (e) { alert('Erro ao salvar') }
  }

  const remove = async (id) => {
    if (confirm('Remover?')) {
      try {
        await db.deleteAppointment(id)
        setAppointments(p => p.filter(x => x.id !== id))
      } catch (e) { alert('Erro ao remover') }
    }
  }

  const filtered = filterDoctorId ? appointments.filter(a => a.doctorId === filterDoctorId) : appointments
  const getDocName = (id) => doctors.find(d => d.id === id)?.name || 'Especialista'

  return (
    <div className="p-3 lg:p-10 text-gray-800">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">{filterDoctorId ? `Agendamentos de ${getDocName(filterDoctorId)}` : 'Agendamentos'}</h1>
        <button onClick={openAdd} className="w-full sm:w-auto bg-teal-500 hover:bg-teal-600 px-6 py-3 rounded-xl text-white font-bold flex items-center justify-center gap-2">{iconPlus} Novo</button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full min-w-[380px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-2 py-4 text-left font-bold text-gray-500 text-[10px] uppercase">Paciente</th>
              <th className="px-2 py-4 text-center font-bold text-gray-500 text-[10px] uppercase">Data/Hora</th>
              <th className="px-1 py-4 text-center font-bold text-gray-500 text-[10px] uppercase w-[40px]">S</th>
              <th className="px-2 py-4 text-right font-bold text-gray-500 text-[10px] uppercase w-[115px]">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(a => (
              <tr key={a.id} className="hover:bg-gray-50 transition">
                <td className="px-2 py-4">
                  <p className="font-bold text-sm leading-tight mb-1">{a.patientName}</p>
                  <p className="text-[10px] text-gray-400 line-clamp-1">{a.doctorName || getDocName(a.doctorId)}</p>
                </td>
                <td className="px-2 py-4 text-center text-[11px] leading-snug">
                  {a.date} <br /> <span className="font-bold">{a.time}</span>
                </td>
                <td className="px-1 py-4">
                  <div className="flex justify-center">
                    <div
                      title={a.status}
                      className={`w-3 h-3 rounded-full shadow-sm ${a.status === 'Confirmado' ? 'bg-green-500' :
                        a.status === 'Cancelado' ? 'bg-red-500' :
                          'bg-yellow-400'
                        }`}
                    />
                  </div>
                </td>
                <td className="px-2 py-4 text-right">
                  <ActionSelect onEdit={() => openEdit(a)} onRemove={() => remove(a.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal && (
        <Modal
          title="Agendamento"
          fields={[
            ...(!filterDoctorId ? [{ key: 'doctorId', label: 'Especialista*', select: doctors.map(d => ({ value: d.id, label: d.name })) }] : []),
            { key: 'patientName', label: 'Paciente*' },
            { key: 'patientPhone', label: 'Telefone' },
            { key: 'date', label: 'Data', type: 'date' },
            { key: 'time', label: 'Hora*' },
            { key: 'status', label: 'Status', select: ['Aguardando', 'Confirmado', 'Cancelado'] }
          ]}
          data={form}
          onChange={(k, v) => setForm(f => ({ ...f, [k]: v }))}
          onSave={save}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}

function BlogManageView({ posts, setPosts }) {
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({ title: '', tag: 'Prevenção', date: '', img: '', excerpt: '', content: '' })

  const openAdd = () => {
    setForm({ title: '', tag: 'Prevenção', date: '', img: '', excerpt: '', content: '' })
    setModal('add')
  }
  const openEdit = (p) => { setForm({ ...p }); setModal('edit') }

  const save = async () => {
    try {
      const saved = await db.savePost(form)
      setPosts(p => modal === 'add' ? [saved, ...p] : p.map(x => x.id === form.id ? saved : x))
      setModal(null)
      setForm({ title: '', tag: 'Prevenção', date: '', img: '', excerpt: '', content: '' })
    } catch (e) { alert('Erro ao salvar') }
  }

  return (
    <div className="p-6 lg:p-10 text-gray-800">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">Gerenciar Blog</h1>
        <button onClick={openAdd} className="w-full sm:w-auto bg-teal-500 hover:bg-teal-600 px-6 py-3 rounded-xl text-white font-bold flex items-center justify-center gap-2">{iconPlus} Nova Postagem</button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full min-w-[300px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-left font-bold text-gray-500 text-xs uppercase">Artigo</th>
              <th className="px-6 py-4 text-right font-bold text-gray-500 text-xs uppercase w-[150px]">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {posts.map(p => (
              <tr key={p.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4 text-gray-800">
                    <img src={p.img} className="w-10 h-10 rounded-lg object-cover" alt="" onError={(e) => e.target.src = 'https://ui-avatars.com/api/?name=Blog'} />
                    <p className="font-bold text-sm line-clamp-1">{p.title}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <ActionSelect onEdit={() => openEdit(p)} onRemove={() => db.deletePost(p.id).then(() => setPosts(prev => prev.filter(x => x.id !== p.id)))} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal && <Modal title="Postagem" fields={[{ key: 'id', label: 'Slug*' }, { key: 'title', label: 'Título*' }, { key: 'tag', label: 'Cat', select: ['Prevenção', 'Tratamentos', 'Ortodontia', 'Estética', 'Odontopediatria'] }, { key: 'img', label: 'Img URL' }, { key: 'excerpt', label: 'Resumo', textarea: true }, { key: 'content', label: 'Conteúdo', textarea: true }]} data={form} onChange={(k, v) => setForm(f => ({ ...f, [k]: k === 'img' ? FIX_DRIVE_URL(v) : v }))} onSave={save} onClose={() => setModal(null)} />}
    </div>
  )
}

function SettingsView() {
  const [form, setForm] = useState({ user: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const save = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) return alert('Senhas desiguais')
    setLoading(true)
    try { await db.updateAdmin({ user: form.user, password: form.password }); alert('Sucesso!') } catch (e) { alert('Erro') }
    setLoading(false)
  }
  return (
    <div className="p-6 lg:p-10 max-w-lg text-gray-800">
      <h1 className="text-3xl font-bold mb-8">Configurações</h1>
      <form onSubmit={save} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div><label className="text-sm font-bold block mb-1">Usuário</label><input className="w-full border rounded-xl p-3" value={form.user} onChange={e => setForm({ ...form, user: e.target.value })} /></div>
        <div><label className="text-sm font-bold block mb-1">Senha</label><input className="w-full border rounded-xl p-3" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></div>
        <div><label className="text-sm font-bold block mb-1">Confirmar</label><input className="w-full border rounded-xl p-3" type="password" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} /></div>
        <button disabled={loading} className="w-full bg-teal-600 text-white font-bold py-3 rounded-xl mt-4 shadow-md">{loading ? 'Salvando...' : 'Salvar Alterações'}</button>
      </form>
    </div>
  )
}

function Sidebar({ view, setView, navigate, setSidebarOpen }) {
  const items = [
    { key: 'dashboard', label: 'Dashboard', icon: iconDash },
    { key: 'especialistas', label: 'Especialistas', icon: iconUser },
    { key: 'agendamentos', label: 'Agendamentos', icon: iconCalendar },
    { key: 'blog', label: 'Blog', icon: iconDoc },
    { key: 'settings', label: 'Ajustes', icon: iconSettings },
  ]
  return (
    <aside className="w-72 h-full bg-slate-900 flex flex-col">
      <div className="p-8 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-xl font-serif">R</div>
          <span className="text-white font-bold tracking-tight">Painel Admin</span>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-500">{iconX}</button>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {items.map(it => (
          <button key={it.key} onClick={() => { setView(it.key); setSidebarOpen(false) }} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all ${view === it.key ? 'bg-teal-500 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
            {it.icon} {it.label}
          </button>
        ))}
      </nav>
      <div className="p-6 border-t border-slate-800 space-y-2">
        <Link to="/" className="w-full flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white transition-colors text-sm font-bold">{iconLink} Visualizar Site</Link>
        <button onClick={() => navigate('/admin')} className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 transition-colors text-sm font-bold">{iconExit} Sair</button>
      </div>
    </aside>
  )
}

export default function AdminDashboard({ initialView = 'dashboard' }) {
  const [view, setView] = useState(initialView)
  const [doctors, setDoctors] = useState([])
  const [posts, setPosts] = useState([])
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      try {
        const [d, p, a] = await Promise.all([db.getDoctors(), db.getPosts(), db.getAppointments()])
        setDoctors(d || [])
        setPosts(p || [])
        setAppointments(a || [])
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    load()
  }, [])

  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-gray-50"><div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div></div>

  const vk = typeof view === 'string' ? view : view.name

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
      <div className={`fixed inset-0 bg-black/50 z-[80] lg:hidden transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setSidebarOpen(false)} />
      <div className={`fixed lg:relative z-[90] h-full transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar view={vk} setView={setView} navigate={navigate} setSidebarOpen={setSidebarOpen} />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden bg-white p-4 items-center justify-between border-b flex flex-shrink-0">
          <span className="font-bold text-gray-800">Rivera Admin</span>
          <button onClick={() => setSidebarOpen(true)} className="p-2 bg-gray-50 rounded-lg">{iconDash}</button>
        </header>
        <main className="flex-1 overflow-y-auto">
          {vk === 'dashboard' && <DashboardView doctors={doctors} posts={posts} appointments={appointments} setView={setView} />}
          {vk === 'especialistas' && <EspecialistasView doctors={doctors} setDoctors={setDoctors} setView={setView} />}
          {vk === 'agendamentos' && <AgendamentosView appointments={appointments} setAppointments={setAppointments} filterDoctorId={typeof view === 'object' ? view.doctorId : null} doctors={doctors} />}
          {vk === 'blog' && <BlogManageView posts={posts} setPosts={setPosts} />}
          {vk === 'settings' && <SettingsView />}
        </main>
      </div>
    </div>
  )
}
