'use client'

import { SimpleCardSkeleton } from '@/components/card-skeleton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useProjectList } from '@/hooks/useProjectList'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useQueryState } from 'nuqs'

export default function DependencySearch() {
  const [searchTerm, setSearchTerm] = useQueryState('q', { defaultValue: '' })
  const { projects, isLoading } = useProjectList()

  const openAllInTabs = () => {
    projects.forEach((project) => {
      window.open(
        `https://github.com/${project.full_name}/network/dependencies?q=${searchTerm}`,
        '_blank',
      )
    })
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <SimpleCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Input
        placeholder="Search for dependencies across all projects (e.g., gulp, stage_file_proxy)..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full"
        autoFocus={true}
      />

      {searchTerm && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Search results for &quot;{searchTerm}&quot;
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={openAllInTabs}
              className="flex items-center gap-2"
            >
              Open all {projects.length} projects in new tabs
              <ExternalLink className="size-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="hover:bg-muted/50 relative transition-colors"
              >
                <CardHeader>
                  <CardTitle>{project.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Link
                    href={`https://github.com/${project.full_name}/network/dependencies?q=${searchTerm}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary flex items-center gap-2 text-sm"
                  >
                    View search result on GitHub
                    <ExternalLink className="size-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
