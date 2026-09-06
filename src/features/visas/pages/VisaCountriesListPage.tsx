import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Badge, Button } from '@/components/ui'
import { DataTable, type DataTableColumn } from '@/components/tables/DataTable'
import { ConfirmDialog } from '@/components/modals/ConfirmDialog'
import { showToast } from '@/components/feedback'
import { extractErrorMessage } from '@/services/api/client'
import { useVisaCountries } from '../hooks/useVisaCountries'
import { useDeleteVisaCountry } from '../hooks/useDeleteVisaCountry'
import type { VisaCountry } from '../types'

export function VisaCountriesListPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [pendingDelete, setPendingDelete] = useState<VisaCountry | null>(null)
  const { data, isLoading, isError, error, refetch } = useVisaCountries(page)
  const remove = useDeleteVisaCountry()

  const columns: DataTableColumn<VisaCountry>[] = [
    {
      key: 'cover_image',
      header: 'Photo',
      // The thumbnail is the point of this screen: it is how someone sees at a
      // glance which countries still ship a blank visa card.
      render: (row) =>
        row.cover_image ? (
          <img
            src={row.cover_image}
            alt=""
            className="h-10 w-16 rounded object-cover"
            loading="lazy"
          />
        ) : (
          <span className="text-xs text-stone-400">No photo</span>
        ),
    },
    { key: 'name_en', header: 'Country', render: (row) => row.name_en },
    { key: 'name_ar', header: 'Arabic name', render: (row) => <span dir="rtl">{row.name_ar}</span> },
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
          <Link to={`/visa-countries/${row.id}/edit`} className="text-navy-700 hover:underline">
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
        showToast('Country deleted.')
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
          <h1 className="text-xl font-semibold text-navy-900">Visa countries</h1>
          <p className="mt-1 text-sm text-stone-500">
            One photo per country dresses every visa card it issues.
          </p>
        </div>
        <Button
          onClick={() => {
            void navigate('/visa-countries/new')
          }}
        >
          New Country
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
        emptyTitle="No countries yet"
        emptyDescription="Add a country before adding the visa types it issues."
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
        title="Delete this country?"
        description="Every visa type issued by this country goes with it. To take it off the site without losing the visas, switch it to inactive instead."
        confirmLabel="Delete"
        isConfirming={remove.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => { setPendingDelete(null) }}
      />
    </div>
  )
}
