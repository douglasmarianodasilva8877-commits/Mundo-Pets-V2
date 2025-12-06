// lib/supabase/storage.ts
import { createSupabaseServer, createSupabaseAdmin } from "./server";

/**
 * Upload robusto que aceita File | Blob | Buffer.
 * - path ex: "pets/avatars/<petId>.jpg"
 * - se bucket for público, retorna publicUrl; caso contrário, gera signedUrl usando createSignedUrl.
 */
export async function uploadFileToBucket({
  file,
  path,
  bucket = "public",
  useAdmin = false,
}: {
  file: Blob | Buffer | File | any;
  path: string;
  bucket?: string;
  useAdmin?: boolean;
}) {
  const client = useAdmin ? createSupabaseAdmin() : createSupabaseServer();

  // Se for um File/Blob no server, talvez seja preciso converter para Buffer.
  const { data, error } = await client.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
  });

  if (error) throw error;

  // tentamos obter public url; se bucket privado, o publicUrl será vazio e se deve usar signedUrl
  const { data: pu } = client.storage.from(bucket).getPublicUrl(path);
  const publicUrl = pu?.publicUrl ?? null;

  return { data, publicUrl };
}

export async function createSignedUrl({
  path,
  bucket = "public",
  expires = 60 * 60, // segundos
}: { path: string; bucket?: string; expires?: number }) {
  const client = createSupabaseServer();
  const { data, error } = await client.storage.from(bucket).createSignedUrl(path, expires);
  if (error) throw error;
  return data.signedUrl;
}

export async function removeFile({ path, bucket = "public" }: { path: string; bucket?: string }) {
  const client = createSupabaseAdmin();
  const { data, error } = await client.storage.from(bucket).remove([path]);
  if (error) throw error;
  return data;
}
