import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Route,
  Search,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'
import { useTransport } from '../hooks/useTransport'
import { MissionCard } from '../components/missions/MissionCard'
import { Header } from '../layouts/Header'
import { Footer } from '../layouts/Footer'
import { DiscoveryModal } from '../components/modals/DiscoveryModal'
import {
  MissionActionModal,
  type MissionActionType,
} from '../components/modals/MissionActionModal'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import type { Mission } from '../types'
import type { MissionTransitionAction } from '../lib/missionUtils'

type FilterCategory = 'all' | 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled'

export const MissionsPage: React.FC = () => {
  const {
    missions,
    acceptMission,
    startMission,
    completeMission,
    cancelMission,
  } = useTransport()

  const [filter, setFilter] = useState<FilterCategory>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isDiscoveryOpen, setIsDiscoveryOpen] = useState(false)

  // Gestion du modal d'action directe
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null)
  const [modalAction, setModalAction] = useState<MissionActionType>('start')
  const [isActionModalOpen, setIsActionModalOpen] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)

  const handleOpenAction = (mission: Mission, actionType: MissionTransitionAction) => {
    setSelectedMission(mission)
    setModalAction(actionType as MissionActionType)
    setIsActionModalOpen(true)
  }

  const handleConfirmAction = (missionId: string, actionType: MissionActionType) => {
    if (actionType === 'accept') {
      acceptMission(missionId)
      setFeedbackMessage('Mission acceptée avec succès ! Le départ peut désormais être préparé.')
    } else if (actionType === 'confirm') {
      acceptMission(missionId)
      setFeedbackMessage('Mission validée avec succès !')
    } else if (actionType === 'start') {
      startMission(missionId)
      setFeedbackMessage('Trajet démarré ! Le véhicule est désormais en cours d’acheminement.')
    } else if (actionType === 'complete') {
      completeMission(missionId)
      setFeedbackMessage('Mission clôturée ! Livraison marquée comme terminée avec succès.')
    } else if (actionType === 'cancel') {
      cancelMission(missionId)
      setFeedbackMessage('Mission annulée dans la démonstration.')
    }
  }

  // Filtrage des missions selon Phase 6
  const filteredMissions = missions.filter((mission) => {
    // Filtre par statut strict
    if (filter === 'pending') {
      if (mission.status !== 'pending' && mission.status !== 'interest') return false
    } else if (filter === 'accepted') {
      if (mission.status !== 'accepted' && mission.status !== 'confirmed') return false
    } else if (filter === 'in_progress') {
      if (mission.status !== 'in_progress') return false
    } else if (filter === 'completed') {
      if (mission.status !== 'completed') return false
    } else if (filter === 'cancelled') {
      if (mission.status !== 'cancelled') return false
    }

    // Recherche textuelle
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        mission.missionCode.toLowerCase().includes(q) ||
        (mission.title && mission.title.toLowerCase().includes(q)) ||
        (mission.description && mission.description.toLowerCase().includes(q)) ||
        mission.origin.toLowerCase().includes(q) ||
        mission.destination.toLowerCase().includes(q) ||
        mission.cargo.toLowerCase().includes(q) ||
        mission.driverName.toLowerCase().includes(q) ||
        mission.ownerName.toLowerCase().includes(q) ||
        mission.truckMatricule.toLowerCase().includes(q)

      if (!matchesSearch) return false
    }

    return true
  })

  // Compteurs exhaustifs par statut
  const counts = {
    all: missions.length,
    pending: missions.filter((m) => m.status === 'pending' || m.status === 'interest').length,
    accepted: missions.filter((m) => m.status === 'accepted' || m.status === 'confirmed').length,
    in_progress: missions.filter((m) => m.status === 'in_progress').length,
    completed: missions.filter((m) => m.status === 'completed').length,
    cancelled: missions.filter((m) => m.status === 'cancelled').length,
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#070d1e] text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      <Header onOpenJoinModal={() => setIsDiscoveryOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* En-tête de la page */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="amber" className="text-xs py-0.5 px-2.5">
                <Sparkles className="w-3 h-3" />
                <span>Gestion et suivi des missions</span>
              </Badge>
              <Badge variant="outline" className="text-[11px] text-slate-400 py-0.5 px-2">
                Démonstration Phase 6
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Missions de transport routier
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Retrouvez l’ensemble des rotations opérationnelles, suivez leur état d'avancement étape par
              étape et pilotez le cycle de vie : en attente, acceptée, en cours, jusqu'à la livraison finale.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/opportunites">
              <Button variant="outline" size="sm" className="text-xs">
                <span>Catalogue d'opportunités</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Bannière de feedback après action */}
        {feedbackMessage && (
          <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 flex items-center justify-between gap-3 shadow-xl">
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{feedbackMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setFeedbackMessage(null)}
              className="text-xs text-emerald-400 hover:text-white font-semibold underline shrink-0 cursor-pointer"
            >
              Fermer
            </button>
          </div>
        )}

        {/* Encadré d'explication du cycle déterministe Phase 6 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
              <Route className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <span className="font-bold text-white text-sm block">
                Cycle canonique : Progression déterministe
              </span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Mission créée (En attente) &rarr; Mission acceptée &rarr; Mission en cours &rarr; Mission terminée.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto shrink-0">
            <Link to="/proprietaire" className="flex-1 md:flex-initial">
              <Button variant="secondary" size="sm" className="w-full text-xs">
                Espace Propriétaire
              </Button>
            </Link>
            <Link to="/chauffeur" className="flex-1 md:flex-initial">
              <Button variant="secondary" size="sm" className="w-full text-xs">
                Espace Chauffeur
              </Button>
            </Link>
          </div>
        </div>

        {/* Barre de filtres exigés par Section 7 et recherche */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Onglets de filtrage canoniques */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  filter === 'all'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <span>Toutes ({counts.all})</span>
              </button>

              <button
                type="button"
                onClick={() => setFilter('pending')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  filter === 'pending'
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20 font-bold'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <span>En attente ({counts.pending})</span>
              </button>

              <button
                type="button"
                onClick={() => setFilter('accepted')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  filter === 'accepted'
                    ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <span>Acceptées ({counts.accepted})</span>
              </button>

              <button
                type="button"
                onClick={() => setFilter('in_progress')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  filter === 'in_progress'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <span>En cours ({counts.in_progress})</span>
              </button>

              <button
                type="button"
                onClick={() => setFilter('completed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  filter === 'completed'
                    ? 'bg-slate-700 text-white'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <span>Terminées ({counts.completed})</span>
              </button>

              {counts.cancelled > 0 && (
                <button
                  type="button"
                  onClick={() => setFilter('cancelled')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    filter === 'cancelled'
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <span>Annulées ({counts.cancelled})</span>
                </button>
              )}
            </div>

            {/* Barre de recherche textuelle */}
            <div className="relative min-w-[240px] sm:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher axe, code, marchandise..."
                className="w-full pl-9 pr-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* État vide si aucune mission du tout */}
        {missions.length === 0 ? (
          <EmptyState
            icon={<Route className="w-12 h-12 text-slate-400" />}
            title="Vous n'avez pas encore de mission"
            description="Explorez le catalogue des opportunités de transport, manifestez votre intérêt ou acceptez une candidature pour enclencher une mission."
            action={
              <Link to="/opportunites">
                <Button variant="primary" size="md">
                  Voir les opportunités
                </Button>
              </Link>
            }
          />
        ) : filteredMissions.length === 0 ? (
          /* État vide si filtre ou recherche ne renvoie rien */
          <EmptyState
            icon={<Route className="w-12 h-12 text-slate-400" />}
            title="Aucune mission correspondant à ces critères"
            description="Modifiez vos critères de recherche ou réinitialisez les filtres pour afficher l'ensemble de vos missions."
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFilter('all')
                  setSearchQuery('')
                }}
              >
                Réinitialiser les filtres
              </Button>
            }
          />
        ) : filter === 'all' && !searchQuery.trim() ? (
          /* Vue globale organisée par sections chronologiques */
          <div className="space-y-10">
            {/* 1. Missions en cours */}
            {counts.in_progress > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      Missions en cours
                    </h2>
                    <Badge variant="success" className="text-xs py-0.5 px-2">
                      {counts.in_progress} en route
                    </Badge>
                  </div>
                  <span className="text-xs text-slate-400 hidden sm:inline">
                    Camions actuellement en acheminement sur corridor
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {missions
                    .filter((m) => m.status === 'in_progress')
                    .map((mission) => (
                      <MissionCard
                        key={mission.id}
                        mission={mission}
                        onAction={handleOpenAction}
                      />
                    ))}
                </div>
              </section>
            )}

            {/* 2. Missions acceptées (prêtes au départ) */}
            {counts.accepted > 0 && (
              <section className="space-y-4 pt-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      Missions acceptées
                    </h2>
                    <Badge variant="default" className="text-xs py-0.5 px-2 bg-blue-500/20 text-blue-300 border-blue-500/30">
                      {counts.accepted} prête{counts.accepted > 1 ? 's' : ''} au départ
                    </Badge>
                  </div>
                  <span className="text-xs text-slate-400 hidden sm:inline">
                    Accord validé entre parties, en attente de démarrage
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {missions
                    .filter((m) => m.status === 'accepted' || m.status === 'confirmed')
                    .map((mission) => (
                      <MissionCard
                        key={mission.id}
                        mission={mission}
                        onAction={handleOpenAction}
                      />
                    ))}
                </div>
              </section>
            )}

            {/* 3. Missions en attente */}
            {counts.pending > 0 && (
              <section className="space-y-4 pt-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      Missions en attente
                    </h2>
                    <Badge variant="amber" className="text-xs py-0.5 px-2">
                      {counts.pending} en attente d'acceptation
                    </Badge>
                  </div>
                  <span className="text-xs text-slate-400 hidden sm:inline">
                    Missions créées en attente d’acceptation formelle
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {missions
                    .filter((m) => m.status === 'pending' || m.status === 'interest')
                    .map((mission) => (
                      <MissionCard
                        key={mission.id}
                        mission={mission}
                        onAction={handleOpenAction}
                      />
                    ))}
                </div>
              </section>
            )}

            {/* 4. Missions terminées */}
            {counts.completed > 0 && (
              <section className="space-y-4 pt-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      Missions terminées
                    </h2>
                    <Badge variant="outline" className="text-xs py-0.5 px-2 text-slate-300">
                      {counts.completed} historique
                    </Badge>
                  </div>
                  <span className="text-xs text-slate-400 hidden sm:inline">
                    Trajets achevés et livraisons émargées avec succès
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {missions
                    .filter((m) => m.status === 'completed')
                    .map((mission) => (
                      <MissionCard
                        key={mission.id}
                        mission={mission}
                        onAction={handleOpenAction}
                      />
                    ))}
                </div>
              </section>
            )}

            {/* 5. Missions annulées */}
            {counts.cancelled > 0 && (
              <section className="space-y-4 pt-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      Missions annulées
                    </h2>
                    <Badge variant="danger" className="text-xs py-0.5 px-2">
                      {counts.cancelled} annulée{counts.cancelled > 1 ? 's' : ''}
                    </Badge>
                  </div>
                  <span className="text-xs text-slate-400 hidden sm:inline">
                    Missions annulées dans la session
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {missions
                    .filter((m) => m.status === 'cancelled')
                    .map((mission) => (
                      <MissionCard
                        key={mission.id}
                        mission={mission}
                        onAction={handleOpenAction}
                      />
                    ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          /* Vue Filtrée standard */
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800/80">
              <span>
                Résultats filtrés : <strong>{filteredMissions.length}</strong> mission{filteredMissions.length > 1 ? 's' : ''}
              </span>
              {searchQuery && <span>Recherche : « {searchQuery} »</span>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredMissions.map((mission) => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  onAction={handleOpenAction}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
      <DiscoveryModal isOpen={isDiscoveryOpen} onClose={() => setIsDiscoveryOpen(false)} />
      <MissionActionModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        mission={selectedMission}
        actionType={modalAction}
        onConfirmAction={handleConfirmAction}
      />
    </div>
  )
}
