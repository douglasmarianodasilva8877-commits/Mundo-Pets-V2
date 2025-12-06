// lib/api.ts
export async function apiPost(path: string, data: any, isForm = false) {
  const headers: HeadersInit = {};

  if (!isForm) headers["Content-Type"] = "application/json";

  const res = await fetch(path, {
    method: "POST",
    headers,
    body: isForm ? data : JSON.stringify(data),
  });

  return res.json();
}
