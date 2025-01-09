import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createServerClient } from '@/utils/supabase'
import { ExternalLink } from 'lucide-react'
import { cookies } from 'next/headers'
import Link from 'next/link'
import EOLDependenciesTable from './EOLDependenciesTable'

async function getDashboardData() {
  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)

  const [{ data: projects }, { data: tools }, { data: versions }] =
    await Promise.all([
      supabase.from('versions').select('id'),
      supabase.from('versions').select('key'),
      supabase.from('versions').select('*'),
    ])

  const uniqueProjects = new Set(projects?.map((p) => p.id))
  const projectCount = uniqueProjects.size

  const uniqueTools = new Set(
    tools
      ?.filter((t) => t.key.toLowerCase().includes('version'))
      .map((t) => t.key),
  )
  const uniqueToolsCount = uniqueTools.size

  return {
    projectCount,
    uniqueToolsCount,
    versions: versions ?? [],
  }
}

export default async function DashboardPage() {
  const { projectCount, uniqueToolsCount, versions } = await getDashboardData()

  return (
    <div className="container mx-auto p-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Link href="/projects" className="block">
          <Card className="relative">
            <CardHeader>
              <CardTitle>Total Projects</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h1>{projectCount}</h1>
            </CardContent>
            <ExternalLink className="absolute right-4 top-4 size-4 text-muted-foreground" />
          </Card>
        </Link>
        <Link href="/versions" className="block">
          <Card className="relative">
            <CardHeader>
              <CardTitle>Unique Tools</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h1>{uniqueToolsCount}</h1>
            </CardContent>
            <ExternalLink className="absolute right-4 top-4 size-4 text-muted-foreground" />
          </Card>
        </Link>
      </div>
      <EOLDependenciesTable versions={versions} />
    </div>
  )
}
