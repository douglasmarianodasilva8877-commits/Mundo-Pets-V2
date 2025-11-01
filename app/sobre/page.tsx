"use client";

import Image from "next/image";
import React from "react";
import { Mail, Phone } from "lucide-react";
import Link from "next/link";

export default function SobrePage() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#0d1a27] text-gray-800 dark:text-gray-100 pt-24">
      
      {/* 💼 Seção: Convite a investidores (AGORA É A PRIMEIRA) */}
      <section className="bg-gradient-to-r from-teal-600 to-cyan-500 text-white py-20 text-center px-6 shadow-md">
        <h2 className="text-4xl font-bold mb-4">Convite aos Investidores</h2>
        <p className="max-w-3xl mx-auto text-lg leading-relaxed">
          O <strong>Mundo Pets</strong> está em fase inicial de validação e testes.  
          Nosso propósito é unir pessoas que acreditam em inovação, propósito e impacto.  
          Buscamos <strong>investidores visionários</strong> que enxerguem o valor de transformar o cuidado com os animais em uma experiência digital, afetiva e escalável.
        </p>
        <p className="mt-6 text-lg font-medium">
          💬 Entre em contato e conheça as possibilidades de investimento e parceria.
        </p>
      </section>

      {/* 🌐 Seção: Sobre o Projeto */}
      <section className="text-center mb-12 px-4 mt-16">
        <div className="flex justify-center mb-6">
          <Image
            src="/mundo-pets-logo.jpg"
            alt="Logo Mundo Pets"
            width={280}
            height={280}
            className="drop-shadow-lg"
          />
        </div>
        <h1 className="text-4xl font-bold text-teal-500">Sobre o Projeto</h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          O <strong>Mundo Pets</strong> nasceu do amor pelos animais e da visão de criar uma
          rede que conecta pessoas, tecnologia e cuidado — um ecossistema digital onde cada pet
          tem voz, presença e história.
        </p>
      </section>

      {/* 🧠 Seção: Criador */}
      <section className="flex flex-col md:flex-row items-center justify-center gap-8 px-6 py-10 bg-gray-50 dark:bg-[#0b1622] border-y border-gray-200 dark:border-gray-700">
        <Image
          src="/douglas-mariano.jpg"
          alt="Douglas Mariano da Silva"
          width={300}
          height={300}
          className="rounded-xl object-cover shadow-lg border-4 border-teal-500"
        />
        <div className="max-w-xl text-center md:text-left">
          <h2 className="text-2xl font-semibold text-teal-400">Douglas Mariano da Silva</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Criador e Idealizador do Mundo Pets. Visionário, apaixonado por inovação e
            tecnologia, Douglas une propósito e futuro para transformar a forma como tutores
            e amantes dos animais se conectam no ambiente digital.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center md:justify-start">
            <Link
              href="tel:+5517996809397"
              className="flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-full hover:bg-teal-600 transition"
            >
              <Phone size={18} /> (17) 99680-9397
            </Link>
            <Link
              href="mailto:mundo.pets.sjrp@gmail.com"
              className="flex items-center gap-2 border border-teal-500 text-teal-500 px-4 py-2 rounded-full hover:bg-teal-500 hover:text-white transition"
            >
              <Mail size={18} /> mundo.pets.sjrp@gmail.com
            </Link>
          </div>
        </div>
      </section>

      {/* 🌟 Seção: Missão e Visão */}
      <section className="py-16 px-6 text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-semibold text-teal-500 mb-4">Missão & Visão</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Nossa missão é <strong>revolucionar a experiência pet</strong>, criando um ambiente digital
          onde cada tutor pode compartilhar momentos, aprender, interagir e contribuir para uma
          comunidade global dedicada ao bem-estar animal.
        </p>
        <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          A visão do <strong>Mundo Pets</strong> é se tornar a maior rede social pet da América Latina,
          integrando tecnologia de ponta, inteligência artificial e empatia humana para gerar
          impacto social, emocional e econômico.
        </p>
      </section>

      {/* 🐾 Rodapé */}
      <footer className="py-6 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
        <p>
          © {new Date().getFullYear()} <strong>Mundo Pets</strong> — Todos os direitos reservados.
        </p>
        <p className="mt-1">
          Criado por <strong>Douglas Mariano da Silva</strong>
        </p>
      </footer>
    </main>
  );
}
