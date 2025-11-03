export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";

export default async function PetsPage() {
  const pets = await prisma.pet.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white dark:bg-[#0d1a27] rounded-xl shadow">
      <h1 className="text-2xl font-semibold text-teal-600 mb-6">🐾 Pets Cadastrados</h1>

      {pets.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400 text-center">
          Nenhum pet cadastrado ainda.
        </p>
      ) : (
        <ul className="grid gap-4">
          {pets.map((pet) => (
            <li
              key={pet.id}
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center gap-4"
            >
              {pet.avatarUrl ? (
                <img
                  src={pet.avatarUrl}
                  alt={pet.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-700" />
              )}
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                  {pet.name}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {pet.species}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
