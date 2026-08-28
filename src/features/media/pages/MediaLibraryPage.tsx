import { useRef, useState } from 'react'
import { Button, Card, Input } from '@/components/ui'
import { FormField } from '@/components/forms/FormField'
import { ConfirmDialog } from '@/components/modals/ConfirmDialog'
import { Spinner, ErrorState, EmptyState, showToast } from '@/components/feedback'
import { extractErrorMessage } from '@/services/api/client'
import { useMediaAssets } from '../hooks/useMediaAssets'
import { useUploadMedia } from '../hooks/useUploadMedia'
import { useDeleteMedia } from '../hooks/useDeleteMedia'
import type { MediaAsset } from '../types'

/*
 * The library exists to close a loop: every other form in this panel asks for
 * an image *URL*. Without somewhere to upload a file and copy its URL, editors
 * have to find external hosting for their own photographs.
 */
export function MediaLibraryPage() {
  const [page, setPage] = useState(1)
  const [altAr, setAltAr] = useState('')
  const [altEn, setAltEn] = useState('')
  const [pendingDelete, setPendingDelete] = useState<MediaAsset | null>(null)
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data, isLoading, isError, error, refetch } = useMediaAssets(page)
  const upload = useUploadMedia()
  const remove = useDeleteMedia()

  const handleUpload = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const file = fileInputRef.current?.files?.[0]
    if (!file) {
      showToast('Choose a file first.', 'error')
      return
    }

    upload.mutate(
      { file, altTextAr: altAr, altTextEn: altEn },
      {
        onSuccess: () => {
          showToast('File uploaded.')
          setAltAr('')
          setAltEn('')
          if (fileInputRef.current) fileInputRef.current.value = ''
        },
        onError: (err: unknown) => {
          showToast(extractErrorMessage(err), 'error')
        },
      },
    )
  }

  const handleCopy = async (asset: MediaAsset) => {
    const absolute = new URL(asset.file, window.location.origin).href
    try {
      await navigator.clipboard.writeText(absolute)
      setCopiedId(asset.id)
      window.setTimeout(() => { setCopiedId(null) }, 2000)
    } catch {
      // Clipboard access is denied in some browsers and over plain HTTP; the
      // URL is selectable in the field below, so this is not a dead end.
      showToast('Could not copy — select the URL and copy it manually.', 'error')
    }
  }

  const handleConfirmDelete = () => {
    if (!pendingDelete) return
    remove.mutate(pendingDelete.id, {
      onSuccess: () => {
        showToast('File deleted.')
        setPendingDelete(null)
      },
      onError: (err: unknown) => {
        showToast(extractErrorMessage(err), 'error')
      },
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-navy-900">Media library</h1>
        <p className="mt-1 text-sm text-stone-500">
          Everything uploaded anywhere in the panel lands here. Images up to 8 MB, video up to 64 MB.
        </p>
      </div>

      <Card>
        <form className="flex flex-col gap-4" onSubmit={handleUpload}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FormField label="File" htmlFor="file" required>
              <input
                id="file"
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.avif,.gif,.mp4,.webm,.mov,.m4v"
                className="block w-full text-sm text-stone-700 file:mr-3 file:rounded-md file:border-0 file:bg-navy-700 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-navy-800"
              />
            </FormField>
            <FormField label="Alt text (Arabic)" htmlFor="alt_ar">
              <Input
                id="alt_ar"
                dir="rtl"
                value={altAr}
                onChange={(e) => { setAltAr(e.target.value) }}
              />
            </FormField>
            <FormField
              label="Alt text (English)"
              htmlFor="alt_en"
              hint="Describes the image for screen readers and search engines."
            >
              <Input id="alt_en" value={altEn} onChange={(e) => { setAltEn(e.target.value) }} />
            </FormField>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={upload.isPending}>
              {upload.isPending ? 'Uploading…' : 'Upload'}
            </Button>
          </div>
        </form>
      </Card>

      {isLoading && <Spinner label="Loading media…" />}
      {isError && (
        <ErrorState
          message={error ? extractErrorMessage(error) : 'Could not load the library.'}
          onRetry={() => { void refetch() }}
        />
      )}

      {data && data.results.length === 0 && (
        <EmptyState
          title="Nothing uploaded yet"
          description="Uploaded files appear here with a URL you can paste into any image field."
        />
      )}

      {data && data.results.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.results.map((asset) => {
            return (
              <Card key={asset.id} className="flex flex-col gap-3">
                <div className="grid h-40 place-items-center overflow-hidden rounded-md bg-stone-100">
                  {asset.kind === 'IMAGE' && (
                    <img
                      src={asset.file}
                      alt={asset.alt_text_en || ''}
                      className="h-full w-full object-cover"
                    />
                  )}
                  {asset.kind === 'VIDEO' && (
                    /* muted + playsInline so the browser will render a frame
                       rather than a black box with no poster. */
                    <video
                      src={asset.file}
                      muted
                      playsInline
                      preload="metadata"
                      controls
                      className="h-full w-full object-cover"
                    />
                  )}
                  {asset.kind === 'OTHER' && (
                    <span className="text-sm text-stone-500">No preview</span>
                  )}
                </div>
                <Input readOnly value={asset.file} onFocus={(e) => { e.target.select() }} />
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => { void handleCopy(asset) }}
                  >
                    {copiedId === asset.id ? 'Copied' : 'Copy URL'}
                  </Button>
                  <Button variant="danger" onClick={() => { setPendingDelete(asset) }}>
                    Delete
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}

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
        title="Delete this file?"
        description="Anything already pointing at its URL will stop loading."
        confirmLabel="Delete"
        isConfirming={remove.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => { setPendingDelete(null) }}
      />
    </div>
  )
}
