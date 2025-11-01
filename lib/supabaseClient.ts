import { createClient } from "@supabase/supabase-js";

// ⚠️ As variáveis de ambiente devem começar com NEXT_PUBLIC_ para o frontend enxergar.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 🚀 Criar o cliente Supabase para uso no frontend
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
