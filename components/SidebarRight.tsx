"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface AdItem {
  id: string;
  partnerName: string;
  type: "banner" | "produto" | "video";
  title: string;
  description: string;
  mediaUrl: string;
  targetUrl: string;
  approved: boolean;
  createdAt: string;
}

export default function SidebarRight() {
  const [ads, setAds] = useState<AdItem[]>([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [currentProduct, setCurrentProduct] = useState(0);

  useEffect(() => {
    fetch("/data/ads.json")
      .then((res) => res.json())
      .then((data) => setAds(data.filter((ad: AdItem) => ad.approved)))
      .catch((err) => console.error("Erro ao carregar anúncios:", err));
  }, []);

  // 🔄 Rotação automática
  useEffect(() => {
    const bannerTimer = setInterval(() => {
      setCurrentBanner(
        (prev) =>
          (prev + 1) % (ads.filter((a) => a.type === "banner").length || 1)
      );
    }, 5000);

    const productTimer = setInterval(() => {
      setCurrentProduct(
        (prev) =>
          (prev + 1) % (ads.filter((a) => a.type === "produto").length || 1)
      );
    }, 7000);

    return () => {
      clearInterval(bannerTimer);
      clearInterval(productTimer);
    };
  }, [ads]);

  const banners = ads.filter((ad) => ad.type === "banner");
  const produtos = ads.filter((ad) => ad.type === "produto");
  const videos = ads.filter((ad) => ad.type === "video");

  // 🔹 Padrão fixo para todas as mídias (mantém harmonia visual)
  const mediaContainerStyle = `
    w-full 
    aspect-[3/2] 
    bg-gray-100 dark:bg-gray-800 
    flex justify-center items-center 
    overflow-hidden 
    rounded-md
  `;

  const mediaStyle = `
    w-full 
    h-full 
    object-cover 
    transition-all 
    duration-300
  `;

  return (
    <aside
      className="
        hidden lg:block
        w-72
        sticky top-[var(--navbar-height)]
        ml-8
      "
    >
      {/* Conteúdo interno com scroll independente */}
      <div
        className="
          overflow-y-auto
          custom-scroll
          scroll-smooth
          max-h-[calc(100vh-var(--navbar-height))]
          pr-2
          pb-4
        "
      >
        {/* 1️⃣ Banner rotativo */}
        {banners.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 flex flex-col items-center p-3 text-center relative">
            <Link
              href={banners[currentBanner].targetUrl}
              target="_blank"
              className="flex justify-center items-center w-full"
            >
              <div className={mediaContainerStyle}>
                <img
                  src={banners[currentBanner].mediaUrl}
                  alt={banners[currentBanner].title}
                  className={mediaStyle}
                  loading="lazy"
                />
              </div>
            </Link>
            <div className="mt-2">
              <h3 className="font-semibold text-sm text-gray-800">
                {banners[currentBanner].title}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {banners[currentBanner].description}
              </p>
            </div>
            <div className="absolute bottom-2 right-2 flex gap-1">
              {banners.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i === currentBanner ? "bg-teal-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* 2️⃣ Carrossel de produtos */}
        {produtos.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 flex flex-col items-center p-3 text-center relative">
            <Link
              href={produtos[currentProduct].targetUrl}
              target="_blank"
              className="flex justify-center items-center w-full"
            >
              <div className={mediaContainerStyle}>
                {produtos[currentProduct].mediaUrl.endsWith(".mp4") ? (
                  <video
                    src={produtos[currentProduct].mediaUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className={mediaStyle}
                  />
                ) : (
                  <img
                    src={produtos[currentProduct].mediaUrl}
                    alt={produtos[currentProduct].title}
                    className={mediaStyle}
                    loading="lazy"
                  />
                )}
              </div>
            </Link>
            <div className="mt-3">
              <h3 className="font-semibold text-sm text-gray-800">
                {produtos[currentProduct].title}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {produtos[currentProduct].description}
              </p>
            </div>
          </div>
        )}

        {/* 3️⃣ Vídeos parceiros */}
        {videos.length > 0 &&
          videos.map((video) => (
            <div
              key={video.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 flex flex-col items-center text-center"
            >
              <div className="relative w-full aspect-[3/2] bg-black rounded-t-xl overflow-hidden flex justify-center items-center">
                <video
                  src={video.mediaUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className={mediaStyle}
                />
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm text-gray-800">
                  {video.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {video.description}
                </p>
                <Link
                  href={video.targetUrl}
                  target="_blank"
                  className="text-xs font-semibold text-teal-600 hover:underline"
                >
                  Saiba mais
                </Link>
              </div>
            </div>
          ))}
      </div>
    </aside>
  );
}
