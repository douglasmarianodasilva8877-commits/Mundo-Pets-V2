"use client";
import React from "react";
import Link from "next/link";

interface Ad {
  id: string;
  partnerName: string;
  type: string;
  title: string;
  description?: string;
  mediaUrl: string;
  targetUrl: string;
}

export default function AdCard({ ad }: { ad: Ad }) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
      <a href={ad.targetUrl} target="_blank" rel="noopener noreferrer">
        <img
          src={ad.mediaUrl}
          alt={ad.title}
          className="w-full h-40 object-cover"
        />
      </a>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-sm">{ad.title}</h3>
        <p className="text-xs text-gray-500 mt-1">{ad.description}</p>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="font-semibold text-teal-600">{ad.partnerName}</span>
          <Link
            href={ad.targetUrl}
            target="_blank"
            className="text-teal-600 hover:underline"
          >
            Ver mais
          </Link>
        </div>
      </div>
    </div>
  );
}
