'use client'
import ActionCard from '@/components/ActionCard'
import { Skeleton } from '@/components/ui/skeleton'
import useFetchActionsData from '@/hooks/useFetchActionsData'

type Props = { repoName: string }

const RepositoryActions = ({ repoName }: Props) => {
  const { data, isLoading } = useFetchActionsData({
    repoName: repoName as string,
    owner: process.env.NEXT_PUBLIC_GITHUB_OWNER ?? '',
    filter: 'completed',
  })

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <h2 className="text-center text-2xl font-bold uppercase">{repoName}</h2>
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
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {data?.workflow_runs.map((action) => (
            <ActionCard
              key={action.id}
              title={action.name}
              branch={action.head_branch}
              runStart={action.created_at}
              status={action.status}
              conclusion={action.conclusion}
              link={action.html_url}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default RepositoryActions
