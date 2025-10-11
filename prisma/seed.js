const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const u = await prisma.user.create({ data: { email: 'douglas@example.com', username: 'douglas', name: 'Douglas' } })
  await prisma.post.createMany({ data: [
    { authorId: u.id, content: 'Bem-vindos ao Mundo Pets!' },
    { authorId: u.id, content: 'Primeiro post - adopte um amigo' }
  ] })
  console.log('Seed completo')
}
main().catch(e=>{ console.error(e); process.exit(1) }).finally(()=>prisma.$disconnect())
