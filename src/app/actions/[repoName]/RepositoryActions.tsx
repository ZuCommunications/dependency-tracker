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
import { useQueryState } from 'nuqs'
import { useMemo, useState } from 'react'
import { displayFlex, gitGud, IT } from './teamMembers'

type Props = { repoName: string }

const RepositoryActions = ({ repoName }: Props) => {
  const [selectedFilter, setSelectedFilter] = useQueryState('filter', {
    defaultValue: 'completed' as Filter,
  })

  const [authorType, setAuthorType] = useState('user')
  const [authorName, setAuthorName] = useState('')

  const { data, isLoading } = useFetchActionsData({
    repoName: repoName as string,
    filter: selectedFilter as Filter,
  })

  if (data === undefined && !isLoading) {
    return <>Something went wrong...</>
  }

  const filteredRuns = useMemo(() => {
    return data?.workflow_runs.filter(
      (run) =>
        authorType.toLowerCase() === run.actor?.type.toLowerCase() &&
        (run.actor.login.toLowerCase() === authorName.toLowerCase() ||
          authorName === ''),
    )
  }, [data, authorType, authorName])

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
            <SelectItem value="DisplayFlex" disabled>
              display: flex
            </SelectItem>
            {displayFlex.map((member) => (
              <SelectItem value={member}>{member}</SelectItem>
            ))}
            <SelectItem value="GitGud" disabled>
              Git Gud
            </SelectItem>
            {gitGud.map((member) => (
              <SelectItem value={member}>{member}</SelectItem>
            ))}
            <SelectItem value="IT" disabled>
              IT
            </SelectItem>
            {IT.map((member) => (
              <SelectItem value={member}>{member}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={authorType}
          onValueChange={(value) => setAuthorType(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Author Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bot">Bot</SelectItem>
            <SelectItem value="user">User</SelectItem>
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
              {authorName !== '' && authorType.toLowerCase() === 'bot' ? (
                <span>
                  {authorName} is not a {authorType}
                </span>
              ) : (
                <span>
                  There are no '{selectedFilter}' actions by {authorName}
                </span>
              )}
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
