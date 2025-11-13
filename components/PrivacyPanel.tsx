"use client";

import React, { useState, useEffect } from "react";
import { Shield, Save } from "lucide-react";

/**
 * ===============================================
 * 🌎 Mundo Pets — Painel de Privacidade do Usuário
 * ===============================================
 * Permite ao tutor gerenciar o que é público e o que pode
 * ser usado para entregas, contatos e pagamentos.
 */

export default function PrivacyPanel() {
  const [loading, setLoading] = useState(false);
  const [privacy, setPrivacy] = useState({
    showPhone: false,
    showAddress: false,
    showBirthDate: false,
    allowCommerceUse: true,
    allowContactUse: true,
  });

  // 🔹 Buscar configurações salvas
  useEffect(() => {
    const fetchPrivacy = async () => {
      try {
        const res = await fetch("/api/user/me");
        if (res.ok) {
          const data = await res.json();
          if (data?.user?.privacy) {
            setPrivacy((prev) => ({ ...prev, ...data.user.privacy }));
          }
        }
      } catch (err) {
        console.warn("Não foi possível carregar preferências de privacidade.");
      }
    };
    fetchPrivacy();
  }, []);

  // 🔹 Alternar opção
  const handleChange = (key: string) => {
    setPrivacy((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  // 🔹 Salvar alterações
  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/privacy/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(privacy),
      });

      if (!res.ok) throw new Error("Erro ao salvar");

      const data = await res.json();
      alert("✅ " + data.message);
    } catch {
      alert("❌ Erro ao atualizar preferências.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full max-w-2xl mx-auto bg-white dark:bg-[#0d1a27] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md p-6 mt-6">
      <header className="flex items-center gap-3 mb-5">
        <Shield className="w-6 h-6 text-teal-600 dark:text-teal-400" />
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Preferências de Privacidade
        </h2>
      </header>

      <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
        Aqui você controla quais informações pessoais podem ser exibidas ou
        compartilhadas quando necessário. Seus dados só serão usados
        <strong> com seu consentimento</strong>, conforme as finalidades abaixo:
      </p>

      <ul className="space-y-4">
        {[
          {
            key: "showPhone",
            label: "Exibir telefone publicamente",
            desc: "Permite que outros tutores vejam seu número em postagens e perfil.",
          },
          {
            key: "showAddress",
            label: "Exibir endereço publicamente",
            desc: "Seu endereço completo será mostrado apenas em contextos de entrega, se permitido.",
          },
          {
            key: "showBirthDate",
            label: "Exibir data de nascimento",
            desc: "Usada apenas para fins de perfil e reconhecimento pessoal.",
          },
          {
            key: "allowCommerceUse",
            label: "Permitir uso em pagamentos e entregas",
            desc: "Autoriza compartilhar CPF, endereço e contato com empresas envolvidas em compras.",
          },
          {
            key: "allowContactUse",
            label: "Permitir contato direto via telefone/e-mail",
            desc: "Permite que empresas ou parceiros entrem em contato para confirmar entregas e serviços.",
          },
        ].map(({ key, label, desc }) => (
          <li
            key={key}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50 dark:bg-[#0b1a27] border border-gray-200 dark:border-gray-700 rounded-lg p-4 transition hover:shadow-sm"
          >
            <div>
              <label
                htmlFor={key}
                className="font-medium text-gray-800 dark:text-gray-100"
              >
                {label}
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {desc}
              </p>
            </div>

            <div className="mt-3 sm:mt-0">
              <input
                id={key}
                type="checkbox"
                checked={privacy[key as keyof typeof privacy]}
                onChange={() => handleChange(key)}
                className="w-5 h-5 accent-teal-500 cursor-pointer"
              />
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-white font-semibold shadow-sm transition ${
            loading
              ? "bg-teal-400 cursor-not-allowed"
              : "bg-teal-600 hover:bg-teal-700"
          }`}
        >
          <Save className="w-4 h-4" />
          {loading ? "Salvando..." : "Salvar Preferências"}
        </button>
      </div>
    </section>
  );
}
