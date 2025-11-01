'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function AuthButton() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    let mounted = true
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setUser(data.session?.user ?? null)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => { mounted = false; sub?.subscription.unsubscribe?.() }
  }, [])

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({ provider: 'google' })
    // redireciona automaticamente para o callback do Supabase, se configurado.
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
  }

  if (!user) {
    return (
      <div className="flex gap-2">
        <button onClick={signInWithGoogle} className="px-3 py-1 rounded border">Entrar com Google</button>
        <button onClick={() => supabase.auth.signInWithPassword({ email: 'teste@ex.com', password: 'senha' })} className="px-3 py-1 rounded border">(email dev)</button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <img src={user.user_metadata?.avatar_url || ''} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
      <span className="text-sm">{user.email ?? user.user_metadata?.full_name}</span>
      <button onClick={signOut} className="px-2 py-1 border rounded">Sair</button>
    </div>
  )
}
