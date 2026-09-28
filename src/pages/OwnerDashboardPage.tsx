import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Truck,
  PlusCircle,
  LayoutDashboard,
  Boxes,
  Compass,
  Route,
  User,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Phone,
  Building2,
  MapPin,
  ClipboardList,
  CheckCircle2,
  CheckCheck,
  Bell,
  CreditCard,
} from 'lucide-react'
import { DashboardLayout, type NavItemConfig } from '../layouts/DashboardLayout'
import { StatCard } from '../components/dashboard/StatCard'
import { TruckCard } from '../components/dashboard/TruckCard'
import { ApplicationCard } from '../components/missions/ApplicationCard'
import { MissionCard } from '../components/missions/MissionCard'
import { OpportunityCard } from '../components/opportunities/OpportunityCard'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'
import { AddTruckModal } from '../components/forms/AddTruckModal'
import { PublishOpportunityModal } from '../components/forms/PublishOpportunityModal'
import { ApplicationDecisionModal } from '../components/modals/ApplicationDecisionModal'
import { useTransport } from '../hooks/useTransport'
import type { Application } from '../types'

export const OwnerDashboardPage: React.FC = () => {
  const {
    owner,
    trucks,
    opportunities,
    applications,
    missions,
    unreadNotificationsCount,
    acceptApplication,
    rejectApplication,
  } = useTransport()

  const [activeTab, setActiveTab] = useState<string>('dashboard')
  const [isAddTruckOpen, setIsAddTruckOpen] = useState(false)
  const [isPublishOppOpen, setIsPublishOppOpen] = useState(false)

  // Gestion des décisions sur les candidatures
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [decisionAction, setDecisionAction] = useState<'accept' | 'reject'>('accept')
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false)
  const [lastActionNotice, setLastActionNotice] = useState<string | null>(null)

  const pendingApplications = applications.filter((a) => a.status === 'pending')
  const confirmedMissions = missions.filter(
    (m) => m.status === 'confirmed' || m.status === 'in_progress'
  )
  const completedMissions = missions.filter((m) => m.status === 'completed')

  // Navigation latérale pour l'espace propriétaire
  const navItems: NavItemConfig[] = [
    { id: 'dashboard', label: 'Tableau de bord', icon: <LayoutDashboard className="w-4 h-4" /> },
    {
      id: 'applications',
      label: 'Candidatures reçues',
      icon: <ClipboardList className="w-4 h-4" />,
      badge:
        pendingApplications.length > 0
          ? `${String(pendingApplications.length).padStart(2, '0')}`
          : undefined,
    },
    {
      id: 'trucks',
      label: 'Mes camions',
      icon: <Boxes className="w-4 h-4" />,
      badge: `${String(trucks.length).padStart(2, '0')}`,
    },
    {
      id: 'missions',
      label: 'Missions',
      icon: <Route className="w-4 h-4" />,
      badge: `${String(missions.length).padStart(2, '0')}`,
      route: '/missions',
    },
    {
      id: 'opportunities',
      label: 'Opportunités',
      icon: <Compass className="w-4 h-4" />,
      route: '/opportunites',
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell className="w-4 h-4" />,
      badge: unreadNotificationsCount > 0 ? String(unreadNotificationsCount) : undefined,
      route: '/notifications',
    },
    {
      id: 'subscription',
      label: 'Abonnement (30k)',
      icon: <CreditCard className="w-4 h-4" />,
      route: '/abonnement',
    },
    { id: 'profile', label: 'Profil', icon: <User className="w-4 h-4" />, route: '/profil' },
  ]

  // Opportunités de retour pour réduire les trajets à vide
  const returnOpportunities = opportunities.filter((o) => o.isReturnTrip)

  const handleOpenAccept = (app: Application) => {
    setSelectedApplication(app)
    setDecisionAction('accept')
    setIsDecisionModalOpen(true)
  }

  const handleOpenReject = (app: Application) => {
    setSelectedApplication(app)
    setDecisionAction('reject')
    setIsDecisionModalOpen(true)
  }

  const handleConfirmAccept = (applicationId: string, truckId: string) => {
    const result = acceptApplication(applicationId, truckId)
    if (result) {
      setLastActionNotice(
        `Candidature acceptée ! La mission ${result.mission.missionCode} a été créée automatiquement dans votre espace.`
      )
    }
  }

  const handleConfirmReject = (applicationId: string, reason?: string) => {
    rejectApplication(applicationId, reason)
    setLastActionNotice('La candidature a bien été marquée comme refusée dans la session.')
  }

  return (
    <DashboardLayout
      role="truck_owner"
      activeTab={activeTab}
      onTabChange={setActiveTab}
      navItems={navItems}
      headerActions={
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsAddTruckOpen(true)}
            className="text-xs"
          >
            <Truck className="w-3.5 h-3.5 mr-1 text-amber-400" />
            <span>Ajouter un camion</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsPublishOppOpen(true)}
            className="text-xs shadow-amber-950/20"
          >
            <PlusCircle className="w-3.5 h-3.5 mr-1" />
            <span>Publier une opportunité</span>
          </Button>
        </div>
      }
    >
      <div className="space-y-8">
        {/* En-tête de bienvenue */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="amber" className="text-xs py-0.5 px-2.5">
                <Sparkles className="w-3 h-3" />
                <span>Espace Transporteur & Flotte</span>
              </Badge>
              <Badge variant="outline" className="text-[11px] text-slate-400 py-0.5 px-2">
                Données de démonstration Phase 5
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Bonjour, bienvenue sur votre espace transporteur.
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Supervisez votre matériel roulant, évaluez les candidatures reçues de chauffeurs,
              confirmez les missions et rentabilisez vos retours sur corridors.
            </p>
          </div>

          <div className="flex sm:hidden items-center gap-2 pt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsPublishOppOpen(true)}
              className="w-full justify-center text-xs"
            >
              <PlusCircle className="w-3.5 h-3.5 mr-1" />
              <span>Publier une opportunité</span>
            </Button>
          </div>
        </div>

        {/* Bannière de notification d'action récente */}
        {lastActionNotice && (
          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 flex items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{lastActionNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setLastActionNotice(null)}
              className="text-xs text-emerald-400 hover:text-white font-semibold underline shrink-0 cursor-pointer"
            >
              Fermer
            </button>
          </div>
        )}

        {/* 5 Cartes synthétiques dynamiques requises par spec 11 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          <StatCard
            title="Camions déclarés"
            value={`${String(trucks.length).padStart(2, '0')} camions`}
            subtext="Parc actif sous gestion"
            icon={<Truck className="w-5 h-5" />}
            badgeText="Démonstration"
            badgeVariant="amber"
            accentColor="amber"
          />

          <StatCard
            title="Opportunités publiées"
            value={`${String(opportunities.length).padStart(2, '0')} annonces`}
            subtext="Demandes de fret en catalogue"
            icon={<Compass className="w-5 h-5" />}
            badgeText="Démonstration"
            badgeVariant="amber"
            accentColor="blue"
          />

          <StatCard
            title="Candidatures reçues"
            value={`${String(applications.length).padStart(2, '0')} reçues`}
            subtext={`${pendingApplications.length} en attente de décision`}
            icon={<ClipboardList className="w-5 h-5" />}
            badgeText="Démonstration"
            badgeVariant={pendingApplications.length > 0 ? 'amber' : 'default'}
            accentColor={pendingApplications.length > 0 ? 'amber' : 'blue'}
          />

          <StatCard
            title="Missions confirmées"
            value={`${String(confirmedMissions.length).padStart(2, '0')} validée${
              confirmedMissions.length > 1 ? 's' : ''
            }`}
            subtext="En route ou prêtes au départ"
            icon={<Route className="w-5 h-5" />}
            badgeText="Démonstration"
            badgeVariant="success"
            accentColor="emerald"
          />

          <StatCard
            title="Missions terminées"
            value={`${String(completedMissions.length).padStart(2, '0')} réussie${
              completedMissions.length > 1 ? 's' : ''
            }`}
            subtext="Historique des livraisons"
            icon={<CheckCheck className="w-5 h-5" />}
            badgeText="Démonstration"
            badgeVariant="amber"
            accentColor="purple"
          />
        </div>

        {/* CONTENU SELON ONGLET OU VUE D'ENSEMBLE */}
        {activeTab === 'dashboard' && (
          <div className="space-y-10">
            {/* Section 1 : Candidatures reçues (Obligatoire Phase 4) */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                      <ClipboardList className="w-5 h-5 text-amber-400" />
                      <span>Candidatures reçues des chauffeurs</span>
                    </h2>
                    {pendingApplications.length > 0 && (
                      <Badge variant="amber" className="text-xs py-0.5 px-2">
                        {pendingApplications.length} en attente
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Chauffeurs intéressés par vos opportunités. Acceptez pour créer automatiquement la mission.
                  </p>
                </div>

                {applications.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('applications')}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer self-start sm:self-center"
                  >
                    <span>Gérer toutes les candidatures ({applications.length})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {applications.length === 0 ? (
                <EmptyState
                  icon={<ClipboardList className="w-10 h-10 text-slate-400" />}
                  title="Aucune candidature reçue pour le moment"
                  description="Les chauffeurs consultant vos opportunités apparaîtront ici dès qu'ils manifesteront leur intérêt."
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {applications.slice(0, 3).map((app) => (
                    <ApplicationCard
                      key={app.id}
                      application={app}
                      role="owner"
                      onAccept={handleOpenAccept}
                      onReject={handleOpenReject}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Section 2 : Mes Camions de démonstration */}
            <section className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    <Boxes className="w-5 h-5 text-amber-400" />
                    <span>Mes camions de démonstration</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Chaque immatriculation est fictive et masquée conformément aux exigences de
                    développement.
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddTruckOpen(true)}
                  className="text-xs"
                >
                  <PlusCircle className="w-3.5 h-3.5 mr-1 text-amber-400" />
                  <span>Ajouter un camion</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {trucks.map((truck) => (
                  <TruckCard key={truck.id} truck={truck} />
                ))}
              </div>
            </section>

            {/* Section 3 : Opportunités de retour priorisées */}
            <section className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mb-1">
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Axe Prioritaire Teranga Connect</span>
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Opportunités de retour à vide à rentabiliser
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Ces demandes correspondent à des déchargements intérieurs avec cargaison
                    disponible pour le retour sur Dakar.
                  </p>
                </div>

                <Link to="/opportunites">
                  <Button variant="ghost" size="sm" className="text-amber-400 hover:text-amber-300">
                    <span>Voir toutes les opportunités</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {returnOpportunities.slice(0, 3).map((opp) => (
                  <OpportunityCard key={opp.id} opportunity={opp} />
                ))}
              </div>
            </section>

            {/* Section 4 : Missions en cours et confirmées */}
            <section className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    <Route className="w-5 h-5 text-amber-400" />
                    <span>Missions de fret & rotations</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Suivi indicatif des ordres de transport générés et assignés à vos chauffeurs.
                  </p>
                </div>

                <Link to="/missions">
                  <Button variant="outline" size="sm" className="text-xs">
                    <span>Consulter toutes les missions</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {missions.slice(0, 2).map((mission) => (
                  <MissionCard key={mission.id} mission={mission} />
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ONGLET DÉDIÉ : CANDIDATURES REÇUES */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <ClipboardList className="w-6 h-6 text-amber-400" />
                  <span>Gestion des candidatures reçues ({applications.length})</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Examinez les profils de chauffeurs candidats, assignez un camion et créez
                  automatiquement la mission de transport.
                </p>
              </div>
            </div>

            {applications.length === 0 ? (
              <EmptyState
                icon={<ClipboardList className="w-12 h-12 text-slate-400" />}
                title="Aucune candidature enregistrée"
                description="Les candidatures apparaîtront ici quand des chauffeurs postuleront à vos offres de fret."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {applications.map((app) => (
                  <ApplicationCard
                    key={app.id}
                    application={app}
                    role="owner"
                    onAccept={handleOpenAccept}
                    onReject={handleOpenReject}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ONGLET MES CAMIONS */}
        {activeTab === 'trucks' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Boxes className="w-6 h-6 text-amber-400" />
                  <span>Flotte de transport ({trucks.length})</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Matériel déclaré dans la session active de démonstration.
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsAddTruckOpen(true)}
                className="text-xs"
              >
                <PlusCircle className="w-3.5 h-3.5 mr-1" />
                <span>Ajouter un camion</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {trucks.map((truck) => (
                <TruckCard key={truck.id} truck={truck} />
              ))}
            </div>
          </div>
        )}

        {/* ONGLET PROFIL */}
        {activeTab === 'profile' && (
          <div className="max-w-3xl space-y-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-2xl">
                MD
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white">{owner.fullName}</h2>
                  <Badge variant="amber" className="text-[10px]">
                    Propriétaire Démo
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>{owner.companyName}</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="text-slate-400 uppercase text-[10px] block font-medium">
                  Téléphone déclaré
                </span>
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>{owner.phone}</span>
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="text-slate-400 uppercase text-[10px] block font-medium">
                  Base logistique
                </span>
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{owner.city}</span>
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="text-slate-400 uppercase text-[10px] block font-medium">
                  Nombre de camions
                </span>
                <span className="font-semibold text-white">{trucks.length} véhicules déclarés</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="text-slate-400 uppercase text-[10px] block font-medium">
                  Missions en cours
                </span>
                <span className="font-semibold text-white">
                  {confirmedMissions.length} actives
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modales de gestion */}
      <AddTruckModal isOpen={isAddTruckOpen} onClose={() => setIsAddTruckOpen(false)} />
      <PublishOpportunityModal
        isOpen={isPublishOppOpen}
        onClose={() => setIsPublishOppOpen(false)}
      />
      <ApplicationDecisionModal
        isOpen={isDecisionModalOpen}
        onClose={() => setIsDecisionModalOpen(false)}
        application={selectedApplication}
        actionType={decisionAction}
        trucks={trucks}
        onConfirmAccept={handleConfirmAccept}
        onConfirmReject={handleConfirmReject}
      />
    </DashboardLayout>
  )
}
