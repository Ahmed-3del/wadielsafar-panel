import { useId, useRef, useState } from 'react'
import { Input } from '@/components/ui'
import { mediaApi } from '@/features/media/services/mediaApi'
import { extractErrorMessage } from '@/services/api/client'

const ACCEPT = {
  image: '.jpg,.jpeg,.png,.webp,.avif,.gif',
  video: '.mp4,.webm,.mov,.m4v',
  // Certificates and licences. PDF only — see the media serializer for why.
  document: '.pdf',
} as const

interface MediaUploadFieldProps {
  id: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  accept: keyof typeof ACCEPT
  placeholder?: string
  hasError?: boolean
}

/*
 * A URL field you can also upload into. Every media field in the panel used to
 * be a bare text box, which meant an editor had to go to the library, upload,
 * copy a URL, come back and paste it — for every image on the page they were
 * editing.
 *
 * The text box stays, and stays authoritative: plenty of the client's imagery
 * lives on a CDN already, and an upload button that removed the ability to
 * paste would be a downgrade for them. Uploading simply fills it in.
 */
export function MediaUploadField({
  id,
  value,
  onChange,
  onBlur,
  accept,
  placeholder = 'https://…',
  hasError,
}: MediaUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [previewFailed, setPreviewFailed] = useState(false)
  const statusId = useId()

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadError(null)
    try {
      const asset = await mediaApi.upload(file, '', '')
      setPreviewFailed(false)
      // Resolve against the panel's origin: the API returns a root-relative
      // path when it is served from the same host, and the site needs an
      // absolute URL it can fetch from anywhere.
      onChange(new URL(asset.file, window.location.origin).href)
    } catch (error) {
      setUploadError(extractErrorMessage(error))
    } finally {
      setIsUploading(false)
      // Clear it, or choosing the same file twice after a failure is a no-op.
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start gap-2">
        {value && !previewFailed ? (
          <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-md border border-stone-200 bg-stone-50">
            {accept === 'image' ? (
              <img
                src={value}
                alt=""
                className="h-full w-full object-cover"
                onError={() => { setPreviewFailed(true) }}
              />
            ) : accept === 'video' ? (
              <video src={value} muted className="h-full w-full object-cover" />
            ) : (
              // A PDF has no cheap thumbnail, and the point of the swatch is
              // only to confirm something is attached.
              <span className="text-[10px] font-bold tracking-wide text-stone-500">PDF</span>
            )}
          </span>
        ) : null}

        <Input
          id={id}
          value={value}
          placeholder={placeholder}
          hasError={hasError}
          onChange={(event) => {
            setPreviewFailed(false)
            onChange(event.target.value)
          }}
          onBlur={onBlur}
        />

        <button
          type="button"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
          aria-describedby={statusId}
          className="shrink-0 rounded-md border border-stone-300 px-3 py-2 text-sm font-medium text-navy-800 transition-colors hover:bg-stone-50 disabled:opacity-50"
        >
          {isUploading ? 'Uploading…' : 'Upload'}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT[accept]}
          className="hidden"
          onChange={(event) => void handleFile(event)}
        />
      </div>

      <p id={statusId} className="sr-only" aria-live="polite">
        {isUploading ? 'Uploading file' : ''}
      </p>

      {uploadError ? (
        <p role="alert" className="text-xs font-medium text-red-600">
          {uploadError}
        </p>
      ) : null}
    </div>
  )
}
