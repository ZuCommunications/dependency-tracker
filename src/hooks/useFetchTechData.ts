import { UseQueryResult, useQuery } from '@tanstack/react-query'
import axios from 'axios'

interface TechData {
  [key: string]: string
}

export async function fetchTechData(tech: string): Promise<TechData[]> {
  const url = `https://endoflife.date/api/${tech}.json`
  try {
    const { data } = await axios.get<TechData[]>(url)
    return data
  } catch (error) {
    return []
  }
}

const useFetchTechData = (tech: string): UseQueryResult<TechData[], Error> =>
  useQuery({
    queryKey: ['techData', tech],
    queryFn: () => fetchTechData(tech),
    enabled: !!tech && tech !== 'db',
    staleTime: 1000 * 60 * 60 * 24, // 1 day
    refetchInterval: 1000 * 60 * 60 * 24, // 1 day
    retry: 1,
  })

export default useFetchTechData
