"use client";

import { useUserDataInternal } from "@/context/UserDataContext";

export function useUserData() {
  const ctx = useUserDataInternal();
  if (!ctx) throw new Error("useUserData must be used inside UserDataProvider");
  return ctx;
}
