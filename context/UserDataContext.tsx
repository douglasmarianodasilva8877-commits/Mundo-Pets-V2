// context/UserDataContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface UserData {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  role?: string;
  city?: string;
  bio?: string;
}

interface UserDataContextValue {
  user: UserData | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const UserDataContext = createContext<UserDataContextValue | undefined>(
  undefined
);

export function UserDataProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    try {
      setLoading(true);

      const token = localStorage.getItem("auth_token");
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const res = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        setUser(null);
        setLoading(false);
        return;
      }

      const data = await res.json();
      setUser(data.user || null);
    } catch (err) {
      console.error("Erro ao carregar user:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserDataContext.Provider value={{ user, loading, refreshUser }}>
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  const ctx = useContext(UserDataContext);
  if (!ctx) throw new Error("useUserData must be used inside UserDataProvider");
  return ctx;
}
