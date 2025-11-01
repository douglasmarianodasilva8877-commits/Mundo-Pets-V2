"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [tutor, setTutor] = useState({
    nome: "",
    email: "",
    senha: "",
    avatar: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("tutor", JSON.stringify(tutor));
    router.push("/onboarding");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#0b1a27]">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-md w-96 space-y-4"
      >
        <h2 className="text-xl font-bold text-center text-gray-800 dark:text-gray-100">
          Cadastro do Tutor 👤
        </h2>

        <input
          type="text"
          placeholder="Nome completo"
          className="input"
          value={tutor.nome}
          onChange={(e) => setTutor({ ...tutor, nome: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="E-mail"
          className="input"
          value={tutor.email}
          onChange={(e) => setTutor({ ...tutor, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          className="input"
          value={tutor.senha}
          onChange={(e) => setTutor({ ...tutor, senha: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="URL da foto do tutor"
          className="input"
          value={tutor.avatar}
          onChange={(e) => setTutor({ ...tutor, avatar: e.target.value })}
        />

        <button
          type="submit"
          className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-lg font-semibold"
        >
          Continuar ➜
        </button>
      </form>
    </div>
  );
}
