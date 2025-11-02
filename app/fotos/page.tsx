"use client";

import React, { useEffect, useState } from "react";
import { Image } from "lucide-react";

export default function FotosPage() {
  const [fotos, setFotos] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("mundo-pets-fotos");
    if (saved) setFotos(JSON.parse(saved));
    else {
      const mock = ["/dog1.jpg", "/dog2.jpg", "/cat1.jpg"];
      setFotos(mock);
      localStorage.setItem("mundo-pets-fotos", JSON.stringify(mock));
    }
  }, []);

  return (
    <section className="max-w-4xl mx-auto p-4 mt-8">
      <h1 className="text-2xl font-bold text-teal-500 mb-6 text-center">
        📸 Galeria de Fotos
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {fotos.map((src, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700"
          >
            <img
              src={src}
              alt={`Foto ${i + 1}`}
              className="w-full h-48 object-cover hover:scale-105 transition"
            />
          </div>
        ))}
      </div>

      {fotos.length === 0 && (
        <div className="text-center text-gray-400 mt-8">
          Nenhuma foto adicionada 😿
        </div>
      )}
    </section>
  );
}
