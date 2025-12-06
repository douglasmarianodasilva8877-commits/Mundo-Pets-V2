// tests/pets.test.ts
import { describe, it, expect } from "vitest";

describe("Pets CRUD", () => {
  let slug = "";
  const tutorEmail = "tutor@example.com";

  it("should create a pet", async () => {
    const form = new FormData();
    form.append("name", "Luna");
    form.append("species", "cachorro");
    form.append("tutorEmail", tutorEmail);

    const res = await fetch("http://localhost:3000/api/pets", {
      method: "POST",
      body: form,
    });

    const data = await res.json();
    console.log("CREATE:", data);

    expect(data.success).toBe(true);
    expect(data.pet).toBeDefined();
    expect(data.pet.slug).toBeDefined();

    slug = data.pet.slug; // salva slug para os próximos testes
  });

  it("should edit a pet", async () => {
    const res = await fetch(`http://localhost:3000/api/pets/${slug}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer test_secret_token",
      },
      body: JSON.stringify({
        name: "Luna Atualizada",
        bio: "Agora com mais energia!",
      }),
    });

    const data = await res.json();
    console.log("UPDATE:", data);

    expect(data.success).toBe(true);
    expect(data.pet.name).toBe("Luna Atualizada");
  });

  it("should delete a pet", async () => {
    const res = await fetch(`http://localhost:3000/api/pets/${slug}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer test_secret_token",
      },
    });

    const data = await res.json();
    console.log("DELETE:", data);

    expect(data.success).toBe(true);
  });
});
