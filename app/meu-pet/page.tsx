"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function MeuPetPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pet, setPet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    async function loadPet() {
      try {
        if (!session?.user?.email) return;
        const res = await fetch(`/api/pets/by-email?email=${session.user.email}`);
        const data = await res.json();

        if (!data.success) {
          setError("Nenhum pet cadastrado ainda. Cadastre o seu primeiro pet!");
          setLoading(false);
          return;
        }

        setPet(data.pet);
      } catch (err) {
        setError("Erro ao carregar informações do pet.");
      } finally {
        setLoading(false);
      }
    }

    if (session?.user?.email) {
      loadPet();
    }
  }, [session]);

  if (loading) return <div className="p-8 text-center text-gray-600">🐾 Carregando...</div>;
  if (error)
    return (
      <div className="p-8 text-center">
        <p className="text-gray-700">{error}</p>
        <button
          onClick={() => router.push("/criar-pet")}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Cadastrar Pet
        </button>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Cabeçalho do Pet */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-pink-400 shadow-lg">
          {pet?.avatarUrl ? (
            <Image
              src={pet.avatarUrl}
              alt={pet.name}
              width={128}
              height={128}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
              🐾
            </div>
          )}
        </div>

        <h1 className="text-2xl font-bold mt-4">{pet?.name}</h1>
        <p className="text-gray-600 italic">{pet?.species}</p>
        {pet?.bio && <p className="text-gray-700 mt-2 text-center">{pet.bio}</p>}

        <button
          onClick={() => router.push("/editar-pet")}
          className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          ✏️ Editar Perfil
        </button>
      </div>

      {/* Posts do Pet */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Postagens do {pet?.name}</h2>
        {pet?.posts && pet.posts.length > 0 ? (
          <div className="flex flex-col gap-4">
            {pet.posts.map((post: any) => (
              <div
                key={post.id}
                className="border rounded-lg p-4 shadow-sm bg-white"
              >
                <p className="text-gray-800">{post.content}</p>
                {post.imageUrl && (
                  <Image
                    src={post.imageUrl}
                    alt="Imagem do post"
                    width={400}
                    height={300}
                    className="rounded-lg mt-2"
                  />
                )}
                <p className="text-sm text-gray-500 mt-1">
                  ❤️ {post.likes} curtidas
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Ainda não há postagens desse pet.</p>
        )}
      </div>
    </div>
  );
}
