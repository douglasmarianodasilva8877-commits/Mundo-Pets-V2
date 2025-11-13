"use client";
import React, { useEffect, useState } from "react";
import AdCard from "@/components/AdCard";

interface Ad {
  id: string;
  partnerName: string;
  type: "banner" | "produto" | "video";
  title: string;
  description?: string;
  mediaUrl: string;
  targetUrl: string;
}

export default function AnunciosPage() {
  const [ads, setAds] = useState<{ banners: Ad[]; produtos: Ad[]; videos: Ad[] }>({
    banners: [],
    produtos: [],
    videos: [],
  });

  useEffect(() => {
    fetch("/api/ads")
      .then((res) => res.json())
      .then((data) => setAds(data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Anunciantes do Mundo Pets 🐾</h1>

        {/* 🔹 Banners */}
        {ads.banners.length > 0 && (
          <>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Banners em destaque</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {ads.banners.map((ad) => (
                <AdCard key={ad.id} ad={ad} />
              ))}
            </div>
          </>
        )}

        {/* 🔹 Produtos */}
        {ads.produtos.length > 0 && (
          <>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Produtos em destaque</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {ads.produtos.map((ad) => (
                <AdCard key={ad.id} ad={ad} />
              ))}
            </div>
          </>
        )}

        {/* 🔹 Vídeos */}
        {ads.videos.length > 0 && (
          <>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Vídeos e campanhas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ads.videos.map((ad) => (
                <AdCard key={ad.id} ad={ad} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
