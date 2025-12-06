import { createSignedUploadURL } from "./signedURLs";

export async function getUploadURL(ext: string, mime: string) {
  return createSignedUploadURL(ext, mime);
}
