'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const UserContext = createContext<any>(null)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    let mounted = true
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setUser(data.session?.user ?? null)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setUser(session?.user ?? null)
    })

    return () => { mounted = false; sub?.subscription.unsubscribe?.() }
  }, [])

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}

export const useUser = () => useContext(UserContext)
