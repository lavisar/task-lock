import { ThemeProvider } from '@/components/providers/theme-provider'
import { siteConfig } from '@/config/site'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}` // site name | TaskLock
  },
  description: `${siteConfig.description}`,
  icons: [
    {
      url: '/logo.svg',
      href: '/logo.svg'
    }
  ]
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={`${inter.className} dark:bg-bgDarkMode dark:text-textDarkMode`}>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
