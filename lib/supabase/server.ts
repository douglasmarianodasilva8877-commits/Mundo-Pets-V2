// lib/supabase/server.ts
/**
 * Supabase helpers server-side.
 *  - createSupabaseServer: cria client com anon key (para SSR/Server Actions)
 *  - createSupabaseAdmin: cria client com SERVICE ROLE (admin) -> **NÃO** exportar para client
 *
 * Requer:
 *  - NEXT_PUBLIC_SUPABASE_URL
 *  - NEXT_PUBLIC_SUPABASE_ANON_KEY
 *  - SUPABASE_SERVICE_ROLE_KEY (apenas para admin)
 */

import { createClient } from "@supabase/supabase-js";

export function createSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  if (!url || !anonKey) throw new Error("Supabase server env vars are not configured");

  return createClient(url, anonKey, {
    auth: { persistSession: false },
  });
}

/**
 * Cliente admin (service role) para operações que precisam privilégios:
 * - gerar signed urls com permissões especiais
 * - operações administrativa sobre storage/db via Edge Functions
 *
 * ATENÇÃO: nunca exponha SUPABASE_SERVICE_ROLE_KEY no client.
 */
export function createSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing");
  return createClient(url, serviceRoleKey);
}
