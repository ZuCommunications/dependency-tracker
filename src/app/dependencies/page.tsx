import { CardListSkeleton } from '@/components/card-list-skeleton'
import { Suspense } from 'react'
import DependencySearch from './DependencySearch'

export default function DependenciesPage() {
  return (
    <div className="container py-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">
            Search Dependency Graph on GitHub
          </h1>
          <p className="text-muted-foreground text-sm">
            Search GitHub dependency graphs across all projects to find where
            packages are used
          </p>
        </div>
        <Suspense fallback={<CardListSkeleton />}>
          <DependencySearch />
        </Suspense>
      </div>
    </div>
  )
}
