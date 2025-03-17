'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { ExternalLink } from 'lucide-react'
import { useQueryState } from 'nuqs'

interface ProjectListProps {
  projects: string[]
}

export default function ProjectList({ projects }: ProjectListProps) {
  const [searchTerm, setSearchTerm] = useQueryState('search', {
    defaultValue: '',
  })

  const filteredProjects = useMemo(() => {
    return projects.filter((project) =>
      project.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [projects, searchTerm])

  return (
    <div>
      <Input
        placeholder="Search projects..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
        autoFocus={true}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredProjects.map((project) => (
          <Link
            prefetch={true}
            href={`/projects/${project}/tools`}
            key={project}
            className="block"
          >
            <Card className="relative h-full">
              <CardHeader>
                <CardTitle>
                  <span className="text-2xl font-bold">{project}</span>
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
