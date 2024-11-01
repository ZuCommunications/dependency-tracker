import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { ActionOptions, ghActions } from '@/hooks/useFetchActionsData'

const fetchTechData = async (options: ActionOptions): Promise<ghActions> => {
  const url = `https://api.github.com/repos/${options.owner}/${options.repoName}/actions/runs?status=${options.filter}`
  try {
    const { data } = await axios.get<ghActions>(url, {
      headers: {
        Authorization: `${process.env.GH_ACCESS_TOKEN}`,
      },
    })

    return data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return { total_count: 0, workflow_runs: [] }
    }
    throw new Error('Failed to fetch tech data')
  }
}

export async function POST(req: NextRequest) {
  const options: ActionOptions = await req.json()
  try {
    const data = await fetchTechData(options)
    return NextResponse.json(data)
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ message: errorMessage }, { status: 500 })
  }
}
