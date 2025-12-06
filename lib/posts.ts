// lib/posts.ts
export type MediaItemInput = { type: "image" | "video" | "gif"; url: string };

export async function createPostClient(input: {
  content?: string;
  media?: MediaItemInput[];
  petId?: string | null;
}) {
  try {
    const res = await fetch("/api/create-post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: input.content ?? "",
        media: input.media ?? [],
        petId: input.petId ?? null,
      }),
    });

    const json = await res.json();
    return json;
  } catch (err) {
    console.error("createPostClient error:", err);
    return { success: false, message: (err as any)?.message ?? "Erro cliente" };
  }
}
