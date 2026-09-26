import React from 'react'
import { MainLayout } from './layouts/MainLayout'
import { HomePage } from './pages/HomePage'

export const App: React.FC = () => {
  return (
    <MainLayout>
      {({ openDiscoveryModal }) => (
        <HomePage onOpenDiscovery={openDiscoveryModal} />
      )}
    </MainLayout>
  )
}

export default App
