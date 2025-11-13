// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// ⚠️ As variáveis de ambiente devem começar com NEXT_PUBLIC_
// para ficarem acessíveis no frontend
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 🚀 Cria o cliente Supabase para uso no frontend
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
