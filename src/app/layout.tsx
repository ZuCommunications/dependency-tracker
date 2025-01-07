import ReactQueryProvider from '@/providers/ReactQueryProvider'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { GeistSans } from 'geist/font/sans'
import PlausibleProvider from 'next-plausible'
import NextTopLoader from 'nextjs-toploader'
import './globals.css'

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Dependency Tracker',
  description: 'Track your dependencies across all of your projects',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.className} dark`}
      style={{ colorScheme: 'dark' }}
    >
      <head>
        <PlausibleProvider
          domain="dependency-tracker.netlify.app"
          customDomain="https://plausible.zu.ca"
          selfHosted={true}
        />
      </head>
      <body className="overscroll-y-none bg-background text-foreground">
        <NextTopLoader showSpinner={false} height={2} color="#2acf80" />
        <ReactQueryProvider>
          <main className="flex min-h-screen flex-col items-center">
            {children}
          </main>
          <ReactQueryDevtools initialIsOpen={false} />
        </ReactQueryProvider>
      </body>
    </html>
  )
}
