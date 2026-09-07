import { lazy, Suspense, type ReactNode } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthLayout } from '@/layouts/AuthLayout'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Spinner } from '@/components/feedback'
import { LoginPage } from '@/features/authentication'
import { ADMIN_ROLES } from '@/constants/roles'
import { RequireAuth } from './RequireAuth'
import { RequireRole } from './RequireRole'

// Feature pages are lazy-loaded so the initial bundle stays flat as modules
// are added — the panel is expected to grow to dozens of them.
const DashboardPage = lazy(() =>
  import('@/features/dashboard').then((m) => ({ default: m.DashboardPage })),
)
const InquiriesListPage = lazy(() =>
  import('@/features/inquiries').then((m) => ({ default: m.InquiriesListPage })),
)
const InquiryFieldsListPage = lazy(() =>
  import('@/features/inquiryFields').then((m) => ({ default: m.InquiryFieldsListPage })),
)
const InquiryFieldFormPage = lazy(() =>
  import('@/features/inquiryFields').then((m) => ({ default: m.InquiryFieldFormPage })),
)
const InquiryServiceTypesListPage = lazy(() =>
  import('@/features/inquiryServiceTypes').then((m) => ({
    default: m.InquiryServiceTypesListPage,
  })),
)
const InquiryServiceTypeFormPage = lazy(() =>
  import('@/features/inquiryServiceTypes').then((m) => ({
    default: m.InquiryServiceTypeFormPage,
  })),
)
const InquiryDetailPage = lazy(() =>
  import('@/features/inquiries').then((m) => ({ default: m.InquiryDetailPage })),
)
const DestinationsListPage = lazy(() =>
  import('@/features/destinations').then((m) => ({ default: m.DestinationsListPage })),
)
const DestinationFormPage = lazy(() =>
  import('@/features/destinations').then((m) => ({ default: m.DestinationFormPage })),
)
const PackagesListPage = lazy(() =>
  import('@/features/packages').then((m) => ({ default: m.PackagesListPage })),
)
const PackageFormPage = lazy(() =>
  import('@/features/packages').then((m) => ({ default: m.PackageFormPage })),
)
const VisasListPage = lazy(() =>
  import('@/features/visas').then((m) => ({ default: m.VisasListPage })),
)
const VisaFormPage = lazy(() =>
  import('@/features/visas').then((m) => ({ default: m.VisaFormPage })),
)
const VisaCountriesListPage = lazy(() =>
  import('@/features/visas').then((m) => ({ default: m.VisaCountriesListPage })),
)
const VisaCountryFormPage = lazy(() =>
  import('@/features/visas').then((m) => ({ default: m.VisaCountryFormPage })),
)
const ServicesListPage = lazy(() =>
  import('@/features/services').then((m) => ({ default: m.ServicesListPage })),
)
const ServiceFormPage = lazy(() =>
  import('@/features/services').then((m) => ({ default: m.ServiceFormPage })),
)
const FlightsListPage = lazy(() =>
  import('@/features/flights').then((m) => ({ default: m.FlightsListPage })),
)
const FlightFormPage = lazy(() =>
  import('@/features/flights').then((m) => ({ default: m.FlightFormPage })),
)
const HotelsListPage = lazy(() =>
  import('@/features/hotels').then((m) => ({ default: m.HotelsListPage })),
)
const HotelFormPage = lazy(() =>
  import('@/features/hotels').then((m) => ({ default: m.HotelFormPage })),
)
const CruisesListPage = lazy(() =>
  import('@/features/cruises').then((m) => ({ default: m.CruisesListPage })),
)
const CruiseFormPage = lazy(() =>
  import('@/features/cruises').then((m) => ({ default: m.CruiseFormPage })),
)
const CruisePortsListPage = lazy(() =>
  import('@/features/cruisePorts').then((m) => ({ default: m.CruisePortsListPage })),
)
const CruisePortFormPage = lazy(() =>
  import('@/features/cruisePorts').then((m) => ({ default: m.CruisePortFormPage })),
)
const OffersListPage = lazy(() =>
  import('@/features/offers').then((m) => ({ default: m.OffersListPage })),
)
const OfferFormPage = lazy(() =>
  import('@/features/offers').then((m) => ({ default: m.OfferFormPage })),
)
const BookingsPage = lazy(() =>
  import('@/features/bookings').then((m) => ({ default: m.BookingsPage })),
)
const TestimonialsListPage = lazy(() =>
  import('@/features/testimonials').then((m) => ({ default: m.TestimonialsListPage })),
)
const TestimonialFormPage = lazy(() =>
  import('@/features/testimonials').then((m) => ({ default: m.TestimonialFormPage })),
)
const NavigationListPage = lazy(() =>
  import('@/features/navigation').then((m) => ({ default: m.NavigationListPage })),
)
const NavItemFormPage = lazy(() =>
  import('@/features/navigation').then((m) => ({ default: m.NavItemFormPage })),
)
const PartnersListPage = lazy(() =>
  import('@/features/partners').then((m) => ({ default: m.PartnersListPage })),
)
const PartnerFormPage = lazy(() =>
  import('@/features/partners').then((m) => ({ default: m.PartnerFormPage })),
)
const AirportsListPage = lazy(() =>
  import('@/features/airports').then((m) => ({ default: m.AirportsListPage })),
)
const AirportFormPage = lazy(() =>
  import('@/features/airports').then((m) => ({ default: m.AirportFormPage })),
)
const CertificatesListPage = lazy(() =>
  import('@/features/certificates').then((m) => ({ default: m.CertificatesListPage })),
)
const CertificateFormPage = lazy(() =>
  import('@/features/certificates').then((m) => ({ default: m.CertificateFormPage })),
)
const BranchesListPage = lazy(() =>
  import('@/features/branches').then((m) => ({ default: m.BranchesListPage })),
)
const BranchFormPage = lazy(() =>
  import('@/features/branches').then((m) => ({ default: m.BranchFormPage })),
)
const PromotionsListPage = lazy(() =>
  import('@/features/promotions').then((m) => ({ default: m.PromotionsListPage })),
)
const PromotionFormPage = lazy(() =>
  import('@/features/promotions').then((m) => ({ default: m.PromotionFormPage })),
)
const SocialLinksListPage = lazy(() =>
  import('@/features/socialLinks').then((m) => ({ default: m.SocialLinksListPage })),
)
const SocialLinkFormPage = lazy(() =>
  import('@/features/socialLinks').then((m) => ({ default: m.SocialLinkFormPage })),
)
const HomeSectionsPage = lazy(() =>
  import('@/features/homeSections').then((m) => ({ default: m.HomeSectionsPage })),
)
const PageHeroesListPage = lazy(() =>
  import('@/features/pages').then((m) => ({ default: m.PageHeroesListPage })),
)
const PageHeroFormPage = lazy(() =>
  import('@/features/pages').then((m) => ({ default: m.PageHeroFormPage })),
)
const MediaLibraryPage = lazy(() =>
  import('@/features/media').then((m) => ({ default: m.MediaLibraryPage })),
)
const UsersPage = lazy(() => import('@/features/users').then((m) => ({ default: m.UsersPage })))

function lazyRoute(element: ReactNode) {
  return <Suspense fallback={<Spinner label="Loading…" />}>{element}</Suspense>
}

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [{ path: '/login', element: <LoginPage /> }],
  },
  {
    element: (
      <RequireAuth>
        <DashboardLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: lazyRoute(<DashboardPage />) },
      { path: 'inquiries', element: lazyRoute(<InquiriesListPage />) },
      { path: 'contact-fields', element: lazyRoute(<InquiryFieldsListPage />) },
      { path: 'contact-fields/new', element: lazyRoute(<InquiryFieldFormPage />) },
      { path: 'contact-fields/:id/edit', element: lazyRoute(<InquiryFieldFormPage />) },
      { path: 'contact-services', element: lazyRoute(<InquiryServiceTypesListPage />) },
      { path: 'contact-services/new', element: lazyRoute(<InquiryServiceTypeFormPage />) },
      { path: 'contact-services/:id/edit', element: lazyRoute(<InquiryServiceTypeFormPage />) },
      { path: 'inquiries/:id', element: lazyRoute(<InquiryDetailPage />) },
      { path: 'destinations', element: lazyRoute(<DestinationsListPage />) },
      { path: 'destinations/new', element: lazyRoute(<DestinationFormPage />) },
      { path: 'destinations/:slug/edit', element: lazyRoute(<DestinationFormPage />) },
      { path: 'packages', element: lazyRoute(<PackagesListPage />) },
      { path: 'packages/new', element: lazyRoute(<PackageFormPage />) },
      { path: 'packages/:slug/edit', element: lazyRoute(<PackageFormPage />) },
      { path: 'visas', element: lazyRoute(<VisasListPage />) },
      { path: 'visas/new', element: lazyRoute(<VisaFormPage />) },
      { path: 'visas/:id/edit', element: lazyRoute(<VisaFormPage />) },
      { path: 'visa-countries', element: lazyRoute(<VisaCountriesListPage />) },
      { path: 'visa-countries/new', element: lazyRoute(<VisaCountryFormPage />) },
      { path: 'visa-countries/:id/edit', element: lazyRoute(<VisaCountryFormPage />) },
      { path: 'services', element: lazyRoute(<ServicesListPage />) },
      { path: 'services/new', element: lazyRoute(<ServiceFormPage />) },
      { path: 'services/:id/edit', element: lazyRoute(<ServiceFormPage />) },
      { path: 'flights', element: lazyRoute(<FlightsListPage />) },
      { path: 'flights/new', element: lazyRoute(<FlightFormPage />) },
      // Flights, hotels and offers are looked up by slug, not id.
      { path: 'flights/:slug/edit', element: lazyRoute(<FlightFormPage />) },
      { path: 'hotels', element: lazyRoute(<HotelsListPage />) },
      { path: 'hotels/new', element: lazyRoute(<HotelFormPage />) },
      { path: 'hotels/:slug/edit', element: lazyRoute(<HotelFormPage />) },
      { path: 'cruises', element: lazyRoute(<CruisesListPage />) },
      { path: 'cruises/new', element: lazyRoute(<CruiseFormPage />) },
      { path: 'cruises/:slug/edit', element: lazyRoute(<CruiseFormPage />) },
      { path: 'cruise-ports', element: lazyRoute(<CruisePortsListPage />) },
      { path: 'cruise-ports/new', element: lazyRoute(<CruisePortFormPage />) },
      { path: 'cruise-ports/:id/edit', element: lazyRoute(<CruisePortFormPage />) },
      { path: 'offers', element: lazyRoute(<OffersListPage />) },
      { path: 'offers/new', element: lazyRoute(<OfferFormPage />) },
      { path: 'offers/:slug/edit', element: lazyRoute(<OfferFormPage />) },
      { path: 'bookings', element: lazyRoute(<BookingsPage />) },
      { path: 'testimonials', element: lazyRoute(<TestimonialsListPage />) },
      { path: 'testimonials/new', element: lazyRoute(<TestimonialFormPage />) },
      { path: 'testimonials/:id/edit', element: lazyRoute(<TestimonialFormPage />) },
      { path: 'navigation', element: lazyRoute(<NavigationListPage />) },
      { path: 'navigation/new', element: lazyRoute(<NavItemFormPage />) },
      { path: 'navigation/:id/edit', element: lazyRoute(<NavItemFormPage />) },
      { path: 'partners', element: lazyRoute(<PartnersListPage />) },
      { path: 'partners/new', element: lazyRoute(<PartnerFormPage />) },
      { path: 'partners/:id/edit', element: lazyRoute(<PartnerFormPage />) },
      { path: 'airports', element: lazyRoute(<AirportsListPage />) },
      { path: 'airports/new', element: lazyRoute(<AirportFormPage />) },
      { path: 'airports/:id/edit', element: lazyRoute(<AirportFormPage />) },
      { path: 'certificates', element: lazyRoute(<CertificatesListPage />) },
      { path: 'certificates/new', element: lazyRoute(<CertificateFormPage />) },
      { path: 'certificates/:id/edit', element: lazyRoute(<CertificateFormPage />) },
      { path: 'branches', element: lazyRoute(<BranchesListPage />) },
      { path: 'branches/new', element: lazyRoute(<BranchFormPage />) },
      { path: 'branches/:id/edit', element: lazyRoute(<BranchFormPage />) },
      { path: 'promotions', element: lazyRoute(<PromotionsListPage />) },
      { path: 'promotions/new', element: lazyRoute(<PromotionFormPage />) },
      { path: 'promotions/:id/edit', element: lazyRoute(<PromotionFormPage />) },
      { path: 'social-links', element: lazyRoute(<SocialLinksListPage />) },
      { path: 'social-links/new', element: lazyRoute(<SocialLinkFormPage />) },
      { path: 'social-links/:id/edit', element: lazyRoute(<SocialLinkFormPage />) },
      { path: 'home-sections', element: lazyRoute(<HomeSectionsPage />) },
      { path: 'pages', element: lazyRoute(<PageHeroesListPage />) },
      { path: 'pages/new', element: lazyRoute(<PageHeroFormPage />) },
      // Heroes are keyed by page_key, not an opaque id.
      { path: 'pages/:pageKey/edit', element: lazyRoute(<PageHeroFormPage />) },
      { path: 'media', element: lazyRoute(<MediaLibraryPage />) },
      {
        path: 'users',
        element: (
          <RequireRole roles={ADMIN_ROLES}>{lazyRoute(<UsersPage />)}</RequireRole>
        ),
      },
      { path: '*', element: <p className="text-sm text-stone-500">Page not found.</p> },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
