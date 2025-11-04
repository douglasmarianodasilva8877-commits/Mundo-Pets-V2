"use client";
import React from "react";
import PostCard from "./PostCard";

const SAMPLE = [
  {
    id: "1",
    petName: "thor_pet",
    petAvatar: "/dog1.jpg", // 🔹 era petImage
    tutorAvatar: "/tutor1.jpg", // 🔹 era tutorImage
    content: "Brincando no parque 🐕💨",
    image: "/post1.jpg",
    createdAt: "2h",
  },
  {
    id: "2",
    petName: "mia_cat",
    petAvatar: "/cat1.jpg", // 🔹 era petImage
    tutorAvatar: "/tutor2.jpg", // 🔹 era tutorImage
    content: "Hora do soninho 😴🐾",
    image: "/post2.jpg",
    createdAt: "3h",
  },
];

export default function Feed() {
  return (
    <div className="col-span-12 md:col-span-6 lg:col-span-6 space-y-5">
      {/* Composer */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <textarea
          className="w-full bg-transparent border border-gray-200 p-3 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="No que seu pet está pensando?"
          rows={3}
        />
        <div className="flex justify-end mt-3">
          <button className="px-4 py-2 rounded-full bg-blue-500 text-white font-semibold hover:bg-blue-600 transition">
            Publicar
          </button>
        </div>
      </div>

      {/* Posts */}
      {SAMPLE.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
