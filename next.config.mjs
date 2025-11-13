// next.config.mjs
import { fileURLToPath } from "url";
import path from "path";

/** @type {import('next').NextConfig} */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  images: {
    // ✅ Permite imagens externas conhecidas e locais da pasta /public
    unoptimized: false,
    remotePatterns: [
      { protocol: "https", hostname: "placebear.com" },
      { protocol: "https", hostname: "placekitten.com" },
      { protocol: "https", hostname: "dummyimage.com" },
      // 🔹 (Opcional) Adicione seu domínio caso use Supabase, Vercel Blob ou outro CDN
      // { protocol: "https", hostname: "your-storage-domain.supabase.co" },
      // { protocol: "https", hostname: "blob.vercel-storage.com" },
    ],
    // ✅ Permite SVG e imagens locais seguras
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  webpack: (config, { isServer }) => {
    // ✅ Evita loop infinito com o pacote compartilhado "shared"
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@shared": path.resolve(__dirname, "shared/src"),
    };

    config.module.rules.push({
      test: /shared[\\/](src[\\/])?utils\.ts$/,
      use: "null-loader",
    });

    config.ignoreWarnings = [
      { message: /shared\/src\/utils/ },
      { module: /shared\/src\/utils/ },
    ];

    return config;
  },
};

export default nextConfig;
