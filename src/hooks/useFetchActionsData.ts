import { UseQueryResult, useQuery } from '@tanstack/react-query'
import axios from 'axios'

export type ActionOptions = {
  repoName: string
  owner: string
  filter:
    | 'completed'
    | 'action_required'
    | 'cancelled'
    | 'failure'
    | 'neutral'
    | 'skipped'
    | 'stale'
    | 'success'
    | 'timed_out'
    | 'in_progress'
    | 'queued'
    | 'requested'
    | 'waiting'
    | 'pending'
}

export type ghActions = {
  total_count: number
  workflow_runs: any[]
}

const fetchActionsDataFromServer = async (
  options: ActionOptions,
): Promise<ghActions> => {
  const { data } = await axios.post<ghActions>('/api/fetchActionsData', options)
  return data
}

const useFetchActionsData = (
  options: ActionOptions,
): UseQueryResult<ghActions, Error> =>
  useQuery({
    queryKey: ['actionsData', options],
    queryFn: () => fetchActionsDataFromServer(options),
    enabled: options.repoName !== '' && options.owner !== '',
    staleTime: 1000 * 60 * 15, // 15 minutes
    refetchInterval: 1000 * 60 * 15, // 15 minutes
    retry: 1,
  })

export default useFetchActionsData
