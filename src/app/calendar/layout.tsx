import Header from '@/components/Header'
import { Suspense } from 'react'

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="grow">
        <Suspense>{children}</Suspense>
      </main>
    </div>
  )
}
