"use client";

import React, { useEffect, useState } from "react";

export default function ExplorePage() {
  const [pets, setPets] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/pets")
      .then((res) => res.json())
      .then((data) => setPets(data));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-lg font-semibold mb-4">Explorar 🐾</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {pets.map((pet) => (
          <div
            key={pet.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:scale-105 transition"
          >
            <img src={pet.avatarUrl} alt={pet.name} className="h-40 w-full object-cover" />
            <div className="p-2">
              <h2 className="font-semibold">{pet.name}</h2>
              <p className="text-sm text-gray-500">{pet.breed}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
