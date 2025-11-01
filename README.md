# Mundo Pets v2 - Arquitetura Completa (Scaffold)

Este scaffold contém:
- Next.js app (App Router)
- Prisma schema + seed
- NextAuth integration (files present) - configure providers in .env.local
- API endpoints: /api/posts, /api/upload (mock)
- Theme toggle and basic components (Composer, PostCard)

## Rodando local
1. cp .env.example .env.local
2. pnpm install
3. pnpm prisma generate
4. pnpm prisma migrate dev --name init
5. pnpm run seed
6. pnpm dev
