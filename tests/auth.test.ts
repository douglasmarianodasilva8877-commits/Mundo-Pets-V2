// tests/auth.test.ts
import { describe, it, expect } from "vitest";

const BASE = "http://localhost:3000";

describe("Auth API", () => {
  const testUser = {
    name: "Douglas Test",
    email: "douglas_test@example.com",
    password: "123456",
  };

  it("should register a tutor", async () => {
    const res = await fetch(`${BASE}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testUser),
    });

    const data = await res.json();
    console.log("REGISTER:", data);

    expect(data.success).toBe(true);
    expect(data.user).toBeDefined();
    expect(data.user.email).toBe(testUser.email);
  });

  it("should login a tutor", async () => {
    const res = await fetch(`${BASE}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
    });

    const data = await res.json();
    console.log("LOGIN:", data);

    expect(data.success).toBe(true);
    expect(data.token).toBeDefined();
    expect(typeof data.token).toBe("string");
  });
});
