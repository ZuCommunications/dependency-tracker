import Header from '@/components/Header'

export default function ActionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="grow">{children}</main>
    </div>
  )
}
