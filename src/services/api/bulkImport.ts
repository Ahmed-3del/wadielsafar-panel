import { apiClient } from '@/services/api/client'

export interface ImportRowError {
  row: number
  column: string
  message: string
}

export interface ImportPreviewRow {
  row: number
  key: string
  action: 'create' | 'update'
}

export interface ImportReport {
  created: number
  updated: number
  errors: ImportRowError[]
  preview: ImportPreviewRow[]
}

/**
 * The two endpoints every importable resource has. `resource` is the API path
 * the panel already uses for it — "airports", "cruises/ports" — so there is no
 * second table mapping screens to URLs.
 */
export function importApi(resource: string) {
  const base = `/${resource}/`

  return {
    /** The blank spreadsheet, as a file the browser can save. */
    downloadTemplate: () =>
      apiClient
        .get<Blob>(`${base}import-template/`, { responseType: 'blob' })
        .then((res) => res.data),

    /**
     * Send a filled-in sheet. `dryRun` asks what would happen without writing,
     * which is what the dialog does first — an import is one act to whoever
     * sent the file, and they should see it before it happens.
     */
    upload: (file: File, dryRun: boolean) => {
      const body = new FormData()
      body.append('file', file)
      body.append('dry_run', String(dryRun))
      return apiClient
        .post<ImportReport>(`${base}import/`, body)
        .then((res) => res.data)
    },
  }
}
