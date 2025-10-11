'use client'
import { useTheme } from 'next-themes'
export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const isDark = (theme ?? resolvedTheme) === 'dark'
  return (
    <button onClick={() => setTheme(isDark ? 'light' : 'dark')} className='rounded px-3 py-1.5 border'>
      {isDark ? 'Claro' : 'Escuro'}
    </button>
  )
}
