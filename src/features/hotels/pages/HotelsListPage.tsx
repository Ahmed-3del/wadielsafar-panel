import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Badge, Button } from '@/components/ui'
import { ImportDialog } from '@/components/modals/ImportDialog'
import { DataTable, type DataTableColumn } from '@/components/tables/DataTable'
import { ConfirmDialog } from '@/components/modals/ConfirmDialog'
import { showToast } from '@/components/feedback'
import { extractErrorMessage } from '@/services/api/client'
import { useHotels } from '../hooks/useHotels'
import { useDeleteHotel } from '../hooks/useDeleteHotel'
import type { Hotel } from '../types'

export function HotelsListPage() {
  const navigate = useNavigate()
  const [importing, setImporting] = useState(false)
  const [page, setPage] = useState(1)
  const [pendingDelete, setPendingDelete] = useState<Hotel | null>(null)
  const { data, isLoading, isError, error, refetch } = useHotels(page)
  const deleteHotel = useDeleteHotel()

  const columns: DataTableColumn<Hotel>[] = [
    { key: 'name_en', header: 'Name (EN)', render: (row) => row.name_en },
    { key: 'destination', header: 'Destination', render: (row) => row.destination.name_en },
    { key: 'star_rating', header: 'Stars', render: (row) => '★'.repeat(row.star_rating) },
    {
      key: 'amenities',
      header: 'Amenities',
      render: (row) =>
        row.amenities.length > 0 ? row.amenities.map((amenity) => amenity.name_en).join(', ') : '—',
    },
    { key: 'price_per_night_from', header: 'From (SAR)', render: (row) => row.price_per_night_from },
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
          {/* Detail routes are keyed by slug for this domain, not by id. */}
          <Link to={`/hotels/${row.slug}/edit`} className="text-navy-700 hover:underline">
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
    deleteHotel.mutate(pendingDelete.slug, {
      onSuccess: () => {
        showToast('Hotel deleted.')
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
        <h1 className="text-xl font-semibold text-navy-900">Hotels</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => { setImporting(true) }}>
            Import
          </Button>
          <Button
            onClick={() => {
              void navigate('/hotels/new')
            }}
          >
            New Hotel
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
        emptyTitle="No hotels yet"
        emptyDescription="Add your first property to show it on the public site."
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
        isConfirming={deleteHotel.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setPendingDelete(null)
        }}
      />

      <ImportDialog
        open={importing}
        resource="hotels"
        label="hotels"
        queryKey="hotels"
        onClose={() => { setImporting(false) }}
      />
    </div>
  )
}
