"use client";
import Image from "next/image";

export default function StoriesCarousel() {
  const items = [
    { id: 1, img: "/story1.jpg", user: "Luna" },
    { id: 2, img: "/story2.jpg", user: "Zeus" },
    { id: 3, img: "/story3.jpg", user: "Nina" },
  ];

  return (
    <div className="flex gap-3 overflow-x-auto py-2">
      {items.map((story) => (
        <div
          key={story.id}
          className="min-w-[100px] h-[170px] card-modern float-soft relative cursor-pointer"
        >
          <Image
            src={story.img}
            alt={story.user}
            fill
            className="object-cover rounded-2xl"
          />
          <div className="absolute bottom-2 left-2 text-white font-semibold drop-shadow-lg">
            {story.user}
          </div>
        </div>
      ))}
    </div>
  );
}
