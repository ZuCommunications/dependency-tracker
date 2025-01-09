'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'
import { Database } from '../../database.types'

interface Project {
  id: string
  name: string
  full_name: string
}

export function useProjectList() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data: dependencies, error } = await supabase
          .from('versions')
          .select('id')

        if (error) throw error

        // Remove duplicates and sort alphabetically
        const uniqueProjects = Array.from(
          new Set(dependencies?.map((dep) => dep.id)),
        ).sort((a, b) => a.localeCompare(b))

        // Transform to Project format
        const projectList: Project[] = uniqueProjects.map((id) => ({
          id,
          name: id,
          full_name: `${process.env.NEXT_PUBLIC_GITHUB_OWNER}/${id}`,
        }))

        setProjects(projectList)
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [supabase])

  return { projects, isLoading }
}
