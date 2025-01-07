import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip'
import { formatDistanceToNow } from 'date-fns'
import { GitBranch, GitCommit, Tag } from 'lucide-react'
import Link from 'next/link'

export interface DeploymentStatus {
  environment: string
  status: string
  created_at: string
  url: string | null
  ref: string
  sha: string
  commitUrl: string
  refUrl: string
  actor: {
    login: string
    avatar_url: string
    html_url: string
  } | null
  release: {
    name: string
    tag: string
    url: string
  } | null
}

export function DeploymentCell({
  deployment,
}: {
  deployment: DeploymentStatus | null
}) {
  if (!deployment) {
    return (
      <span className="text-sm text-muted-foreground" role="status">
        No deployments
      </span>
    )
  }

  const timeAgo = formatDistanceToNow(new Date(deployment.created_at), {
    addSuffix: true,
  })

  // Extract branch name from ref (removes refs/heads/ or refs/tags/)
  const branchName = deployment.ref.split('/').pop() || deployment.ref

  return (
    <div
      className="flex flex-col gap-1 text-sm"
      role="region"
      aria-label={`${deployment.environment} deployment info`}
    >
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <div className="flex items-center gap-1.5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={deployment.refUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group max-w-[140px] truncate text-xs text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={`Branch: ${branchName}`}
                >
                  <span className="inline-flex items-center gap-1">
                    <GitBranch
                      className="h-3 w-3 shrink-0 transition-colors group-hover:text-foreground"
                      aria-hidden="true"
                    />
                    <span className="truncate">{branchName}</span>
                  </span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Branch: {deployment.ref}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {deployment.release && (
          <>
            <span aria-hidden="true" className="text-xs text-muted-foreground">
              •
            </span>
            <div className="flex items-center gap-1.5">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={deployment.release.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Tag
                        className="h-3 w-3 shrink-0 transition-colors group-hover:text-foreground"
                        aria-hidden="true"
                      />
                      <span className="font-medium">
                        {deployment.release.tag}
                      </span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Release: {deployment.release.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-muted-foreground">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={deployment.commitUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1 transition-colors hover:text-foreground"
                aria-label={`Commit: ${deployment.sha}`}
              >
                <GitCommit
                  className="h-3 w-3 shrink-0 transition-colors group-hover:text-foreground"
                  aria-hidden="true"
                />
                <span className="font-mono">{deployment.sha}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Commit: {deployment.sha}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {deployment.url && (
          <>
            <span aria-hidden="true">•</span>
            <Link
              href={deployment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
              aria-label={`Deployed ${timeAgo}`}
            >
              {timeAgo}
            </Link>
          </>
        )}

        {deployment.actor && (
          <>
            <span aria-hidden="true">•</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={deployment.actor.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center transition-colors hover:text-foreground"
                  >
                    <img
                      src={deployment.actor.avatar_url}
                      alt=""
                      className="h-4 w-4 rounded-full"
                      aria-hidden="true"
                    />
                    <span className="sr-only">
                      Deployed by {deployment.actor.login}
                    </span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Deployed by {deployment.actor.login}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        )}
      </div>
    </div>
  )
}
