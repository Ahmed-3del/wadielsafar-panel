import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Badge } from '@/components/ui'
import { DataTable, type DataTableColumn } from '@/components/tables/DataTable'
import { ConfirmDialog } from '@/components/modals/ConfirmDialog'
import { showToast } from '@/components/feedback'
import { extractErrorMessage } from '@/services/api/client'
import { usePageHeroes } from '../hooks/usePageHeroes'
import { useDeletePageHero } from '../hooks/useDeletePageHero'
import type { PageHero } from '../types'

const MEDIA_TONE = {
  NONE: 'neutral',
  IMAGE: 'info',
  VIDEO: 'success',
} as const

export function PageHeroesListPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [pendingDelete, setPendingDelete] = useState<PageHero | null>(null)
  const { data, isLoading, isError, error, refetch } = usePageHeroes(page)
  const deleteHero = useDeletePageHero()

  const columns: DataTableColumn<PageHero>[] = [
    { key: 'page_key', header: 'Page', render: (row) => row.page_key },
    {
      key: 'media_type',
      header: 'Background',
      render: (row) => <Badge tone={MEDIA_TONE[row.media_type]}>{row.media_type}</Badge>,
    },
    {
      key: 'overlay_opacity',
      header: 'Overlay',
      render: (row) => (row.media_type === 'NONE' ? '—' : `${row.overlay_opacity}%`),
    },
    {
      key: 'title_en',
      header: 'Title override',
      render: (row) => row.title_en || <span className="text-stone-400">—</span>,
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
          <Link to={`/pages/${row.page_key}/edit`} className="text-navy-700 hover:underline">
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
    deleteHero.mutate(pendingDelete.page_key, {
      onSuccess: () => {
        showToast('Page hero deleted.')
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
          <h1 className="text-xl font-semibold text-navy-900">Page heroes</h1>
          <p className="mt-1 text-sm text-stone-500">
            Background image or video, and optional headline, for each page on the website.
          </p>
        </div>
        <Button
          onClick={() => {
            void navigate('/pages/new')
          }}
        >
          New hero
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
        emptyTitle="No page heroes yet"
        emptyDescription="Pages without a hero fall back to the brand gradient."
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
        title={`Delete the ${pendingDelete?.page_key ?? ''} hero?`}
        description="That page will fall back to the brand gradient."
        confirmLabel="Delete"
        isConfirming={deleteHero.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setPendingDelete(null)
        }}
      />
    </div>
  )
}
