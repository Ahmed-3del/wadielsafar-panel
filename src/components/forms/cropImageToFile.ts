/*
 * Cuts one rectangle out of a picked file and hands back a new file holding
 * just that rectangle, at the source's own resolution — react-easy-crop
 * reports the crop in the original image's pixel coordinates, so drawing at
 * that size is what keeps a crop from a large photo sharp rather than
 * shrinking it to whatever the on-screen cropper happened to be sized at.
 *
 * A round `cropShape` only changes what the cropper draws on screen while an
 * editor is dragging it, not what comes out of this function: the site's own
 * card components already clip a badge image to a circle in CSS
 * (`rounded-full overflow-hidden`), so the file uploaded here only ever needs
 * to be the plain rectangle a circle would be inscribed in.
 */

export interface PixelCrop {
  x: number
  y: number
  width: number
  height: number
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => { resolve(image) })
    image.addEventListener('error', () => { reject(new Error('Could not read that image.')) })
    image.src = src
  })
}

/** A name the backend's extension-based classifier reads as an image, whatever
 *  the original file was called. */
function croppedName(originalName: string): string {
  const stem = originalName.replace(/\.[^./\\]+$/, '')
  return `${stem || 'image'}-cropped.jpg`
}

export async function cropImageToFile(
  objectUrl: string,
  crop: PixelCrop,
  originalName: string,
): Promise<File> {
  const image = await loadImage(objectUrl)
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(crop.width))
  canvas.height = Math.max(1, Math.round(crop.height))

  const context = canvas.getContext('2d')
  if (!context) throw new Error('This browser cannot crop images.')

  context.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    canvas.width,
    canvas.height,
  )

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/jpeg', 0.92)
  })
  if (!blob) throw new Error('Could not export the crop.')

  return new File([blob], croppedName(originalName), { type: 'image/jpeg' })
}
