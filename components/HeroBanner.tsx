// components/HeroBanner.tsx
import Image from "next/image";
import React from "react";

export default function HeroBanner() {
  return (
    <section className="hero">
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-6">
        <div className="brand-wrap">
          <div className="brand-logo">
            {/* Coloque /public/logo-mundo-pets.png */}
            <Image src="/logo-mundo-pets.png" alt="Mundo Pets" width={60} height={60} />
          </div>
        </div>

        <div className="flex-1">
          <h2 className="hero-title neon-cyan">
            Mundo <span className="neon-orange">Pets</span>
          </h2>
          <p className="hero-sub">
            Comunidade de pets — compartilhe momentos, encontre amigos e descubra dicas.
          </p>

          <div className="mt-4 flex gap-3">
            <button className="btn btn-brand">Criar post</button>
            <button className="btn border border-white/5 text-white/80">Ver feed</button>
          </div>
        </div>

        <div className="hidden md:block w-56 h-36 relative">
          <Image src="/hero-dogs.png" alt="pets" fill style={{ objectFit: 'cover' }} />
        </div>
      </div>
    </section>
  );
}
