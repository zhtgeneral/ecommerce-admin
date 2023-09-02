// root layout

import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'

import { ModalProvider } from '@/providers/modal-provider'
import { ToastProvider } from '@/providers/toaster-provider'

import './globals.css'
import { ThemeProvider } from '@/providers/theme.provider'

const inter = Inter({ subsets: ['latin'] })


// sets title of page
export const metadata = {
  title: 'Admin dashboard',
  description: 'Manage your store',
}


// auth goes outside of everything 
// layout specifies the location of elements (notice the location of toaster)
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
            <ToastProvider />
            <ModalProvider />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
