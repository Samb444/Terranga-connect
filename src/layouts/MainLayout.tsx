import React, { useState } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { DiscoveryModal } from '../components/modals/DiscoveryModal'

interface MainLayoutProps {
  children:
    | React.ReactNode
    | ((helpers: { openDiscoveryModal: () => void }) => React.ReactNode)
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openDiscoveryModal = () => setIsModalOpen(true)
  const closeDiscoveryModal = () => setIsModalOpen(false)

  return (
    <div className="min-h-screen flex flex-col bg-[#070d1e] text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* En-tête responsive avec navigation et menu mobile */}
      <Header onOpenJoinModal={openDiscoveryModal} />

      {/* Contenu principal de la page */}
      <main className="flex-1 flex flex-col">
        {typeof children === 'function' ? children({ openDiscoveryModal }) : children}
      </main>

      {/* Pied de page professionnel et sobre */}
      <Footer />

      {/* Modale d'information accessible avec choix de parcours */}
      <DiscoveryModal isOpen={isModalOpen} onClose={closeDiscoveryModal} />
    </div>
  )
}
