// components/PostModal.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { X, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PostModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { text: string; media: File | null }) => void;
}

export default function PostModal({ open, onClose, onSubmit }: PostModalProps) {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (!file) return setPreview(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    if (!open) {
      setText("");
      setFile(null);
      setPreview(null);
    }
  }, [open]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="bg-white dark:bg-[#15283a] rounded-2xl shadow-xl w-full max-w-md p-5 relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:opacity-70"
          >
            <X size={22} />
          </button>

          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
            Criar publicação
          </h2>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escreva algo sobre seu pet..."
            className="w-full min-h-[110px] bg-gray-50 dark:bg-[#0f1c2b] text-gray-700 dark:text-gray-200 rounded-xl p-3 outline-none border border-gray-200 dark:border-gray-700"
          />

          {preview && (
            <div className="relative mt-3">
              <img
                src={preview}
                alt="preview"
                className="w-full h-52 object-cover rounded-xl"
              />
              <button
                onClick={() => setFile(null)}
                className="absolute top-3 right-3 bg-black/60 text-white rounded-full p-2"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <label className="flex items-center gap-2 mt-4 cursor-pointer bg-gray-100 dark:bg-[#0f1c2b] border border-gray-300 dark:border-gray-700 rounded-xl p-3 hover:bg-gray-200 dark:hover:bg-[#1b2c49] transition">
            <ImageIcon size={20} />
            <span>Adicionar foto ou vídeo</span>
            <input
              ref={fileRef}
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>

          <button
            onClick={() => {
              onSubmit({ text, media: file });
              onClose();
            }}
            className="mt-5 w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold transition"
          >
            Publicar
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
