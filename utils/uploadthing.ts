// utils/uploadthing.ts
// Helper para criar a instância do UploadThing usada pelo handler server-side.
import { createUploadthing } from "uploadthing/server";
import { UPLOADTHING_APP_ID, UPLOADTHING_SECRET } from "@/uploadthing.config";

if (!UPLOADTHING_APP_ID || !UPLOADTHING_SECRET) {
  // Não lançar aqui para não quebrar builds; mas logamos para dev
  console.warn("UPLOADTHING_APP_ID or UPLOADTHING_SECRET not set - uploads will likely fail.");
}

export const uploadthingInstance = createUploadthing({
  // A API do pacote aceita appId/secret em config em v7 — passamos o que temos.
  appId: UPLOADTHING_APP_ID,
  secret: UPLOADTHING_SECRET,
});
