'use client'

import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface ProjectListProps {
  projects: string[]
}

export default function ActionsHomePage({ projects }: ProjectListProps) {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {projects.map((repo) => (
          <Link href={`/actions/${repo}`} key={repo} className="block">
            <Card className="relative h-full">
              <CardHeader>
                <CardTitle>
                  <span className="text-2xl font-bold break-words">{repo}</span>
                </CardTitle>
              </CardHeader>
              <ExternalLink className="text-muted-foreground absolute top-4 right-4 size-4" />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
