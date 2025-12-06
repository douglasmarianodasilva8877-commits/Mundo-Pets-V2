import { db } from "@/lib/db/client";
import { tutors } from "@/lib/db/schema/tutors";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";

async function seed() {
  const id = uuid();
  const passwordHash = await bcrypt.hash("123456", 10);
  await db.insert(tutors).values({
    id,
    name: "Douglas Test",
    email: "douglas@test.com",
    password_hash: passwordHash,
  });
  console.log("Seeded user:", id);
}

seed().catch(console.error).finally(() => process.exit());
