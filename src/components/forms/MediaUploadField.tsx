import { useEffect, useId, useRef, useState } from 'react'
import { Input } from '@/components/ui'
import { mediaApi } from '@/features/media/services/mediaApi'
import { extractErrorMessage } from '@/services/api/client'
import { IMAGE_SHAPES, type ImageShape } from './imageShapes'
import { ImageCropModal } from './ImageCropModal'

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
  /** How this field's image is framed on the site. Adds a full-width preview
   *  at that exact shape below the field, plus a caption naming it — so an
   *  editor sees the real crop, and knows what to prepare, before it goes
   *  live. Where the site crops to fill that shape, uploading a file first
   *  opens a crop step so the editor picks which part of it survives, rather
   *  than leaving that to wherever `object-cover` happens to centre itself.
   *  Omit for a field the site does not crop to any particular shape. */
  shape?: ImageShape
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
  shape,
}: MediaUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [previewFailed, setPreviewFailed] = useState(false)
  // The file just picked, waiting on a crop before it is sent anywhere. Kept
  // as the object URL built from it, not the File alone, so the modal and the
  // eventual canvas read the same picture and that URL can be revoked in one
  // place once it is no longer needed.
  const [pendingCrop, setPendingCrop] = useState<{ file: File; objectUrl: string } | null>(null)
  const statusId = useId()
  const spec = shape ? IMAGE_SHAPES[shape] : null

  // Closing the modal normally already revokes this; here for the one path
  // that skips that — navigating away, or the field unmounting, mid-crop.
  // Revoking twice is harmless, so no coordination with the explicit close
  // is needed.
  useEffect(() => {
    return () => {
      if (pendingCrop) URL.revokeObjectURL(pendingCrop.objectUrl)
    }
  }, [pendingCrop])

  const uploadFile = async (file: File) => {
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
    }
  }

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    // Clear it here rather than after the upload settles: the file is already
    // captured above, and clearing early is what lets choosing the same file
    // twice — after cancelling a crop, say — register as a change at all.
    if (inputRef.current) inputRef.current.value = ''
    if (!file) return

    if (spec?.crop) {
      // A field the site crops to fill a frame: let the editor choose which
      // part survives before a single byte leaves the browser, rather than
      // uploading first and hoping `object-cover`'s centre crop happens to be
      // the right part of the photo.
      setPendingCrop({ file, objectUrl: URL.createObjectURL(file) })
      return
    }
    void uploadFile(file)
  }

  const closeCropModal = () => {
    if (pendingCrop) URL.revokeObjectURL(pendingCrop.objectUrl)
    setPendingCrop(null)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start gap-2">
        {value && !previewFailed && !spec ? (
          // The small swatch, kept exactly as it was, for a field with no
          // shape of its own — the big preview below replaces it rather than
          // sitting beside it once there is one.
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
          onChange={handleFile}
        />
      </div>

      {spec ? (
        <div className="flex items-start gap-3 rounded-md border border-stone-200 bg-stone-50 p-2.5">
          <div
            className={`grid w-24 shrink-0 place-items-center overflow-hidden border border-stone-200 bg-white ${spec.box}`}
          >
            {value && !previewFailed ? (
              <img
                src={value}
                alt=""
                className={spec.fit === 'cover' ? 'h-full w-full object-cover' : 'h-full w-full object-contain p-1'}
                onError={() => { setPreviewFailed(true) }}
              />
            ) : (
              // Nothing to preview yet, or the URL does not resolve — the
              // frame itself is still the point: it shows the shape before a
              // single byte has uploaded, which is what tells an editor what
              // to crop before they go looking for a photo.
              <span className="px-2 text-center text-[10px] text-stone-400">No image yet</span>
            )}
          </div>
          <p className="pt-0.5 text-xs leading-5 text-stone-500">
            {previewFailed && value
              ? "That URL didn't load as an image — the shape below is illustrative until it does."
              : spec.hint}
          </p>
        </div>
      ) : null}

      <p id={statusId} className="sr-only" aria-live="polite">
        {isUploading ? 'Uploading file' : ''}
      </p>

      {uploadError ? (
        <p role="alert" className="text-xs font-medium text-red-600">
          {uploadError}
        </p>
      ) : null}

      {pendingCrop && spec?.crop ? (
        <ImageCropModal
          objectUrl={pendingCrop.objectUrl}
          originalName={pendingCrop.file.name}
          aspect={spec.crop.aspect}
          cropShape={spec.crop.shape}
          onCancel={closeCropModal}
          onCropped={(croppedFile) => {
            closeCropModal()
            void uploadFile(croppedFile)
          }}
        />
      ) : null}
    </div>
  )
}
