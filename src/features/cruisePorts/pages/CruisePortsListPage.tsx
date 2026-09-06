import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Badge, Button, Input } from '@/components/ui'
import { DataTable, type DataTableColumn } from '@/components/tables/DataTable'
import { ConfirmDialog } from '@/components/modals/ConfirmDialog'
import { showToast } from '@/components/feedback'
import { extractErrorMessage } from '@/services/api/client'
import { useCruisePorts } from '../hooks/useCruisePorts'
import { useDeleteCruisePort } from '../hooks/useDeleteCruisePort'
import type { CruisePort } from '@/features/cruises/types'

export function CruisePortsListPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [pendingDelete, setPendingDelete] = useState<CruisePort | null>(null)
  const { data, isLoading, isError, error, refetch } = useCruisePorts(page, search)
  const remove = useDeleteCruisePort()

  const columns: DataTableColumn<CruisePort>[] = [
    {
      key: 'city_en',
      header: 'City',
      render: (row) => (
        <span className="flex items-center gap-2">
          {row.country_code ? (
            <img
              src={`https://flagcdn.com/w40/${row.country_code.toLowerCase()}.png`}
              alt=""
              className="h-4 w-6 rounded-sm object-cover"
              loading="lazy"
            />
          ) : null}
          {row.city_en}
        </span>
      ),
    },
    { key: 'name_en', header: 'Port', render: (row) => row.name_en },
    { key: 'country_en', header: 'Country', render: (row) => row.country_en },
    { key: 'code', header: 'Code', render: (row) => <span dir="ltr">{row.code}</span> },
    {
      key: 'is_popular',
      header: 'Suggested',
      render: (row) => (row.is_popular ? <Badge tone="success">Yes</Badge> : '—'),
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
          <Link to={`/cruise-ports/${row.id}/edit`} className="text-navy-700 hover:underline">
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
    remove.mutate(pendingDelete.id, {
      onSuccess: () => {
        showToast('Port deleted.')
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
          <h1 className="text-xl font-semibold text-navy-900">Cruise ports</h1>
          <p className="mt-1 text-sm text-stone-500">
            What the website&rsquo;s cruise search offers: a country first, then one of its ports.
          </p>
        </div>
        <Button
          onClick={() => {
            void navigate('/cruise-ports/new')
          }}
        >
          New Port
        </Button>
      </div>

      <Input
        aria-label="Search ports"
        placeholder="Search a city, port or country…"
        value={search}
        onChange={(event) => {
          setSearch(event.target.value)
          setPage(1)
        }}
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
        emptyTitle="No ports match"
        emptyDescription="The shipped catalogue covers the world's main cruise ports. Add one if a sailing leaves from somewhere else."
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
        title="Delete this port?"
        description="Sailings linked to it lose the link and stop answering the website's country-and-port search. To take it out of the pickers without that, switch it to inactive instead."
        confirmLabel="Delete"
        isConfirming={remove.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => { setPendingDelete(null) }}
      />
    </div>
  )
}
