'use client'

import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useQueryState } from 'nuqs'
import { useMemo } from 'react'

interface Technology {
  name: string
  search: string
  tech?: string
  link?: string
}

interface TechnologyListProps {
  technologies: Technology[]
}

export default function TechnologyList({ technologies }: TechnologyListProps) {
  const [searchTerm, setSearchTerm] = useQueryState('search', {
    defaultValue: '',
  })

  const filteredTechnologies = useMemo(() => {
    return technologies.filter((tech) =>
      tech.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [technologies, searchTerm])

  return (
    <div>
      <Input
        placeholder="Search technologies..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
        autoFocus={true}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredTechnologies.map((tech) => (
          <Link
            prefetch={true}
            href={
              tech.link ||
              `/versions/${tech.search}/project${tech.tech ? `?technology=${tech.tech}` : ''}`
            }
            key={tech.search}
          >
            <Card className="relative h-full">
              <CardHeader>
                <CardTitle>
                  <span className="text-2xl font-bold">{tech.name}</span>
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
