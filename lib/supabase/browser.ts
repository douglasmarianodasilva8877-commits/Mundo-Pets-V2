// lib/supabase/browser.ts
"use client";

/**
 * Supabase client usado no browser.
 * Usa as variáveis NEXT_PUBLIC_* (não expor keys privadas).
 * Requer: NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY
 */

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!url || !anonKey) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing");
}

export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true,
  },
});
