import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Badge } from '@/components/ui'
import { DataTable, type DataTableColumn } from '@/components/tables/DataTable'
import { ConfirmDialog } from '@/components/modals/ConfirmDialog'
import { showToast } from '@/components/feedback'
import { extractErrorMessage } from '@/services/api/client'
import { useVisas } from '../hooks/useVisas'
import { useDeleteVisa } from '../hooks/useDeleteVisa'
import type { VisaType } from '../types'

export function VisasListPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [pendingDelete, setPendingDelete] = useState<VisaType | null>(null)
  const { data, isLoading, isError, error, refetch } = useVisas(page)
  const deleteVisa = useDeleteVisa()

  const columns: DataTableColumn<VisaType>[] = [
    { key: 'name_en', header: 'Name (EN)', render: (row) => row.name_en },
    { key: 'country', header: 'Country', render: (row) => row.country.name_en },
    { key: 'price', header: 'Price (SAR)', render: (row) => row.price },
    {
      key: 'processing_time_days',
      header: 'Processing (days)',
      render: (row) => row.processing_time_days,
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
          <Link to={`/visas/${row.id}/edit`} className="text-navy-700 hover:underline">
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
    deleteVisa.mutate(pendingDelete.id, {
      onSuccess: () => {
        showToast('Visa type deleted.')
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
        <h1 className="text-xl font-semibold text-navy-900">Visas</h1>
        <Button
          onClick={() => {
            void navigate('/visas/new')
          }}
        >
          New Visa Type
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
        emptyTitle="No visa types yet"
        emptyDescription="Create your first visa type to get started."
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
        isConfirming={deleteVisa.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setPendingDelete(null)
        }}
      />
    </div>
  )
}
