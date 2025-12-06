// components/UploadMediaButton.tsx
"use client";

import { UploadButton } from "@/utils/uploadthing";
import { useState } from "react";

interface UploadMediaButtonProps {
  onUploadComplete?: (url: string) => void;
}

export default function UploadMediaButton({ onUploadComplete }: UploadMediaButtonProps) {
  const [uploading, setUploading] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <UploadButton
        endpoint="postMedia"
        onUploadBegin={() => setUploading(true)}
        onUploadComplete={(res) => {
          setUploading(false);

          const url = res?.[0]?.url;
          if (!url) {
            console.error("UploadThing não retornou URL válida:", res);
            return;
          }

          onUploadComplete?.(url);
        }}
        onUploadError={(error) => {
          console.error("Erro no upload:", error);
          setUploading(false);
        }}
      />

      {uploading && (
        <p className="text-sm text-blue-500">Enviando mídia...</p>
      )}
    </div>
  );
}
