import { InfoTooltip } from '@/components/InfoTooltip'
import { TableRowSkeleton } from '@/components/table-list-skeleton'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { fetchDependabotAlertsData } from '@/server-actions/github'
import { createServerClient } from '@/utils/supabase'
import { ExternalLink } from 'lucide-react'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Suspense, use } from 'react'

type ProjectToAlert = {
  project: string
  environment: string
  modified: string
  criticalAlerts: Awaited<ReturnType<typeof fetchDependabotAlertsData>>
  highAlerts: Awaited<ReturnType<typeof fetchDependabotAlertsData>>
  mediumAlerts: Awaited<ReturnType<typeof fetchDependabotAlertsData>>
  lowAlerts: Awaited<ReturnType<typeof fetchDependabotAlertsData>>
}

async function fetchProjectAlerts(project: string) {
  const criticalAlertsPromise = fetchDependabotAlertsData(project, 'critical')
  const highAlertsPromise = fetchDependabotAlertsData(project, 'high')
  const mediumAlertsPromise = fetchDependabotAlertsData(project, 'medium')
  const lowAlertsPromise = fetchDependabotAlertsData(project, 'low')

  const [criticalAlerts, highAlerts, mediumAlerts, lowAlerts] =
    await Promise.all([
      criticalAlertsPromise,
      highAlertsPromise,
      mediumAlertsPromise,
      lowAlertsPromise,
    ])

  return {
    project,
    environment: 'PROD',
    modified: new Date().toISOString(),
    criticalAlerts: criticalAlerts,
    highAlerts: highAlerts,
    mediumAlerts: mediumAlerts,
    lowAlerts: lowAlerts,
  }
}

function AlertRow({ project }: { project: ProjectToAlert }) {
  const data = [
    project.criticalAlerts,
    project.highAlerts,
    project.mediumAlerts,
    project.lowAlerts,
  ]
  const toolTipData = data.map((alerts) => {
    const innerToolTipData = alerts.map((alert) => ({
      Package:
        alert.security_advisory?.vulnerabilities[0]?.package?.name || 'Unknown',
      Severity: alert.security_advisory?.severity || 'Unknown',
      State: alert.state,
      Created: new Date(alert.created_at).toLocaleDateString(),
      Summary: alert.security_advisory?.summary || 'No summary available',
    }))
    return innerToolTipData
  })

  const total =
    project.criticalAlerts.length +
    project.highAlerts.length +
    project.mediumAlerts.length +
    project.lowAlerts.length

  if (!total) return null

  return (
    <TableRow>
      <Link href={`/projects/${project.project}/tools`}>
        <TableCell className="decoration-muted-foreground underline underline-offset-2">
          {project.project}
        </TableCell>
      </Link>
      <TableCell>
        {project.criticalAlerts.length ? (
          <div className="flex gap-2">
            <Link
              href={`https://github.com/${process.env.NEXT_PUBLIC_GITHUB_OWNER}/${project.project}/security/dependabot?q=is%3Aopen+severity%3Acritical`}
              target={'_blank'}
              rel={'noopener noreferrer'}
            >
              <Badge
                variant={
                  project.criticalAlerts.length > 10 ? 'destructive' : 'default'
                }
                className="flex w-fit min-w-16 justify-center gap-1 text-center"
              >
                {project.criticalAlerts.length}{' '}
                <ExternalLink className="size-3" />
              </Badge>
            </Link>
            <InfoTooltip data={toolTipData[0]}>
              <span className="sr-only">Alert Details</span>
            </InfoTooltip>
          </div>
        ) : (
          <>-</>
        )}
      </TableCell>
      <TableCell>
        {project.highAlerts.length > 0 ? (
          <div className="flex gap-2">
            <Link
              href={`https://github.com/${process.env.NEXT_PUBLIC_GITHUB_OWNER}/${project.project}/security/dependabot?q=is%3Aopen+severity%3Ahigh`}
              target={'_blank'}
              rel={'noopener noreferrer'}
            >
              <Badge
                variant={
                  project.highAlerts.length > 10 ? 'destructive' : 'default'
                }
                className="flex w-fit min-w-16 justify-center gap-1 text-center"
              >
                {project.highAlerts.length} <ExternalLink className="size-3" />
              </Badge>
            </Link>
            <InfoTooltip data={toolTipData[1]}>
              <span className="sr-only">Alert Details</span>
            </InfoTooltip>
          </div>
        ) : (
          <>-</>
        )}
      </TableCell>
      <TableCell>
        {project.mediumAlerts.length > 0 ? (
          <div className="flex gap-2">
            <Link
              href={`https://github.com/${process.env.NEXT_PUBLIC_GITHUB_OWNER}/${project.project}/security/dependabot?q=is%3Aopen+severity%3Amedium`}
              target={'_blank'}
              rel={'noopener noreferrer'}
            >
              <Badge
                variant={
                  project.mediumAlerts.length > 10 ? 'destructive' : 'default'
                }
                className="flex w-fit min-w-16 justify-center gap-1 text-center"
              >
                {project.mediumAlerts.length}{' '}
                <ExternalLink className="size-3" />
              </Badge>
            </Link>
            <InfoTooltip data={toolTipData[2]}>
              <span className="sr-only">Alert Details</span>
            </InfoTooltip>
          </div>
        ) : (
          <>-</>
        )}
      </TableCell>
      <TableCell>
        {project.lowAlerts.length > 0 ? (
          <div className="flex gap-2">
            <Link
              href={`https://github.com/${process.env.NEXT_PUBLIC_GITHUB_OWNER}/${project.project}/security/dependabot?q=is%3Aopen+severity%3Alow`}
              target={'_blank'}
              rel={'noopener noreferrer'}
            >
              <Badge
                variant={
                  project.lowAlerts.length > 10 ? 'destructive' : 'default'
                }
                className="flex w-fit min-w-16 justify-center gap-1 text-center"
              >
                {project.lowAlerts.length} <ExternalLink className="size-3" />
              </Badge>
            </Link>
            <InfoTooltip data={toolTipData[3]}>
              <span className="sr-only">Alert Details</span>
            </InfoTooltip>
          </div>
        ) : (
          <>-</>
        )}
      </TableCell>
      <TableCell>
        {total > 0 ? (
          <Badge
            variant={total > 40 ? 'destructive' : 'default'}
            className="min-w-12"
          >
            {total}
          </Badge>
        ) : (
          <>-</>
        )}
      </TableCell>
    </TableRow>
  )
}

function ProjectAlerts({ project }: { project: string }) {
  const alertData = use(fetchProjectAlerts(project))
  if (!alertData) return null
  return <AlertRow project={alertData} />
}

const SecurityAlertsTable = async () => {
  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)

  const { data } = await supabase
    .from('versions')
    .select('id')
    .order('id', { ascending: true })
  const uniqueProjects = Array.from(new Set(data?.map((p) => p.id) || []))

  return (
    <>
      <div className="prose mb-3 max-w-none text-center">
        <h1>Open Dependabot Security Alerts</h1>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project</TableHead>
            <TableHead>
              <Badge variant={'destructive'}>Critical Alerts</Badge>
            </TableHead>
            <TableHead>
              <Badge variant={'warning'}>High Alerts</Badge>
            </TableHead>
            <TableHead>
              <Badge variant={'default'}>Medium Alerts</Badge>
            </TableHead>
            <TableHead>
              <Badge variant={'outline'}>Low Alerts</Badge>
            </TableHead>
            <TableHead>
              <Badge variant={'outline'}>Total Alerts</Badge>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {uniqueProjects.map((project) => (
            <Suspense
              key={project}
              fallback={<TableRowSkeleton cellCount={5} />}
            >
              <ProjectAlerts project={project} />
            </Suspense>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

export default SecurityAlertsTable
