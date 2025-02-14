'use client'

import { Cell } from '@/components/DataCells'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useQueryState } from 'nuqs'
import { useMemo } from 'react'
import { DeploymentCell, DeploymentStatus } from './DeploymentCell'
import { EndOfLifeCell } from './EndOfLifeCell'
import { LatestVersionCell } from './LatestVersionCell'
import { Tables } from '../../database.types'

interface ProjectToolsTableProps {
  data: Tables<'versions'>[]
  deployments: {
    dev: DeploymentStatus | null
    beta: DeploymentStatus | null
    prod: DeploymentStatus | null
  }
}

export function ProjectToolsTable({
  data,
  deployments,
}: ProjectToolsTableProps) {
  const [searchTerm, setSearchTerm] = useQueryState('search', {
    defaultValue: '',
  })

  const groupedData = useMemo(() => {
    const grouped: { [key: string]: { [env: string]: string } } = {}
    data.forEach((item) => {
      if (!grouped[item.key]) {
        grouped[item.key] = {}
      }
      // @ts-expect-error
      grouped[item.key][item.environment] = item.value
    })
    return grouped
  }, [data])

  const filteredData = useMemo(() => {
    return Object.entries(groupedData)
      .filter(([key]) => key.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort(([a], [b]) => a.localeCompare(b))
  }, [groupedData, searchTerm])

  return (
    <div className="flex h-full flex-col">
      <div className="bg-background sticky top-0 z-10 p-2">
        <Input
          placeholder="Search tools..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
      </div>
      <div className="flex-grow overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tool</TableHead>
              <TableHead>LOCAL</TableHead>
              <TableHead>DEV</TableHead>
              <TableHead>BETA</TableHead>
              <TableHead>PROD</TableHead>
              <TableHead>Latest Version</TableHead>
              <TableHead>EOL</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">DEPLOYMENTS</TableCell>
              <TableCell>-</TableCell>
              <TableCell>
                <DeploymentCell deployment={deployments.dev} />
              </TableCell>
              <TableCell>
                <DeploymentCell deployment={deployments.beta} />
              </TableCell>
              <TableCell>
                <DeploymentCell deployment={deployments.prod} />
              </TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
            {filteredData.map(([key, versions]) => (
              <TableRow key={key}>
                <TableCell>{key}</TableCell>
                {['LOCAL', 'DEV', 'BETA', 'PROD'].map((env) => (
                  <TableCell key={env}>
                    <Cell tech={key} version={versions[env]} />
                  </TableCell>
                ))}
                <TableCell>
                  <LatestVersionCell
                    searchKey={key}
                    currentVersion={
                      versions['PROD'] ||
                      versions['BETA'] ||
                      versions['DEV'] ||
                      versions['LOCAL']
                    }
                  />
                </TableCell>
                <TableCell>
                  <EndOfLifeCell
                    searchKey={key}
                    version={
                      versions['PROD'] ||
                      versions['BETA'] ||
                      versions['DEV'] ||
                      versions['LOCAL']
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
