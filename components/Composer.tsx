'use client'
import { useState } from 'react'

export default function Composer() {
  const [v, setV] = useState('')
  return (
    <form action={async (formData: FormData) => {
      'use server'
      const content = formData.get('content')?.toString() ?? ''
      await fetch('/api/posts', { method: 'POST', body: JSON.stringify({ content }), headers: { 'Content-Type': 'application/json' } })
    }} className='rounded-2xl border p-3'>
      <textarea name='content' value={v} onChange={(e)=>setV(e.target.value)} placeholder='No que você está pensando sobre seu pet?' className='w-full p-2 bg-transparent' />
      <div className='flex justify-end pt-2'>
        <button type='submit' className='px-3 py-1.5 rounded bg-[hsl(var(--brand))] text-white'>Publicar</button>
      </div>
    </form>
  )
}
