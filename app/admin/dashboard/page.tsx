// app/admin/dashboard/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminAdRow from "@/components/AdminAdRow";

export default function AdminDashboard() {
  const router = useRouter();
  const [allAds, setAllAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAdmin = localStorage.getItem("mundo_is_admin");
    if (!isAdmin) router.push("/admin/login");
  }, [router]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ads");
      const data = await res.json();
      // API returns { banners, produtos, videos, all }
      setAllAds(data.all || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("mundo_is_admin");
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Painel de Anúncios — Admin</h1>
          <div className="flex items-center gap-3">
            <button onClick={load} className="px-3 py-2 bg-gray-100 rounded">Atualizar</button>
            <button onClick={handleLogout} className="px-3 py-2 bg-red-50 text-red-700 rounded">Sair</button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Carregando anúncios...</div>
        ) : allAds.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Nenhum anúncio cadastrado.</div>
        ) : (
          <div className="flex flex-col gap-3">
            {allAds.map((ad) => (
              <AdminAdRow key={ad.id} ad={ad} onUpdated={load} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
