import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { TransportProvider } from './context/TransportContext'
import { MainLayout } from './layouts/MainLayout'
import { HomePage } from './pages/HomePage'
import { OwnerDashboardPage } from './pages/OwnerDashboardPage'
import { DriverDashboardPage } from './pages/DriverDashboardPage'
import { OpportunitiesPage } from './pages/OpportunitiesPage'
import { OpportunityDetailsPage } from './pages/OpportunityDetailsPage'

export const App: React.FC = () => {
  return (
    <TransportProvider>
      <BrowserRouter>
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

          {/* Redirection fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </TransportProvider>
  )
}

export default App
