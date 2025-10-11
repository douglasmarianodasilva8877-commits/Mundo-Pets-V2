import { prisma } from '@/lib/prisma'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const body = await (new Promise((r)=>{ let d=''; req.on('data',c=>d+=c); req.on('end',()=>r(JSON.parse(d))) }))
    const { content } = body
    const post = await prisma.post.create({ data: { authorId: 'system', content } })
    return res.status(201).json(post)
  }
  res.status(405).end()
}
