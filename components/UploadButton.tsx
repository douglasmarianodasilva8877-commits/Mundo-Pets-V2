"use client";

import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/uploadthing.config";

interface FileResult {
  url: string;
  type: string;
}

export default function UploadButtonComponent({
  onUploadComplete,
}: {
  onUploadComplete: (files: FileResult[]) => void;
}) {
  return (
    <UploadButton<OurFileRouter>
      endpoint="postMedia"
      onClientUploadComplete={(res) => {
        if (!res) return;

        const cleaned = res.map((file) => ({
          url: file.url,
          type: file.type?.startsWith("video") ? "video" : "image",
        }));

        onUploadComplete(cleaned);
      }}
      onUploadError={(err) => {
        console.error("Upload error:", err);
        alert("Erro ao enviar arquivo. Verifique o console.");
      }}
    />
  );
}
