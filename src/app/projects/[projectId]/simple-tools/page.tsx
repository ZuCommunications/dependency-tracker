import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Dependency } from '@/constants/types'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { SimpleProjectToolsTable } from '@/components/simple-project-tools-table'

export default async function FuturePage(props: {
  params: Promise<{ projectId: string }>
}) {
  const params = await props.params

  const { projectId } = params

  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)

  const { data, error } = await supabase
    .from('versions')
    .select('*')
    .eq('id', projectId)
    .eq('environment', 'PROD')
    .ilike('key', '%VERSION%')
    .order('key', { ascending: true })

  if (error) {
    return <div>Error: {error.message}</div>
  }

  const dependencies: Dependency[] = data || []

  return (
    <div className="container mx-auto p-6">
      <div className="relative mb-4">
        <div className="absolute left-0 top-1/2 -translate-y-1/2">
          <Link prefetch={true} href={`/projects/${projectId}/tools`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Detailed View
            </Button>
          </Link>
        </div>
        <h2 className="text-center text-2xl font-bold">{projectId}</h2>
      </div>
      <SimpleProjectToolsTable data={dependencies} />
    </div>
  )
}
