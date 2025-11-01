"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ProfilePage() {
  const { id } = useParams();
  const [tutor, setTutor] = useState<any>(null);
  const [pets, setPets] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/tutors/${id}`)
      .then((res) => res.json())
      .then((data) => setTutor(data));

    fetch(`/api/pets?ownerId=${id}`)
      .then((res) => res.json())
      .then((data) => setPets(data));
  }, [id]);

  return (
    <div className="flex flex-col gap-4 p-4">
      {tutor && (
        <div className="flex items-center gap-3">
          <img
            src={tutor.avatarUrl || "/placeholder-avatar.png"}
            alt={tutor.name}
            className="w-16 h-16 rounded-full border"
          />
          <div>
            <h1 className="font-semibold text-lg">{tutor.name}</h1>
            <p className="text-gray-500 text-sm">{tutor.city || "Cidade não informada"}</p>
          </div>
        </div>
      )}

      <h2 className="font-semibold text-md mt-4">🐾 Pets</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {pets.map((pet) => (
          <div key={pet.id} className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm">
            <img src={pet.avatarUrl} alt={pet.name} className="rounded-lg w-full h-32 object-cover" />
            <h3 className="font-semibold mt-2">{pet.name}</h3>
            <p className="text-xs text-gray-500">{pet.breed}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
