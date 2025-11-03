import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "mundo.pets.sjrp@gmail.com";
  const password = "369963";

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: { password: hashedPassword },
    create: {
      name: "Douglas Mariano",
      email,
      password: hashedPassword,
      role: "USER",
    },
  });

  console.log("✅ Usuário criado/atualizado:", user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
