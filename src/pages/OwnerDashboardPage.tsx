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
} from 'lucide-react'
import { DashboardLayout, type NavItemConfig } from '../layouts/DashboardLayout'
import { StatCard } from '../components/dashboard/StatCard'
import { TruckCard } from '../components/dashboard/TruckCard'
import { TripCard } from '../components/dashboard/TripCard'
import { OpportunityCard } from '../components/opportunities/OpportunityCard'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { AddTruckModal } from '../components/forms/AddTruckModal'
import { PublishOpportunityModal } from '../components/forms/PublishOpportunityModal'
import { useTransport } from '../hooks/useTransport'

export const OwnerDashboardPage: React.FC = () => {
  const { owner, trucks, opportunities, trips } = useTransport()

  const [activeTab, setActiveTab] = useState<string>('dashboard')
  const [isAddTruckOpen, setIsAddTruckOpen] = useState(false)
  const [isPublishOppOpen, setIsPublishOppOpen] = useState(false)

  // Navigation latérale pour l'espace propriétaire
  const navItems: NavItemConfig[] = [
    { id: 'dashboard', label: 'Tableau de bord', icon: <LayoutDashboard className="w-4 h-4" /> },
    {
      id: 'trucks',
      label: 'Mes camions',
      icon: <Boxes className="w-4 h-4" />,
      badge: `${String(trucks.length).padStart(2, '0')}`,
    },
    {
      id: 'opportunities',
      label: 'Opportunités',
      icon: <Compass className="w-4 h-4" />,
      route: '/opportunites',
    },
    {
      id: 'missions',
      label: 'Missions',
      icon: <Route className="w-4 h-4" />,
      badge: `${String(trips.length).padStart(2, '0')}`,
    },
    { id: 'profile', label: 'Profil', icon: <User className="w-4 h-4" /> },
  ]

  // Opportunités de retour pour réduire les trajets à vide
  const returnOpportunities = opportunities.filter((o) => o.isReturnTrip)
  const inTransitTrips = trips.filter((t) => t.status === 'in_transit')

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
        {/* En-tête de bienvenue mot pour mot selon spec */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="amber" className="text-xs py-0.5 px-2.5">
                <Sparkles className="w-3 h-3" />
                <span>Espace Transporteur & Flotte</span>
              </Badge>
              <Badge variant="outline" className="text-[11px] text-slate-400 py-0.5 px-2">
                Données de démonstration
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Bonjour, bienvenue sur votre espace transporteur.
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Supervisez votre matériel roulant, consultez les opportunités de fret sur vos axes
              habituels et identifiez des chargements de retour pour limiter les kilomètres à vide.
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

        {/* 4 Cartes synthétiques obligatoires */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Mes camions"
            value={`${String(trucks.length).padStart(2, '0')} camions`}
            subtext="Parc actif déclaré dans la session"
            icon={<Truck className="w-5 h-5" />}
            badgeText="Démonstration"
            badgeVariant="amber"
            accentColor="amber"
          />

          <StatCard
            title="Opportunités disponibles"
            value={`${String(opportunities.length).padStart(2, '0')} opportunités`}
            subtext="Demandes de fret en attente d'affectation"
            icon={<Compass className="w-5 h-5" />}
            badgeText="Démonstration"
            badgeVariant="amber"
            accentColor="blue"
          />

          <StatCard
            title="Missions en cours"
            value={`${String(inTransitTrips.length).padStart(2, '0')} mission`}
            subtext="Camions actuellement en rotation sur corridor"
            icon={<Route className="w-5 h-5" />}
            badgeText="Démonstration"
            badgeVariant="amber"
            accentColor="purple"
          />

          <StatCard
            title="Opportunités de retour"
            value={`${String(returnOpportunities.length).padStart(2, '0')} retours`}
            subtext="Chargements ciblés pour éviter de rouler à vide"
            icon={<RotateCcw className="w-5 h-5" />}
            badgeText="Démonstration"
            badgeVariant="success"
            accentColor="emerald"
          />
        </div>

        {/* CONTENU SELON ONGLET OU VUE D'ENSEMBLE */}
        {activeTab === 'dashboard' && (
          <div className="space-y-10">
            {/* Section Mes Camions de démonstration */}
            <section className="space-y-4">
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

            {/* Section Opportunités de retour priorisées */}
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

            {/* Section Missions en cours & planifiées */}
            <section className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    <Route className="w-5 h-5 text-amber-400" />
                    <span>Missions et rotations de fret</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Suivi indicatif des trajets engagés avec vos chauffeurs et vos camions.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {trips.map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ONGLET MES CAMIONS */}
        {activeTab === 'trucks' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-2xl font-bold text-white">Gestion de votre flotte</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Parc de camions disponible pour l'affectation sur les missions nationales.
                </p>
              </div>
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsAddTruckOpen(true)}
                className="text-xs"
              >
                <PlusCircle className="w-4 h-4 mr-1.5" />
                <span>Ajouter un camion</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trucks.map((truck) => (
                <TruckCard key={truck.id} truck={truck} />
              ))}
            </div>
          </div>
        )}

        {/* ONGLET MISSIONS */}
        {activeTab === 'missions' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-slate-800">
              <h2 className="text-2xl font-bold text-white">Missions et transports en cours</h2>
              <p className="text-xs text-slate-400 mt-1">
                Visualisez l'état d'avancement des rotations de vos véhicules.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {trips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          </div>
        )}

        {/* ONGLET PROFIL */}
        {activeTab === 'profile' && (
          <div className="max-w-3xl space-y-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 pb-6 border-b border-slate-800">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-xl">
                MD
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white">{owner.fullName}</h2>
                  <Badge variant="amber" className="text-[10px]">
                    Démonstration
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>{owner.companyName}</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="text-slate-400 uppercase text-[10px] block font-medium">
                  Téléphone professionnel
                </span>
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>{owner.phone}</span>
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="text-slate-400 uppercase text-[10px] block font-medium">
                  Siège / Dépôt principal
                </span>
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{owner.city}</span>
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="text-slate-400 uppercase text-[10px] block font-medium">
                  Nombre de camions enregistrés
                </span>
                <span className="font-semibold text-white">{trucks.length} véhicules</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="text-slate-400 uppercase text-[10px] block font-medium">
                  Statut du compte
                </span>
                <span className="text-emerald-400 font-semibold">
                  Compte Démo Actif (Phase 3)
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed">
              <strong>Note de prototype :</strong> Dans les phases ultérieures, ce profil permettra
              la gestion KYC, la vérification des cartes grises et le suivi comptable des avances
              carburant et péages.
            </div>
          </div>
        )}
      </div>

      {/* Modale d'ajout de camion */}
      <AddTruckModal isOpen={isAddTruckOpen} onClose={() => setIsAddTruckOpen(false)} />

      {/* Modale de publication d'opportunité */}
      <PublishOpportunityModal
        isOpen={isPublishOppOpen}
        onClose={() => setIsPublishOppOpen(false)}
      />
    </DashboardLayout>
  )
}
