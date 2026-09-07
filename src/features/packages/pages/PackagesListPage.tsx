import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Badge } from '@/components/ui'
import { ImportDialog } from '@/components/modals/ImportDialog'
import { DataTable, type DataTableColumn } from '@/components/tables/DataTable'
import { ConfirmDialog } from '@/components/modals/ConfirmDialog'
import { showToast } from '@/components/feedback'
import { extractErrorMessage } from '@/services/api/client'
import { usePackages } from '../hooks/usePackages'
import { useDeletePackage } from '../hooks/useDeletePackage'
import type { Package } from '../types'

export function PackagesListPage() {
  const navigate = useNavigate()
  const [importing, setImporting] = useState(false)
  const [page, setPage] = useState(1)
  const [pendingDelete, setPendingDelete] = useState<Package | null>(null)
  const { data, isLoading, isError, error, refetch } = usePackages(page)
  const deletePackage = useDeletePackage()

  const columns: DataTableColumn<Package>[] = [
    { key: 'title_en', header: 'Title (EN)', render: (row) => row.title_en },
    { key: 'category', header: 'Category', render: (row) => row.category.name_en },
    { key: 'duration_days', header: 'Duration', render: (row) => `${row.duration_days} days` },
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
          <Link to={`/packages/${row.slug}/edit`} className="text-navy-700 hover:underline">
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
    deletePackage.mutate(pendingDelete.slug, {
      onSuccess: () => {
        showToast('Package deleted.')
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
        <h1 className="text-xl font-semibold text-navy-900">Packages</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => { setImporting(true) }}>
            Import
          </Button>
          <Button
            onClick={() => {
              void navigate('/packages/new')
            }}
          >
            New Package
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
        emptyTitle="No packages yet"
        emptyDescription="Create your first package to get started."
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
        isConfirming={deletePackage.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setPendingDelete(null)
        }}
      />

      <ImportDialog
        open={importing}
        resource="packages"
        label="packages"
        queryKey="packages"
        onClose={() => { setImporting(false) }}
      />
    </div>
  )
}
