// components/MPModal.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Image as ImageIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function MPModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (content: string, image?: File) => void | Promise<void>;
}) {
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    if (!open) {
      setContent("");
      setFile(null);
      setPreview(null);
    }
  }, [open]);

  const submit = async () => {
    if (!content.trim() && !file) return;
    await onSubmit(content, file || undefined);
    setContent("");
    setFile(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-md z-40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.div
            className="fixed left-1/2 top-1/2 z-50 bg-white dark:bg-[#0d1b2a] rounded-2xl shadow-xl w-[92%] max-w-lg p-6"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.25 }}
            style={{ transform: "translate(-50%, -50%)" }}
          >
            <div className="flex items-center justify-between pb-3">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Criar publicação</h2>
              <button onClick={onClose} className="p-2 rounded-full bg-black/10 dark:bg-white/10">
                <X size={18} className="text-gray-700 dark:text-gray-300" />
              </button>
            </div>

            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Compartilhe um momento do seu pet..." className="w-full min-h-[120px] bg-transparent border border-gray-300 dark:border-gray-700 rounded-xl p-3 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500" />

            {preview && (
              <div className="relative mt-4">
                <img src={preview} className="w-full h-64 object-cover rounded-xl" />
                <button onClick={() => setFile(null)} className="absolute top-3 right-3 bg-black/60 text-white rounded-full p-2">
                  <X size={14} />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between mt-5">
              <button onClick={() => fileRef.current?.click()} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300">
                <ImageIcon size={18} />
                {file ? "Trocar imagem" : "Adicionar imagem"}
              </button>

              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />

              <button onClick={submit} disabled={!content.trim() && !file} className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 rounded-xl disabled:opacity-40">
                Publicar
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
