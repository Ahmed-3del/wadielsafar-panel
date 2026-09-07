import { useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui'
import { showToast } from '@/components/feedback'
import { extractErrorMessage } from '@/services/api/client'
import { importApi, type ImportReport } from '@/services/api/bulkImport'

interface ImportDialogProps {
  open: boolean
  /** The API path for this resource, e.g. "airports" or "cruises/ports". */
  resource: string
  /** What the sheet holds, in the plural: "airports", "hotels". */
  label: string
  /** Query key to refresh once rows have been written. */
  queryKey: string
  onClose: () => void
}

type Stage = 'choose' | 'checked' | 'done'

/**
 * Upload a spreadsheet, see what it would do, then let it happen.
 *
 * The rehearsal is the point. A spreadsheet is one act to whoever filled it in,
 * and "148 rows imported" is not something you can undo by hand — so the first
 * upload only ever asks the API what *would* change, and nothing is written
 * until someone reads that answer and presses the second button.
 */
export function ImportDialog({ open, resource, label, queryKey, onClose }: ImportDialogProps) {
  const queryClient = useQueryClient()
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [report, setReport] = useState<ImportReport | null>(null)
  const [stage, setStage] = useState<Stage>('choose')
  const [busy, setBusy] = useState(false)

  if (!open) return null

  const api = importApi(resource)

  const reset = () => {
    setFile(null)
    setReport(null)
    setStage('choose')
    setBusy(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  const close = () => {
    reset()
    onClose()
  }

  const download = async () => {
    try {
      const blob = await api.downloadTemplate()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${label.replace(/\s+/g, '-').toLowerCase()}-template.xlsx`
      link.click()
      URL.revokeObjectURL(url)
    } catch (error: unknown) {
      showToast(extractErrorMessage(error), 'error')
    }
  }

  const send = async (dryRun: boolean) => {
    if (!file) return
    setBusy(true)
    try {
      const result = await api.upload(file, dryRun)
      setReport(result)
      setStage(dryRun ? 'checked' : 'done')
      if (!dryRun) {
        void queryClient.invalidateQueries({ queryKey: [queryKey] })
        showToast(`${result.created} added, ${result.updated} updated.`)
      }
    } catch (error: unknown) {
      // A rejected sheet answers 400 with the same report shape, so the row
      // errors are shown in the table below rather than as one vague toast.
      const body = (error as { response?: { data?: ImportReport & { detail?: string } } }).response
        ?.data
      if (body?.errors) {
        setReport(body)
        setStage('checked')
      } else {
        showToast(extractErrorMessage(error), 'error')
      }
    } finally {
      setBusy(false)
    }
  }

  const errors = report?.errors ?? []
  const clean = stage === 'checked' && errors.length === 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="import-dialog-title"
        className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-lg bg-white p-5 shadow-xl"
      >
        <h2 id="import-dialog-title" className="text-base font-semibold text-navy-900">
          Import {label} from a spreadsheet
        </h2>
        <p className="mt-1 text-sm text-stone-600">
          Rows are matched on a key column: an existing one is updated, a new one is added.
          Nothing is ever deleted, and if any row is wrong nothing at all is saved.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button variant="secondary" onClick={() => void download()}>
            Download template
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.csv"
            className="block w-full max-w-xs text-sm text-stone-700 file:mr-3 file:rounded-md file:border-0 file:bg-navy-900 file:px-3 file:py-2 file:text-sm file:text-white hover:file:bg-navy-800"
            onChange={(event) => {
              setFile(event.target.files?.[0] ?? null)
              setReport(null)
              setStage('choose')
            }}
          />
        </div>

        {report && (
          <div className="mt-4 min-h-0 flex-1 overflow-y-auto rounded-md border border-stone-200 p-3">
            {errors.length > 0 ? (
              <>
                <p className="text-sm font-semibold text-red-700">
                  {errors.length} {errors.length === 1 ? 'problem' : 'problems'} — nothing was saved.
                </p>
                <table className="mt-2 w-full text-left text-sm">
                  <thead className="text-xs uppercase text-stone-500">
                    <tr>
                      <th className="py-1 pr-3">Row</th>
                      <th className="py-1 pr-3">Column</th>
                      <th className="py-1">What is wrong</th>
                    </tr>
                  </thead>
                  <tbody>
                    {errors.slice(0, 100).map((error, index) => (
                      <tr key={`${error.row}-${error.column}-${index}`} className="border-t border-stone-100">
                        <td className="py-1 pr-3 tabular-nums">{error.row}</td>
                        <td className="py-1 pr-3 font-mono text-xs">{error.column}</td>
                        <td className="py-1 text-stone-700">{error.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {errors.length > 100 && (
                  <p className="mt-2 text-xs text-stone-500">
                    …and {errors.length - 100} more. Fix these first — some may share a cause.
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-stone-700">
                {stage === 'done' ? (
                  <>
                    Saved: <strong>{report.created}</strong> added,{' '}
                    <strong>{report.updated}</strong> updated.
                  </>
                ) : (
                  <>
                    This sheet is good. It would add <strong>{report.created}</strong> and update{' '}
                    <strong>{report.updated}</strong> {label}. Nothing has been saved yet.
                  </>
                )}
              </p>
            )}
          </div>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={close} disabled={busy}>
            {stage === 'done' ? 'Close' : 'Cancel'}
          </Button>
          {stage !== 'done' &&
            (clean ? (
              <Button onClick={() => void send(false)} disabled={busy}>
                {busy ? 'Saving…' : `Import ${(report?.created ?? 0) + (report?.updated ?? 0)} rows`}
              </Button>
            ) : (
              <Button onClick={() => void send(true)} disabled={!file || busy}>
                {busy ? 'Checking…' : 'Check the file'}
              </Button>
            ))}
        </div>
      </div>
    </div>
  )
}
