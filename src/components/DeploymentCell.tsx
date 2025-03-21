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
      <span className="text-muted-foreground text-sm" role="status">
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
                  className="group text-muted-foreground hover:text-foreground max-w-[140px] truncate text-xs transition-colors"
                  aria-label={`Branch: ${branchName}`}
                >
                  <span className="inline-flex items-center gap-1">
                    <GitBranch
                      className="group-hover:text-foreground h-3 w-3 shrink-0 transition-colors"
                      aria-hidden="true"
                    />
                    <span className="truncate">{branchName}</span>
                  </span>
                </Link>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-popover text-popover-foreground border-border animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 z-50 rounded-md border px-3 py-1.5 text-sm shadow-md"
              >
                <p>Branch: {deployment.ref}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {deployment.release && (
          <>
            <span aria-hidden="true" className="text-muted-foreground text-xs">
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
                      className="group text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs transition-colors"
                    >
                      <Tag
                        className="group-hover:text-foreground h-3 w-3 shrink-0 transition-colors"
                        aria-hidden="true"
                      />
                      <span className="font-medium">
                        {deployment.release.tag}
                      </span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="bg-popover text-popover-foreground border-border animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 z-50 rounded-md border px-3 py-1.5 text-sm shadow-md"
                  >
                    <p>Release: {deployment.release.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </>
        )}
      </div>

      <div className="text-muted-foreground flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={deployment.commitUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group hover:text-foreground inline-flex items-center gap-1 transition-colors"
                aria-label={`Commit: ${deployment.sha}`}
              >
                <GitCommit
                  className="group-hover:text-foreground h-3 w-3 shrink-0 transition-colors"
                  aria-hidden="true"
                />
                <span className="font-mono">{deployment.sha}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="bg-popover text-popover-foreground border-border animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 z-50 rounded-md border px-3 py-1.5 text-sm shadow-md"
            >
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
              className="hover:text-foreground transition-colors"
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
                    className="hover:text-foreground inline-flex items-center transition-colors"
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
                <TooltipContent
                  side="top"
                  className="bg-popover text-popover-foreground border-border animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 z-50 rounded-md border px-3 py-1.5 text-sm shadow-md"
                >
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
