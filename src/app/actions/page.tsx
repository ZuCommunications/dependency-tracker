'use client'

import useFetchRepos from '@/hooks/useFetchRepos'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'

export default function ActionsHomePage() {
  const { data, isLoading } = useFetchRepos({
    owner: process.env.NEXT_PUBLIC_GITHUB_OWNER ?? '',
  })

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {isLoading ? (
          <>
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="flex flex-col space-y-3">
                <Skeleton className="h-[100px] w-[250px] rounded-xl" />
              </div>
            ))}
          </>
        ) : (
          <>
            {data?.map((repo) => (
              <Link
                href={`/actions/${repo.name}`}
                key={repo.full_name}
                className="block"
              >
                <Card className="relative h-full">
                  <CardHeader>
                    <CardTitle>
                      <span className="break-words text-2xl font-bold">
                        {repo.name}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <ExternalLink className="absolute right-4 top-4 size-4 text-muted-foreground" />
                </Card>
              </Link>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
