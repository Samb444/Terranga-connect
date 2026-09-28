import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { TransportProvider } from './context/TransportContext'
import { MainLayout } from './layouts/MainLayout'

// Chargement dynamique des pages (Code-Splitting)
const HomePage = lazy(() =>
  import('./pages/HomePage').then((m) => ({ default: m.HomePage }))
)
const OwnerDashboardPage = lazy(() =>
  import('./pages/OwnerDashboardPage').then((m) => ({ default: m.OwnerDashboardPage }))
)
const DriverDashboardPage = lazy(() =>
  import('./pages/DriverDashboardPage').then((m) => ({ default: m.DriverDashboardPage }))
)
const OpportunitiesPage = lazy(() =>
  import('./pages/OpportunitiesPage').then((m) => ({ default: m.OpportunitiesPage }))
)
const OpportunityDetailsPage = lazy(() =>
  import('./pages/OpportunityDetailsPage').then((m) => ({ default: m.OpportunityDetailsPage }))
)
const MissionsPage = lazy(() =>
  import('./pages/MissionsPage').then((m) => ({ default: m.MissionsPage }))
)
const MissionDetailsPage = lazy(() =>
  import('./pages/MissionDetailsPage').then((m) => ({ default: m.MissionDetailsPage }))
)
const ProfilePage = lazy(() =>
  import('./pages/ProfilePage').then((m) => ({ default: m.ProfilePage }))
)
const NotificationsPage = lazy(() =>
  import('./pages/NotificationsPage').then((m) => ({ default: m.NotificationsPage }))
)
const ShipperDashboardPage = lazy(() =>
  import('./pages/ShipperDashboardPage').then((m) => ({ default: m.ShipperDashboardPage }))
)
const AdminSupervisionPage = lazy(() =>
  import('./pages/AdminSupervisionPage').then((m) => ({ default: m.AdminSupervisionPage }))
)

// Fallback de chargement cohérent avec le thème sombre Teranga Connect
const PageLoadingFallback: React.FC = () => (
  <div className="min-h-screen bg-[#070d1e] flex flex-col items-center justify-center text-slate-100 p-4">
    <div className="flex flex-col items-center space-y-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-amber-500/20 animate-ping" />
        <div className="w-12 h-12 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-bold text-white tracking-wide">Teranga Connect</p>
        <p className="text-xs text-slate-400">Chargement de la page en cours...</p>
      </div>
    </div>
  </div>
)

export const App: React.FC = () => {
  return (
    <TransportProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoadingFallback />}>
          <Routes>
            {/* Landing Page */}
            <Route
              path="/"
              element={
                <MainLayout>
                  {({ openDiscoveryModal }) => (
                    <HomePage onOpenDiscovery={openDiscoveryModal} />
                  )}
                </MainLayout>
              }
            />

            {/* Espace Propriétaire de camion */}
            <Route path="/proprietaire" element={<OwnerDashboardPage />} />

            {/* Espace Chauffeur */}
            <Route path="/chauffeur" element={<DriverDashboardPage />} />

            {/* Catalogue des opportunités */}
            <Route path="/opportunites" element={<OpportunitiesPage />} />

            {/* Détails d'une opportunité spécifique */}
            <Route path="/opportunites/:id" element={<OpportunityDetailsPage />} />

            {/* Liste et suivi des missions */}
            <Route path="/missions" element={<MissionsPage />} />

            {/* Détails et cycle de mission */}
            <Route path="/missions/:id" element={<MissionDetailsPage />} />

            {/* Profil utilisateur démonstratif */}
            <Route path="/profil" element={<ProfilePage />} />

            {/* Centre de notifications */}
            <Route path="/notifications" element={<NotificationsPage />} />

            {/* Espace Chargeur & Donneur d'ordre */}
            <Route path="/chargeur" element={<ShipperDashboardPage />} />

            {/* Console de Supervision & Administration */}
            <Route path="/admin" element={<AdminSupervisionPage />} />

            {/* Redirection fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TransportProvider>
  )
}

export default App
