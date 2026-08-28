import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Badge, Button } from '@/components/ui'
import { DataTable, type DataTableColumn } from '@/components/tables/DataTable'
import { ConfirmDialog } from '@/components/modals/ConfirmDialog'
import { showToast } from '@/components/feedback'
import { extractErrorMessage } from '@/services/api/client'
import { formatDate } from '@/utils/formatDate'
import { useFlights } from '../hooks/useFlights'
import { useDeleteFlight } from '../hooks/useDeleteFlight'
import type { FlightDeal } from '../types'

export function FlightsListPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [pendingDelete, setPendingDelete] = useState<FlightDeal | null>(null)
  const { data, isLoading, isError, error, refetch } = useFlights(page)
  const deleteFlight = useDeleteFlight()

  const columns: DataTableColumn<FlightDeal>[] = [
    { key: 'title_en', header: 'Title (EN)', render: (row) => row.title_en },
    {
      key: 'route',
      header: 'Route',
      render: (row) => `${row.origin_airport_code} → ${row.destination_airport_code}`,
    },
    { key: 'trip_type', header: 'Trip', render: (row) => row.trip_type },
    { key: 'cabin_class', header: 'Cabin', render: (row) => row.cabin_class },
    { key: 'price_from', header: 'From (SAR)', render: (row) => row.price_from },
    { key: 'departure_date', header: 'Departs', render: (row) => formatDate(row.departure_date) },
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
          <Link to={`/flights/${row.slug}/edit`} className="text-navy-700 hover:underline">
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
    deleteFlight.mutate(pendingDelete.slug, {
      onSuccess: () => {
        showToast('Flight deal deleted.')
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
        <h1 className="text-xl font-semibold text-navy-900">Flights</h1>
        <Button
          onClick={() => {
            void navigate('/flights/new')
          }}
        >
          New Flight Deal
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
        emptyTitle="No flight deals yet"
        emptyDescription="Publish your first fare to show it on the public site."
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
        isConfirming={deleteFlight.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setPendingDelete(null)
        }}
      />
    </div>
  )
}
