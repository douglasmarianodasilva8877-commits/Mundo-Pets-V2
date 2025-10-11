import './globals.css'
import { ThemeProvider } from 'next-themes'
import Navbar from '@/components/Navbar'

export const metadata = { title: 'Mundo Pets', description: 'Rede social para pets' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='pt-BR' suppressHydrationWarning>
      <body>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <Navbar />
          <main className='max-w-3xl mx-auto px-4 py-6'>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
