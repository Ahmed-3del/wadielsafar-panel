import type { ReactNode } from 'react'
import { Spinner, ErrorState, EmptyState } from '@/components/feedback'

export interface DataTableColumn<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  data: T[] | undefined
  getRowKey: (row: T) => string | number
  isLoading?: boolean
  isError?: boolean
  errorMessage?: string
  onRetry?: () => void
  emptyTitle?: string
  emptyDescription?: string
  onRowClick?: (row: T) => void
}

/**
 * Shared table shell: every full feature (destinations, packages, visas, inquiries) renders
 * through this so loading/error/empty handling and row styling live in exactly one place.
 */
export function DataTable<T>({
  columns,
  data,
  getRowKey,
  isLoading = false,
  isError = false,
  errorMessage = 'Failed to load data.',
  onRetry,
  emptyTitle = 'No records found',
  emptyDescription,
  onRowClick,
}: DataTableProps<T>) {
  if (isLoading) return <Spinner label="Loading records…" />
  if (isError) return <ErrorState message={errorMessage} onRetry={onRetry} />
  if (!data || data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-stone-200">
      <table className="min-w-full divide-y divide-stone-200 text-sm">
        <thead className="bg-stone-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="px-4 py-3 text-left font-medium text-stone-600"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100 bg-white">
          {data.map((row) => (
            <tr
              key={getRowKey(row)}
              onClick={onRowClick ? () => { onRowClick(row) } : undefined}
              className={onRowClick ? 'cursor-pointer hover:bg-stone-50' : undefined}
            >
              {columns.map((column) => (
                <td key={column.key} className={`px-4 py-3 text-stone-700 ${column.className ?? ''}`}>
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
