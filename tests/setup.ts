import { beforeAll, beforeEach } from "vitest";

beforeAll(() => {
  // Variáveis de ambiente usadas pelos testes
  process.env.JWT_SECRET = "test_secret";
  process.env.NEXT_PUBLIC_BASE_URL = "http://localhost:3000";
});

beforeEach(() => {
  // Mock fetch para evitar chamadas reais
  global.fetch = async (url, options) => {
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  };
});
