'use client'
import ThemeToggle from './ThemeToggle'
import Link from 'next/link'

export default function Navbar() {
  return (
    <header className='sticky top-0 z-40 border-b bg-white/60 dark:bg-black/20 backdrop-blur'>
      <div className='max-w-3xl mx-auto px-4 h-14 flex items-center justify-between'>
        <Link href='/' className='font-semibold'>
          Mundo <span className='text-[hsl(var(--accent))]'>Pets</span>
        </Link>
        <div className='flex items-center gap-3'>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
