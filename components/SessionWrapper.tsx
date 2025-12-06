"use client";

import { SessionProvider, useSession as useNextAuthSession } from "next-auth/react";
import { ReactNode } from "react";

/**
 * Wrapper global para sessão NextAuth
 */
export default function SessionWrapper({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

/**
 * Reexporta o hook para padronizar o import:
 * import { useSession } from "@/components/SessionWrapper";
 */
export function useSession() {
  return useNextAuthSession();
}
