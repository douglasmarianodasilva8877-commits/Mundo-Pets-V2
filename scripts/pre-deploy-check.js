#!/usr/bin/env node

/**
 * ✅ Pre-deploy Check — Mundo Pets
 * Executa validações automáticas antes do deploy para garantir estabilidade e compatibilidade.
 */

import fs from "fs";
import { execSync } from "child_process";
import path from "path";
import http from "http";

const log = (msg) => console.log(`\x1b[36m${msg}\x1b[0m`);
const error = (msg) => console.error(`\x1b[31m❌ ${msg}\x1b[0m`);
const success = (msg) => console.log(`\x1b[32m✔ ${msg}\x1b[0m`);

(async () => {
  try {
    log("🔍 Iniciando pré-verificação do deploy...");

    // 1️⃣ Verificar .env.local
    const envPath = path.join(process.cwd(), ".env.local");
    if (!fs.existsSync(envPath)) {
      throw new Error("Arquivo .env.local não encontrado!");
    }

    const env = fs.readFileSync(envPath, "utf-8");
    if (!env.includes("NEXT_PUBLIC_BASE_URL")) {
      throw new Error("Variável NEXT_PUBLIC_BASE_URL ausente em .env.local");
    }
    success("Variáveis de ambiente validadas");

    // 2️⃣ Verificar dependências instaladas
    try {
      execSync("npm ls --depth=0", { stdio: "ignore" });
      success("Dependências instaladas corretamente");
    } catch {
      throw new Error("Dependências ausentes. Rode `npm install`.");
    }

    // 3️⃣ Testar build local
    log("🧾 Verificando build...");
    execSync("npm run build", { stdio: "ignore" });
    success("Build passou com sucesso ✅");

    // 4️⃣ Testar páginas essenciais
    const pagesDir = path.join(process.cwd(), "app");
    const requiredPages = ["feed", "sobre", "onboarding"];
    requiredPages.forEach((p) => {
      const pagePath = path.join(pagesDir, p, "page.tsx");
      if (!fs.existsSync(pagePath)) {
        throw new Error(`Página obrigatória ausente: /${p}`);
      }
    });
    success("Páginas principais verificadas");

    // 5️⃣ Verificar APIs principais
    const apiDir = path.join(process.cwd(), "app/api");
    const requiredAPIs = ["pets", "posts", "upload"];
    requiredAPIs.forEach((api) => {
      const route = path.join(apiDir, api, "route.ts");
      if (!fs.existsSync(route)) {
        throw new Error(`Endpoint API ausente: /api/${api}`);
      }
    });
    success("Rotas de API OK");

    // 6️⃣ Checar Vercel CLI
    try {
      execSync("vercel --version", { stdio: "ignore" });
      success("Vercel CLI detectada");
    } catch {
      throw new Error("Vercel CLI não encontrada. Instale com `npm i -g vercel`");
    }

    // 7️⃣ Teste de upload e criação de post fake (rodando local)
    log("🧪 Testando endpoints /api/upload e /api/posts...");
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // simula um POST simples (sem imagem real)
    const uploadRes = await fetch(`${baseUrl}/api/upload`, {
      method: "POST",
      body: (() => {
        const formData = new FormData();
        const blob = new Blob(["fake image content"], { type: "image/jpeg" });
        formData.append("file", blob, "test.jpg");
        return formData;
      })(),
    }).then((r) => r.json()).catch(() => null);

    if (!uploadRes?.url) throw new Error("Falha ao testar upload local (/api/upload).");

    const postRes = await fetch(`${baseUrl}/api/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        author: "Bot de Teste 🧠",
        content: "Post de validação automática",
        image: uploadRes.url,
      }),
    }).then((r) => r.json()).catch(() => null);

    if (!postRes?.data) throw new Error("Falha ao testar criação de post (/api/posts).");
    success("Upload e criação de post testados com sucesso 🎉");

    log("🚀 Tudo pronto! Você pode rodar `npm run deploy` ou `vercel --prod` com segurança.");
  } catch (err) {
    error(err.message);
    process.exit(1);
  }
})();
