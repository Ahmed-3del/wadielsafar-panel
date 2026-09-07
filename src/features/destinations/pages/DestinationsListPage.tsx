import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Badge } from '@/components/ui'
import { ImportDialog } from '@/components/modals/ImportDialog'
import { DataTable, type DataTableColumn } from '@/components/tables/DataTable'
import { ConfirmDialog } from '@/components/modals/ConfirmDialog'
import { showToast } from '@/components/feedback'
import { extractErrorMessage } from '@/services/api/client'
import { useDestinations } from '../hooks/useDestinations'
import { useDeleteDestination } from '../hooks/useDeleteDestination'
import type { Destination } from '../types'

export function DestinationsListPage() {
  const navigate = useNavigate()
  const [importing, setImporting] = useState(false)
  const [page, setPage] = useState(1)
  const [pendingDelete, setPendingDelete] = useState<Destination | null>(null)
  const { data, isLoading, isError, error, refetch } = useDestinations(page)
  const deleteDestination = useDeleteDestination()

  const columns: DataTableColumn<Destination>[] = [
    { key: 'name_en', header: 'Name (EN)', render: (row) => row.name_en },
    { key: 'name_ar', header: 'Name (AR)', render: (row) => row.name_ar },
    { key: 'country_en', header: 'Country', render: (row) => row.country_en },
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
          <Link to={`/destinations/${row.slug}/edit`} className="text-navy-700 hover:underline">
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
    deleteDestination.mutate(pendingDelete.slug, {
      onSuccess: () => {
        showToast('Destination deleted.')
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
        <h1 className="text-xl font-semibold text-navy-900">Destinations</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => { setImporting(true) }}>
            Import
          </Button>
          <Button
            onClick={() => {
              void navigate('/destinations/new')
            }}
          >
            New Destination
          </Button>
        </div>
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
        emptyTitle="No destinations yet"
        emptyDescription="Create your first destination to get started."
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
        title={`Delete ${pendingDelete?.name_en ?? ''}?`}
        description="This cannot be undone."
        confirmLabel="Delete"
        isConfirming={deleteDestination.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setPendingDelete(null)
        }}
      />

      <ImportDialog
        open={importing}
        resource="destinations"
        label="destinations"
        queryKey="destinations"
        onClose={() => { setImporting(false) }}
      />
    </div>
  )
}
