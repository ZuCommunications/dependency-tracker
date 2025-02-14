import CardWithLink from '@/components/card-with-link'
import { ProjectToolsTable } from '@/components/project-tools-table'
import { TableSkeleton } from '@/components/table-list-skeleton'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  fetchDependabotAlertsData,
  fetchDeploymentStatus,
} from '@/server-actions/github'
import { createServerClient } from '@/utils/supabase'
import { ArrowLeft } from 'lucide-react'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Suspense } from 'react'
import { Tables } from '../../../../../database.types'

function CardsSkeleton() {
  return (
    <div className="flex gap-2">
      <Skeleton className="h-[120px] w-1/2 rounded-lg" />
      <Skeleton className="h-[120px] w-1/2 rounded-lg" />
    </div>
  )
}

function ToolsTableSkeleton() {
  return (
    <TableSkeleton
      headers={[
        'Tool',
        'LOCAL',
        'DEV',
        'BETA',
        'PROD',
        'Latest Version',
        'EOL',
      ]}
      rowCount={16}
    />
  )
}

async function DependabotSection({ projectId }: { projectId: string }) {
  const alerts = await fetchDependabotAlertsData(projectId)
  const count = alerts.filter((alert) => alert.state === 'open').length

  return (
    <div className="flex gap-2">
      <CardWithLink
        title="Open Dependabot Security Issues"
        content={count.toString()}
        link={`https://github.com/${process.env.NEXT_PUBLIC_GITHUB_OWNER}/${projectId}/security/dependabot`}
        isExternalLink={true}
        className="md:w-1/2"
        contentClassName={count ? 'text-destructive' : ''}
      />
      <CardWithLink
        title="Full List of Dependencies"
        content={projectId}
        link={`https://github.com/${process.env.NEXT_PUBLIC_GITHUB_OWNER}/${projectId}/network/dependencies`}
        isExternalLink={true}
        className="md:w-1/2"
        contentClassName="text-card"
      />
    </div>
  )
}

async function DeploymentSection({
  projectId,
  dependencies,
}: {
  projectId: string
  dependencies: Tables<'versions'>[]
}) {
  const deployments = await fetchDeploymentStatus(projectId)

  return <ProjectToolsTable data={dependencies} deployments={deployments} />
}

export default async function ToolsPage(props: {
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

  if (error) {
    return <div>Error: {error.message}</div>
  }
  const dependencies = data || []

  return (
    <div className="container mx-auto p-6">
      <div className="relative mb-4">
        <div className="absolute top-1/2 left-0 -translate-y-1/2">
          <Link prefetch={true} href={`/projects`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Projects
            </Button>
          </Link>
        </div>
        <h2 className="text-center text-2xl font-bold">{projectId}</h2>
      </div>

      <Suspense fallback={<CardsSkeleton />}>
        <DependabotSection projectId={projectId} />
      </Suspense>

      <div className="mt-6">
        <Suspense fallback={<ToolsTableSkeleton />}>
          <DeploymentSection
            projectId={projectId}
            dependencies={dependencies}
          />
        </Suspense>
      </div>
    </div>
  )
}
