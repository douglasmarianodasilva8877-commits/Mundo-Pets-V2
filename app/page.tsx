import Composer from '@/components/Composer'
import PostCard from '@/components/PostCard'
import { prisma } from '@/lib/prisma'

export default async function Feed() {
  const posts = await prisma.post.findMany({ take: 5, orderBy: { createdAt: 'desc' } }).catch(()=>[])
  return (
    <section className='space-y-4'>
      <Composer />
      {posts.length === 0 ? <div className='text-sm text-muted-foreground'>Nenhum post - rode `pnpm run seed`</div> : posts.map(p => <PostCard key={p.id} post={p} />)}
    </section>
  )
}
