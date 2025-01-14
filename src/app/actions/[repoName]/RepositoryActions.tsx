'use client'
import ActionCard from '@/components/ActionCard'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import useFetchActionsData, { Filter } from '@/hooks/useFetchActionsData'
import Image from 'next/image'
import { useQueryState } from 'nuqs'
import { useMemo } from 'react'
import { bots, displayFlex, gitGud, IT } from './teamMembers'

type Props = { repoName: string }

interface MemberItemProps {
  value: string
  children: React.ReactNode
  disabled?: boolean
}

const MemberItem = ({ value, children, disabled }: MemberItemProps) => {
  // Skip avatar for section headers
  if (disabled) {
    return (
      <SelectItem value={value} disabled={disabled}>
        {children}
      </SelectItem>
    )
  }

  const getBotAvatarUrl = (botName: string) => {
    switch (botName) {
      case 'github-actions':
        return 'https://avatars.githubusercontent.com/in/15368'
      case 'dependabot[bot]':
        return 'https://avatars.githubusercontent.com/in/29110'
      default:
        return `https://github.com/${value}.png`
    }
  }

  return (
    <SelectItem value={value}>
      <div className="flex items-center gap-2">
        <Image
          src={getBotAvatarUrl(value)}
          alt={`${value}'s avatar`}
          width={20}
          height={20}
          className="rounded-full"
        />
        {children}
      </div>
    </SelectItem>
  )
}

const RepositoryActions = ({ repoName }: Props) => {
  const [selectedFilter, setSelectedFilter] = useQueryState('filter', {
    defaultValue: 'completed' as Filter,
  })

  const [authorName, setAuthorName] = useQueryState('author', {
    defaultValue: 'Members',
  })

  const { data, isLoading } = useFetchActionsData({
    repoName: repoName as string,
    filter: selectedFilter as Filter,
  })

  const filteredRuns = useMemo(() => {
    if (authorName === 'Members') {
      return data?.workflow_runs.filter(
        (run) => !bots.includes(run.actor?.login ?? ''),
      )
    }
    return data?.workflow_runs.filter(
      (run) =>
        run.actor?.login.toLowerCase() === authorName.toLowerCase() ||
        authorName === '',
    )
  }, [data, authorName])

  if (data === undefined && !isLoading) {
    return <>Something went wrong...</>
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <h2 className="text-center text-2xl font-bold uppercase">{repoName}</h2>
      </div>
      <div className="mb-4 flex items-center justify-end gap-4">
        <Select
          value={authorName}
          onValueChange={(value) => setAuthorName(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Author" />
          </SelectTrigger>
          <SelectContent>
            <MemberItem value="Members">All Members</MemberItem>
            <MemberItem value="DisplayFlex" disabled>
              display: flex
            </MemberItem>
            {displayFlex.map((member) => (
              <MemberItem key={member} value={member}>
                {member}
              </MemberItem>
            ))}
            <MemberItem value="GitGud" disabled>
              Git Gud
            </MemberItem>
            {gitGud.map((member) => (
              <MemberItem key={member} value={member}>
                {member}
              </MemberItem>
            ))}
            <MemberItem value="IT" disabled>
              IT
            </MemberItem>
            {IT.map((member) => (
              <MemberItem key={member} value={member}>
                {member}
              </MemberItem>
            ))}
            <MemberItem value="Bots" disabled>
              Bots
            </MemberItem>
            {bots.map((member) => (
              <MemberItem key={member} value={member}>
                {member}
              </MemberItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={selectedFilter}
          onValueChange={(value) => setSelectedFilter(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="failure">Failure</SelectItem>
            <SelectItem value="action_required">Action Required</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="neutral">Neutral</SelectItem>
            <SelectItem value="skipped">Skipped</SelectItem>
            <SelectItem value="stale">Stale</SelectItem>
            <SelectItem value="timed_out">Timed Out</SelectItem>
            <SelectItem value="queued">Queued</SelectItem>
            <SelectItem value="requested">Requested</SelectItem>
            <SelectItem value="waiting">Waiting</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="flex flex-col space-y-2">
              <Skeleton className="h-[150px] w-[350px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[300px]" />
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {filteredRuns?.length === 0 ? (
            <div className="flex items-center justify-center gap-4 py-8 text-xl">
              <span>
                There are no &lsquo;{selectedFilter}&rsquo; actions by{' '}
                {authorName}
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredRuns?.map((action) => (
                <ActionCard key={action.id} action={action} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default RepositoryActions
