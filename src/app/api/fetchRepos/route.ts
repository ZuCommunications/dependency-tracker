import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { RepoData } from '@/hooks/useFetchRepos'

const fetchRepos = async (owner: string): Promise<RepoData[]> => {
  const response = await axios.get<RepoData[]>(
    `https://api.github.com/user/repos?visibility=all`,
    {
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
        Authorization: `Bearer ${process.env.GH_ACCESS_TOKEN}`,
      },
    },
  )
  return response.data
}

export async function POST(req: NextRequest) {
  const { owner } = await req.json()

  if (!owner) {
    return NextResponse.json({ error: 'Owner is required' }, { status: 400 })
  }

  try {
    const repos = await fetchRepos(owner)
    return NextResponse.json(repos)
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ message: errorMessage }, { status: 500 })
  }
}
