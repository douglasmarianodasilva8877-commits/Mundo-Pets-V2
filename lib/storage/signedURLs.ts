import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  { auth: { persistSession: false } }
);

export async function createSignedUploadURL(ext: string, mime: string) {
  const filePath = `posts/${crypto.randomUUID()}.${ext}`;

  const { data, error } = await supabase.storage
    .from("posts")
    .createSignedUploadUrl(filePath, {
      contentType: mime,
    });

  if (error) throw error;

  return {
    uploadUrl: data.signedUrl,
    publicUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/posts/${filePath}`,
  };
}
