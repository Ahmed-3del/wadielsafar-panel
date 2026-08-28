import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Badge } from '@/components/ui'
import { DataTable, type DataTableColumn } from '@/components/tables/DataTable'
import { ConfirmDialog } from '@/components/modals/ConfirmDialog'
import { showToast } from '@/components/feedback'
import { extractErrorMessage } from '@/services/api/client'
import { useCruises } from '../hooks/useCruises'
import { useDeleteCruise } from '../hooks/useDeleteCruise'
import type { Cruise } from '../types'

export function CruisesListPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [pendingDelete, setPendingDelete] = useState<Cruise | null>(null)
  const { data, isLoading, isError, error, refetch } = useCruises(page)
  const deleteCruise = useDeleteCruise()

  const columns: DataTableColumn<Cruise>[] = [
    { key: 'title_en', header: 'Title (EN)', render: (row) => row.title_en },
    {
      key: 'cruise_line_en',
      header: 'Cruise line',
      render: (row) => row.cruise_line_en || <span className="text-stone-400">—</span>,
    },
    { key: 'duration_nights', header: 'Nights', render: (row) => row.duration_nights },
    { key: 'price_from', header: 'From (SAR)', render: (row) => row.price_from },
    {
      key: 'is_featured',
      header: 'Featured',
      render: (row) => (row.is_featured ? <Badge tone="info">Featured</Badge> : null),
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (row) => (
        <Badge tone={row.is_active ? 'success' : 'neutral'}>
          {row.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <div className="flex gap-3">
          <Link to={`/cruises/${row.slug}/edit`} className="text-navy-700 hover:underline">
            Edit
          </Link>
          <button
            type="button"
            className="text-red-600 hover:underline"
            onClick={() => {
              setPendingDelete(row)
            }}
          >
            Delete
          </button>
        </div>
      ),
    },
  ]

  const handleConfirmDelete = () => {
    if (!pendingDelete) return
    deleteCruise.mutate(pendingDelete.slug, {
      onSuccess: () => {
        showToast('Cruise deleted.')
        setPendingDelete(null)
      },
      onError: (err: unknown) => {
        showToast(extractErrorMessage(err), 'error')
      },
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-navy-900">Cruises</h1>
        <Button
          onClick={() => {
            void navigate('/cruises/new')
          }}
        >
          New Cruise
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={data?.results}
        getRowKey={(row) => row.id}
        isLoading={isLoading}
        isError={isError}
        errorMessage={error ? extractErrorMessage(error) : undefined}
        onRetry={() => {
          void refetch()
        }}
        emptyTitle="No cruises yet"
        emptyDescription="Create your first cruise to get started."
      />
      {data && data.results.length > 0 && (
        <div className="flex items-center justify-between text-sm text-stone-500">
          <span>{data.count} total</span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              disabled={!data.previous}
              onClick={() => {
                setPage((current) => current - 1)
              }}
            >
              Previous
            </Button>
            <Button
              variant="ghost"
              disabled={!data.next}
              onClick={() => {
                setPage((current) => current + 1)
              }}
            >
              Next
            </Button>
          </div>
        </div>
      )}
      <ConfirmDialog
        open={!!pendingDelete}
        title={`Delete ${pendingDelete?.title_en ?? ''}?`}
        description="This cannot be undone."
        confirmLabel="Delete"
        isConfirming={deleteCruise.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setPendingDelete(null)
        }}
      />
    </div>
  )
}
