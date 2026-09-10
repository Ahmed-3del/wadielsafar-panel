import { useCallback, useState } from 'react'
import Cropper, { type Area } from 'react-easy-crop'
import 'react-easy-crop/react-easy-crop.css'
import { Button } from '@/components/ui'
import { cropImageToFile } from './cropImageToFile'

interface ImageCropModalProps {
  /** An object URL for the file just picked — never a remote one, so there is
   *  no cross-origin request standing between this and a canvas. */
  objectUrl: string
  originalName: string
  aspect: number
  cropShape: 'rect' | 'round'
  onCancel: () => void
  onCropped: (file: File) => void
}

/*
 * Lets an editor choose which part of a photo actually appears, before it
 * ever reaches the site. Offered only for a field the site crops to fill a
 * frame — see IMAGE_SHAPES — because a field the site shows in full has
 * nothing here for cropping to decide.
 *
 * `cropShape` only changes the overlay drawn on screen while dragging — a
 * round window for a badge, a rectangular one for a photo. What gets uploaded
 * is always the plain rectangle either window frames; the site's own card
 * components already clip a badge to a circle in CSS.
 */
export function ImageCropModal({
  objectUrl,
  originalName,
  aspect,
  cropShape,
  onCancel,
  onCropped,
}: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [pixelCrop, setPixelCrop] = useState<Area | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setPixelCrop(areaPixels)
  }, [])

  const handleConfirm = async () => {
    if (!pixelCrop) return
    setIsProcessing(true)
    setError(null)
    try {
      const file = await cropImageToFile(objectUrl, pixelCrop, originalName)
      onCropped(file)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not apply that crop.')
      setIsProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="crop-modal-title"
        className="flex w-full max-w-lg flex-col gap-4 rounded-lg bg-white p-5 shadow-xl"
      >
        <div>
          <h2 id="crop-modal-title" className="text-base font-semibold text-navy-900">
            Choose what appears
          </h2>
          <p className="mt-1 text-sm text-stone-600">
            Drag to reposition, scroll or pinch to zoom. Only what is inside the frame is uploaded —
            everything else is left out, not just hidden.
          </p>
        </div>

        <div className="relative h-80 w-full overflow-hidden rounded-md bg-stone-900">
          <Cropper
            image={objectUrl}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            cropShape={cropShape}
            showGrid={cropShape === 'rect'}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>

        <label className="flex items-center gap-3 text-xs text-stone-500">
          Zoom
          <input
            type="range"
            min={1}
            max={4}
            step={0.01}
            value={zoom}
            onChange={(event) => { setZoom(Number(event.target.value)) }}
            className="flex-1"
            aria-label="Zoom"
          />
        </label>

        {error ? <p className="text-xs font-medium text-red-600">{error}</p> : null}

        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={() => { void handleConfirm() }} disabled={isProcessing || !pixelCrop}>
            {isProcessing ? 'Applying…' : 'Use this crop'}
          </Button>
        </div>
      </div>
    </div>
  )
}
