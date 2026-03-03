import { supabase } from './supabase'

export const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
}

export const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
}

export const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
}

export const updateUserPassword = async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) throw error
    return data
}

export const registerNewAdmin = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    return data
}

export const deleteCurrentAccount = async () => {
    const { error } = await supabase.rpc('delete_user_self')
    if (error) throw error
    const { error: signOutError } = await supabase.auth.signOut()
    if (signOutError) throw signOutError
}

export const getDoctors = async () => {
    const { data, error } = await supabase.from('doctors').select('*')
    if (error) throw error
    return data
}

export const saveDoctor = async (doctor) => {
    try {
        const { id, ...rest } = doctor
        // Se temos um ID numérico real (não um timestamp de Date.now()), fazemos update
        if (id && typeof id === 'number' && id < 1000000000000) {
            const { data, error } = await supabase.from('doctors').update(rest).eq('id', id).select()
            if (error) throw error
            return data[0]
        } else {
            // Se id é undefined ou um timestamp alto, é uma nova inserção
            const { data, error } = await supabase.from('doctors').insert([rest]).select()
            if (error) throw error
            return data[0]
        }
    } catch (error) {
        console.error('Erro em saveDoctor:', error)
        throw error
    }
}

export const deleteDoctor = async (id) => {
    const { error } = await supabase.from('doctors').delete().eq('id', id)
    if (error) throw error
}

export const getAppointments = async () => {
    const { data, error } = await supabase.from('appointments').select('*')
    if (error) throw error
    return data
}

export const saveAppointment = async (appointment) => {
    const { id, ...rest } = appointment
    if (id && id > 1000000000) { // Date.now() check
        const { data, error } = await supabase.from('appointments').insert([rest]).select()
        if (error) throw error
        return data[0]
    } else if (id) {
        const { data, error } = await supabase.from('appointments').update(rest).eq('id', id).select()
        if (error) throw error
        return data[0]
    } else {
        const { data, error } = await supabase.from('appointments').insert([rest]).select()
        if (error) throw error
        return data[0]
    }
}

export const deleteAppointment = async (id) => {
    const { error } = await supabase.from('appointments').delete().eq('id', id)
    if (error) throw error
}

export const getPosts = async () => {
    const { data, error } = await supabase.from('posts').select('*').order('date', { ascending: false })
    if (error) throw error
    return data
}

export const savePost = async (post) => {
    try {
        // Como o ID do post é um Texto (slug) fornecido pelo usuário, 
        // usamos upsert para inserir se não existir ou atualizar se existir.
        const { data, error } = await supabase.from('posts').upsert(post).select()
        if (error) throw error
        return data[0]
    } catch (error) {
        console.error('Erro em savePost:', error)
        throw error
    }
}

export const deletePost = async (id) => {
    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (error) throw error
}

export const getAdmin = async () => {
    const { data, error } = await supabase.from('settings').select('*').eq('key', 'admin_creds').single()
    if (error && error.code !== 'PGRST116') throw error // PGRST116 is "no rows"
    return data?.value
}

export const updateAdmin = async (creds) => {
    const { data, error } = await supabase.from('settings').upsert({ key: 'admin_creds', value: creds }).select()
    if (error) throw error
    return data[0]
}
