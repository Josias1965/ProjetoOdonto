import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Variáveis de ambiente do Supabase não encontradas. Verifique se foram configuradas corretamente no Vercel.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
