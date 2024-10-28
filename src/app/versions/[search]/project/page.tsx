import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Dependency } from '@/constants/types'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { ProjectVersionsTable } from '@/components/project-versions-table'

export default async function VersionsPage(props: {
  params: Promise<{ search: string }>
}) {
  const params = await props.params

  const { search } = params

  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)

  const { data, error } = await supabase
    .from('versions')
    .select('*')
    .ilike('key', `%${search}%`)

  if (error) {
    return <div>Error: {error.message}</div>
  }
  const dependencies: Dependency[] = data || []

  return (
    <div className="container mx-auto p-6">
      <div className="relative mb-4">
        <div className="absolute left-0 top-1/2 -translate-y-1/2">
          <Link href={`/versions`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Versions
            </Button>
          </Link>
        </div>
        <h2 className="text-center text-2xl font-bold uppercase">{search}</h2>
      </div>
      <ProjectVersionsTable data={dependencies} tech={search} />
    </div>
  )
}
