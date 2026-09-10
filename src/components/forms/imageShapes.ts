/*
 * How the website actually frames an uploaded image, so MediaUploadField's
 * preview matches what a visitor will see rather than a generic square
 * swatch, and so the crop step it offers frames the same rectangle the site
 * will later put on screen. A crop tighter or looser than the editor expected
 * is a surprise best caught here, before publishing, not after.
 *
 * Every shape here is a real one in use on the site today — see the frontend
 * component named in each comment. Kept as a closed set rather than bare
 * `aspect`/`fit` props at the call site: a shape decided per-field could drift
 * from what the site actually does the next time that card is redesigned,
 * where a name shared between the two is a comment away from being caught.
 * Lives in its own module, not MediaUploadField.tsx, because that file may
 * only export the component — react-refresh's rule for it.
 */
export const IMAGE_SHAPES = {
  // PackageCard, CruiseCard, HotelCard, OfferCard, VisaCard, ServicesGrid.
  photo: {
    box: 'aspect-video rounded-lg',
    fit: 'cover' as const,
    // Set only where the site actually crops to fill a frame — badge and
    // photo below. A crop step for `logo`, which the site never crops, would
    // ask an editor to frame something nothing on the site trims to fit.
    crop: { aspect: 16 / 9, shape: 'rect' as const },
    hint: 'Shown as a wide photo, cropped to fill the frame — the middle of the image is kept, the edges may be trimmed.',
  },
  // VisaCountry.flag_image on the visa card's circular badge, and
  // Testimonial.avatar_image.
  badge: {
    box: 'aspect-square rounded-full',
    fit: 'cover' as const,
    crop: { aspect: 1, shape: 'round' as const },
    hint: 'Shown as a small round badge, cropped to fill it — a close-up, centred image works best.',
  },
  // Partner and certificate logos, an airline mark: never cropped, because a
  // logo cut at the edge is a logo nobody recognises.
  logo: {
    box: 'aspect-[3/2] rounded-md',
    fit: 'contain' as const,
    crop: null,
    hint: 'Shown at its own shape, in full — never cropped. A transparent PNG sits best on any background.',
  },
} as const

export type ImageShape = keyof typeof IMAGE_SHAPES
