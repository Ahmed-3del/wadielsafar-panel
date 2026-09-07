import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Badge, Button } from '@/components/ui'
import { ImportDialog } from '@/components/modals/ImportDialog'
import { DataTable, type DataTableColumn } from '@/components/tables/DataTable'
import { ConfirmDialog } from '@/components/modals/ConfirmDialog'
import { showToast } from '@/components/feedback'
import { extractErrorMessage } from '@/services/api/client'
import { formatDate } from '@/utils/formatDate'
import { OfferStatusBadge } from '../components/OfferStatusBadge'
import { useOffers } from '../hooks/useOffers'
import { useDeleteOffer } from '../hooks/useDeleteOffer'
import type { Offer } from '../types'

export function OffersListPage() {
  const navigate = useNavigate()
  const [importing, setImporting] = useState(false)
  const [page, setPage] = useState(1)
  const [pendingDelete, setPendingDelete] = useState<Offer | null>(null)
  const { data, isLoading, isError, error, refetch } = useOffers(page)
  const deleteOffer = useDeleteOffer()

  const columns: DataTableColumn<Offer>[] = [
    { key: 'title_en', header: 'Title (EN)', render: (row) => row.title_en },
    { key: 'service_type', header: 'Service', render: (row) => row.service_type },
    {
      key: 'window',
      header: 'Window',
      render: (row) => `${formatDate(row.starts_at)} → ${formatDate(row.ends_at)}`,
    },
    {
      key: 'discount_percentage',
      header: 'Discount',
      render: (row) =>
        row.discount_percentage !== null ? <Badge tone="warning">{row.discount_percentage}% off</Badge> : '—',
    },
    { key: 'status', header: 'Status', render: (row) => <OfferStatusBadge status={row.status} /> },
    {
      key: 'is_featured',
      header: 'Featured',
      render: (row) => (row.is_featured ? <Badge tone="info">Featured</Badge> : null),
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <div className="flex gap-3">
          {/* Detail routes are keyed by slug for this domain, not by id. */}
          <Link to={`/offers/${row.slug}/edit`} className="text-navy-700 hover:underline">
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
    deleteOffer.mutate(pendingDelete.slug, {
      onSuccess: () => {
        showToast('Offer deleted.')
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
        <h1 className="text-xl font-semibold text-navy-900">Offers</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => { setImporting(true) }}>
            Import
          </Button>
          <Button
            onClick={() => {
              void navigate('/offers/new')
            }}
          >
            New Offer
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
        emptyTitle="No offers yet"
        emptyDescription="Create a promotional offer with a validity window."
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
        isConfirming={deleteOffer.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setPendingDelete(null)
        }}
      />

      <ImportDialog
        open={importing}
        resource="offers"
        label="offers"
        queryKey="offers"
        onClose={() => { setImporting(false) }}
      />
    </div>
  )
}
