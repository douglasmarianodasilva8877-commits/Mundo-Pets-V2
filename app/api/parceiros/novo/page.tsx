"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function NovoParceiroPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nome: "",
    logo: "",
    descricao: "",
    site: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await fetch("/api/parceiros", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);
    router.push("/parceiros");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-sm mt-10">
      <h1 className="text-xl font-bold mb-4">Cadastrar Novo Parceiro</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-sm font-medium">Nome</label>
          <input
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium">URL da Logo</label>
          <input
            type="text"
            name="logo"
            value={form.logo}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Descrição</label>
          <textarea
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Site</label>
          <input
            type="text"
            name="site"
            value={form.site}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 mt-1"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition"
        >
          {loading ? "Salvando..." : "Cadastrar Parceiro"}
        </button>
      </form>
    </div>
  );
}
