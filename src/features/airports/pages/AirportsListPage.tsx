import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Badge, Button, Input } from '@/components/ui'
import { DataTable, type DataTableColumn } from '@/components/tables/DataTable'
import { ConfirmDialog } from '@/components/modals/ConfirmDialog'
import { showToast } from '@/components/feedback'
import { extractErrorMessage } from '@/services/api/client'
import { useAirports } from '../hooks/useAirports'
import { useDeleteAirport } from '../hooks/useDeleteAirport'
import type { Airport } from '../types'

export function AirportsListPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [pendingDelete, setPendingDelete] = useState<Airport | null>(null)
  const { data, isLoading, isError, error, refetch } = useAirports(page, search)
  const deleteAirport = useDeleteAirport()

  const columns: DataTableColumn<Airport>[] = [
    {
      key: 'iata_code',
      header: 'Code',
      render: (row) => (
        <span className="font-mono font-semibold tracking-wider text-navy-800">{row.iata_code}</span>
      ),
    },
    { key: 'city_en', header: 'City', render: (row) => row.city_en },
    { key: 'city_ar', header: 'المدينة', render: (row) => <span dir="rtl">{row.city_ar}</span> },
    { key: 'country_en', header: 'Country', render: (row) => row.country_en },
    {
      key: 'is_popular',
      header: 'Suggested',
      render: (row) =>
        row.is_popular ? <Badge tone="success">Yes</Badge> : <span className="text-stone-400">—</span>,
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (row) => (
        <Badge tone={row.is_active ? 'success' : 'neutral'}>
          {row.is_active ? 'Active' : 'Hidden'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <div className="flex gap-3">
          <Link to={`/airports/${row.id}/edit`} className="text-navy-700 hover:underline">
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
    deleteAirport.mutate(pendingDelete.id, {
      onSuccess: () => {
        showToast('Airport deleted.')
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
        <div>
          <h1 className="text-xl font-semibold text-navy-900">Airports</h1>
          <p className="mt-1 text-sm text-stone-500">
            What the departure and arrival pickers offer on the website.
          </p>
        </div>
        <Button
          onClick={() => {
            void navigate('/airports/new')
          }}
        >
          New Airport
        </Button>
      </div>

      {/* The catalogue is long enough that paging to an airport is not a real
          way to find one. */}
      <Input
        placeholder="Search by code, city or country…"
        value={search}
        onChange={(event) => {
          setSearch(event.target.value)
          setPage(1)
        }}
        className="max-w-sm"
      />

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
        emptyTitle={search ? 'Nothing matched' : 'No airports yet'}
        emptyDescription={
          search
            ? 'Try a city name or a three-letter code.'
            : 'The shipped catalogue loads with the database. Run seed_airports if it is missing.'
        }
      />

      {data && data.results.length > 0 && (
        <div className="flex items-center justify-between text-sm text-stone-500">
          <span>{data.count} total</span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              disabled={!data.previous}
              onClick={() => { setPage((current) => current - 1) }}
            >
              Previous
            </Button>
            <Button
              variant="ghost"
              disabled={!data.next}
              onClick={() => { setPage((current) => current + 1) }}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete this airport?"
        description="It disappears from the website's pickers immediately. To drop it from the pickers but keep the row, switch it to inactive instead."
        confirmLabel="Delete"
        isConfirming={deleteAirport.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => { setPendingDelete(null) }}
      />
    </div>
  )
}
