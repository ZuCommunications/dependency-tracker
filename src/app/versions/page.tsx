import { CardListSkeleton } from '@/components/card-list-skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { dependency } from '@/constants/dependency-mappings'
import { Search } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import TechnologyList from './TechnologyList'

export default function VersionsPage() {
  const sortedDependencies = [...dependency].sort((a, b) =>
    a.name.localeCompare(b.name),
  )

  return (
    <div className="container mx-auto space-y-6 p-4">
      <Alert>
        <AlertDescription className="flex gap-1.5">
          <Search className="mt-0.5 size-4 shrink-0" />
          <span>
            Looking for a specific package? Try{' '}
            <Link
              href="/dependencies"
              className="hover:text-primary font-medium underline underline-offset-4"
            >
              dependency graph search
            </Link>{' '}
            to find packages across all projects on GitHub.
          </span>
        </AlertDescription>
      </Alert>

      <Suspense fallback={<CardListSkeleton />}>
        <TechnologyList technologies={sortedDependencies} />
      </Suspense>
    </div>
  )
}
