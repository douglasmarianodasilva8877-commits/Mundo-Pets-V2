// app/api/posts/route.ts
import { NextResponse } from "next/server";

let posts: any[] = [
  {
    id: "1",
    author: "Douglas 🐕",
    avatar: "/avatar-sample.jpg",
    content: "Bem-vindos ao Mundo Pets 🐾",
    image: "/dog1.jpg",
    createdAt: "há 2h",
    likes: 120,
    comments: 14,
  },
  {
    id: "2",
    author: "Sandra Bullock 🐈",
    avatar: "/avatar-sample1.jpg",
    content: "Meu gato aceitou o novo brinquedo 😻",
    image: "/cat1.jpg",
    createdAt: "há 1h",
    likes: 64,
    comments: 6,
  },
];

export async function GET() {
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const body = await req.json();
  const newPost = { id: Date.now().toString(), createdAt: "agora mesmo", likes: 0, comments: 0, ...body };
  posts.unshift(newPost);
  return NextResponse.json({ success: true, data: newPost });
}
