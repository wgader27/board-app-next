import { Header } from '~/src/components/Header'
import './globals.css'
import { Outfit } from '@next/font/google';

const outfit = Outfit({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />

      
      <body className={`min-h-screen bg-gradient-to-br from-slate-900 via-[#0f172a] to-blue-900 animate-gradient-x text-slate-200 selection:bg-blue-500 selection:text-white ${outfit.className}`}>
        <Header />
        <main className='max-w-6xl mx-auto p-4 md:p-8 relative z-10'>
          {children}
        </main>
      </body>
    </html>
  )
}
