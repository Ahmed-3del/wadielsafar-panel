import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Badge, Button } from '@/components/ui'
import { ImportDialog } from '@/components/modals/ImportDialog'
import { DataTable, type DataTableColumn } from '@/components/tables/DataTable'
import { ConfirmDialog } from '@/components/modals/ConfirmDialog'
import { showToast } from '@/components/feedback'
import { extractErrorMessage } from '@/services/api/client'
import { useServices } from '../hooks/useServices'
import { useDeleteService } from '../hooks/useDeleteService'
import type { Service } from '../types'

export function ServicesListPage() {
  const navigate = useNavigate()
  const [importing, setImporting] = useState(false)
  const [page, setPage] = useState(1)
  const [pendingDelete, setPendingDelete] = useState<Service | null>(null)
  const { data, isLoading, isError, error, refetch } = useServices(page)
  const deleteService = useDeleteService()

  const columns: DataTableColumn<Service>[] = [
    { key: 'order', header: 'Order', render: (row) => row.order },
    { key: 'name_en', header: 'Name (EN)', render: (row) => row.name_en },
    {
      key: 'name_ar',
      header: 'Name (AR)',
      render: (row) => <span dir="rtl">{row.name_ar}</span>,
    },
    { key: 'icon', header: 'Icon', render: (row) => row.icon || '—' },
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
          <Link to={`/services/${row.id}/edit`} className="text-navy-700 hover:underline">
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
    deleteService.mutate(pendingDelete.id, {
      onSuccess: () => {
        showToast('Service deleted.')
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
        <h1 className="text-xl font-semibold text-navy-900">Services</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => { setImporting(true) }}>
            Import
          </Button>
          <Button
            onClick={() => {
              void navigate('/services/new')
            }}
          >
            New Service
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
        emptyTitle="No services yet"
        emptyDescription="Create the first service shown in the homepage selector."
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
        isConfirming={deleteService.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setPendingDelete(null)
        }}
      />

      <ImportDialog
        open={importing}
        resource="services"
        label="services"
        queryKey="services"
        onClose={() => { setImporting(false) }}
      />
    </div>
  )
}
