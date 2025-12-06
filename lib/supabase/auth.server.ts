// lib/supabase/auth.server.ts
/**
 * Helper para criar um cliente Supabase que lê sessão dos cookies do Next.js.
 * Requer: @supabase/auth-helpers-nextjs (ou auth-helpers/nextjs)
 *
 * Uso em server actions / route handlers para obter a sessão atual.
 */

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";

export function createSupabaseServerWithCookie() {
  const cookieStore = cookies();
  return createServerClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    cookieOptions: {
      // leitura customizada usando next/headers
    },
    // Caso sua versão exija outro formato, eu adapto.
  }, { cookies: cookieStore });
}
