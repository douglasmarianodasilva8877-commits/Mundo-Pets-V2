// components/AdminAdRow.tsx
"use client";

import React, { useState } from "react";

export default function AdminAdRow({ ad, onUpdated }: { ad: any; onUpdated?: () => void }) {
  const [loading, setLoading] = useState(false);

  const toggleApprove = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/ads/${ad.id}`, {
        method: "PATCH",
        body: JSON.stringify({ approved: !ad.approved }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        onUpdated?.();
      } else {
        console.error("Falha ao atualizar");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Remover anúncio?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/ads/${ad.id}`, { method: "DELETE" });
      if (res.ok) onUpdated?.();
      else console.error("Falha ao deletar");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#0f1724] rounded-lg p-3 shadow-sm border border-gray-100 flex gap-3 items-start">
      <img src={ad.mediaUrl} alt={ad.title} className="w-20 h-20 object-cover rounded-md" />
      <div className="flex-1">
        <div className="flex justify-between items-start gap-3">
          <div>
            <div className="text-sm font-semibold">{ad.title}</div>
            <div className="text-xs text-gray-500">{ad.partnerName} • {ad.type}</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleApprove}
              className={`px-3 py-1 text-xs rounded-md transition ${
                ad.approved ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-700"
              }`}
              disabled={loading}
            >
              {ad.approved ? "Aprovado" : "Aprovar"}
            </button>
            <button
              onClick={handleDelete}
              className="px-2 py-1 text-xs rounded-md bg-red-50 text-red-700"
              disabled={loading}
            >
              Remover
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-2 line-clamp-2">{ad.description}</p>
        <div className="text-[11px] text-gray-400 mt-2">Criado: {new Date(ad.createdAt).toLocaleString()}</div>
      </div>
    </div>
  );
}
