import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/options";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: "Não autorizado" }), { status: 401 });
  }

  const data = await req.json();

  const pet = await prisma.pet.create({
    data: {
      name: data.name,
      species: data.species,
      slug: data.slug,
      breed: data.breed,
      age: data.age,
      bio: data.bio,
      avatarUrl: data.avatarUrl,
      owner: { connect: { email: session.user.email } },
    },
  });

  return new Response(JSON.stringify(pet), { status: 201 });
}
