import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate } from '@/utils/utility-functions'

export default async function Log() {
  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)

  const { data, error } = await supabase
    .from('versions')
    .select('*')
    .order('modified_at', { ascending: false })
    .limit(50)

  if (error) {
    return <div>Error: {error.message}</div>
  }

  const dependencies = data || []
  const tableHeaders = Object.keys(dependencies[0] || {})

  return (
    <div className="container mx-auto p-6">
      <div className="relative mb-4">
        <h2 className="text-center text-2xl font-bold">Latest Data</h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {tableHeaders.map((header) => (
              <TableHead key={header}>
                {header.charAt(0).toUpperCase() + header.slice(1)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {dependencies.map((item) => (
            <TableRow key={`${item.id}-${item.key}-${item.created_at}`}>
              {tableHeaders.map((header) => (
                <TableCell
                  key={`${item.id}-${item.key}-${item.created_at}-${header}`}
                >
                  {header === 'created_at' || header === 'modified_at'
                    ? formatDate(item[header] as string)
                    : // @ts-expect-error
                      (item[header] as string)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
