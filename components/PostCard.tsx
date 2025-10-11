'use client'
import React from 'react'

export default function PostCard({ post }: { post: any }) {
  return (
    <article className='rounded-2xl border p-4'>
      <header className='font-semibold'>{post.authorId}</header>
      <div className='text-sm text-muted-foreground'>{post.content}</div>
    </article>
  )
}
