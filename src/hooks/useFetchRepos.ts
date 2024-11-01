import { UseQueryResult, useQuery } from '@tanstack/react-query'
import axios from 'axios'

export type RepoOptions = {
  owner: string
}

export type RepoData = {
  id: number
  name: string
  full_name: string
  private: boolean
}

const fetchReposFromServer = async (
  options: RepoOptions,
): Promise<RepoData[]> => {
  const { data } = await axios.post<RepoData[]>('/api/fetchRepos', options)
  return data
}

const useFetchRepos = (
  options: RepoOptions,
): UseQueryResult<RepoData[], Error> =>
  useQuery({
    queryKey: ['reposData', options],
    queryFn: () => fetchReposFromServer(options),
    enabled: options.owner !== '',
    staleTime: 1000 * 60 * 60 * 24, // 1 day
    refetchInterval: 1000 * 60 * 60 * 24, // 1 day
    retry: 1,
  })

export default useFetchRepos
