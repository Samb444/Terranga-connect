import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Compass,
  ArrowLeft,
  Truck,
  PlusCircle,
  FilterX,
} from 'lucide-react'
import { useTransport } from '../hooks/useTransport'
import {
  OpportunityFilters,
  type FilterState,
} from '../components/opportunities/OpportunityFilters'
import { OpportunityCard } from '../components/opportunities/OpportunityCard'
import { EmptyState } from '../components/ui/EmptyState'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { PublishOpportunityModal } from '../components/forms/PublishOpportunityModal'
import { Header } from '../layouts/Header'
import { Footer } from '../layouts/Footer'
import { DiscoveryModal } from '../components/modals/DiscoveryModal'

const initialFilters: FilterState = {
  searchQuery: '',
  origin: '',
  destination: '',
  truckCategory: '',
  tripType: 'all',
}

export const OpportunitiesPage: React.FC = () => {
  const { opportunities } = useTransport()
  const [filters, setFilters] = useState<FilterState>(initialFilters)
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false)
  const [isDiscoveryOpen, setIsDiscoveryOpen] = useState(false)

  // Filtrage dynamique réel des opportunités
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      // Filtre textuel (recherche globale)
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim()
        const matchTitle = opp.title.toLowerCase().includes(query)
        const matchCargo = opp.cargoType.toLowerCase().includes(query)
        const matchDesc = opp.description.toLowerCase().includes(query)
        const matchOrigin = opp.origin.toLowerCase().includes(query)
        const matchDest = opp.destination.toLowerCase().includes(query)
        if (!matchTitle && !matchCargo && !matchDesc && !matchOrigin && !matchDest) {
          return false
        }
      }

      // Filtre origine
      if (filters.origin && opp.origin.toLowerCase() !== filters.origin.toLowerCase()) {
        return false
      }

      // Filtre destination
      if (
        filters.destination &&
        opp.destination.toLowerCase() !== filters.destination.toLowerCase()
      ) {
        return false
      }

      // Filtre catégorie de camion
      if (filters.truckCategory && opp.truckCategoryRequired !== filters.truckCategory) {
        return false
      }

      // Filtre type de trajet (aller / retour)
      if (filters.tripType === 'return' && !opp.isReturnTrip) {
        return false
      }
      if (filters.tripType === 'outbound' && opp.isReturnTrip) {
        return false
      }

      return true
    })
  }, [opportunities, filters])

  const handleResetFilters = () => {
    setFilters(initialFilters)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#070d1e] text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Header public avec liens vers les espaces */}
      <Header onOpenJoinModal={() => setIsDiscoveryOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Fil d'Ariane & Boutons d'action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retour à l'accueil</span>
            </Link>
            <span className="text-slate-400">/</span>
            <span className="text-xs text-amber-400 font-semibold">Opportunités</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link to="/proprietaire">
              <Button variant="secondary" size="sm" className="text-xs">
                <Truck className="w-3.5 h-3.5 mr-1 text-amber-400" />
                <span>Espace Propriétaire</span>
              </Button>
            </Link>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsPublishModalOpen(true)}
              className="text-xs shadow-amber-950/20"
            >
              <PlusCircle className="w-3.5 h-3.5 mr-1" />
              <span>Publier une opportunité</span>
            </Button>
          </div>
        </div>

        {/* Titre requis selon spec : Opportunités de transport */}
        <div className="space-y-3 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Badge variant="amber" className="text-xs py-1 px-3">
              <Compass className="w-3.5 h-3.5" />
              <span>Catalogue Fret Sénégal</span>
            </Badge>
            <Badge variant="outline" className="text-[11px] text-slate-400 py-0.5 px-2">
              Démonstration
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Opportunités de transport
          </h1>

          <p className="text-base text-slate-300 max-w-3xl leading-relaxed">
            Consultez les chargements disponibles sur les corridors logistiques nationaux. Repérez en
            priorité les opportunités de retour afin d'optimiser le taux de remplissage de vos
            camions.
          </p>
        </div>

        {/* Composant des filtres fonctionnels */}
        <OpportunityFilters
          filters={filters}
          onFilterChange={setFilters}
          onReset={handleResetFilters}
          totalCount={opportunities.length}
          filteredCount={filteredOpportunities.length}
        />

        {/* Liste des résultats filtrés */}
        {filteredOpportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOpportunities.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        ) : (
          /* État vide requis mot pour mot selon spec */
          <EmptyState
            icon={<FilterX className="w-7 h-7 text-amber-400" />}
            title="Aucune opportunité ne correspond à vos critères."
            description="Essayez d'élargir votre recherche, de changer les villes sélectionnées ou de réinitialiser l'ensemble des filtres."
            actionLabel="Réinitialiser tous les filtres"
            onAction={handleResetFilters}
          />
        )}
      </main>

      <Footer />

      {/* Modale de publication rapide */}
      <PublishOpportunityModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
      />

      <DiscoveryModal isOpen={isDiscoveryOpen} onClose={() => setIsDiscoveryOpen(false)} />
    </div>
  )
}
