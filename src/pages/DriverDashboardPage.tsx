import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Compass,
  Route,
  CheckCircle2,
  User,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Star,
  Award,
  Phone,
  MapPin,
} from 'lucide-react'
import { DashboardLayout, type NavItemConfig } from '../layouts/DashboardLayout'
import { StatCard } from '../components/dashboard/StatCard'
import { AvailabilityToggle } from '../components/dashboard/AvailabilityToggle'
import { TripCard } from '../components/dashboard/TripCard'
import { OpportunityCard } from '../components/opportunities/OpportunityCard'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { useTransport } from '../hooks/useTransport'

export const DriverDashboardPage: React.FC = () => {
  const { driver, opportunities, trips, driverStatus } = useTransport()

  const [activeTab, setActiveTab] = useState<string>('dashboard')

  // Navigation latérale chauffeur
  const navItems: NavItemConfig[] = [
    { id: 'dashboard', label: 'Tableau de bord', icon: <LayoutDashboard className="w-4 h-4" /> },
    {
      id: 'opportunities',
      label: 'Opportunités',
      icon: <Compass className="w-4 h-4" />,
      route: '/opportunites',
    },
    {
      id: 'trips',
      label: 'Mes trajets',
      icon: <Route className="w-4 h-4" />,
      badge: `${String(trips.length).padStart(2, '0')}`,
    },
    {
      id: 'availability',
      label: 'Disponibilité',
      icon: <CheckCircle2 className="w-4 h-4" />,
      badge: driverStatus === 'available' ? 'Dispo' : 'Repos',
    },
    { id: 'profile', label: 'Profil', icon: <User className="w-4 h-4" /> },
  ]

  const isAvailable = driverStatus === 'available'
  const inTransitTrips = trips.filter((t) => t.status === 'in_transit')

  return (
    <DashboardLayout
      role="driver"
      activeTab={activeTab}
      onTabChange={setActiveTab}
      navItems={navItems}
      headerActions={
        <div className="flex items-center gap-2">
          <Link to="/opportunites">
            <Button variant="primary" size="sm" className="text-xs shadow-amber-950/20">
              <Compass className="w-3.5 h-3.5 mr-1" />
              <span>Rechercher une mission</span>
            </Button>
          </Link>
        </div>
      }
    >
      <div className="space-y-8">
        {/* En-tête de bienvenue mot pour mot selon spec */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="success" className="text-xs py-0.5 px-2.5">
                <Sparkles className="w-3 h-3" />
                <span>Espace Chauffeur Professionnel</span>
              </Badge>
              <Badge variant="outline" className="text-[11px] text-slate-400 py-0.5 px-2">
                Données de démonstration
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Bonjour, bienvenue sur votre espace chauffeur.
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Gérez votre disponibilité en temps réel, parcourez les chargements disponibles sur vos
              itinéraires favoris et suivez vos missions.
            </p>
          </div>

          <div className="flex sm:hidden items-center gap-2 pt-2">
            <Link to="/opportunites" className="w-full">
              <Button variant="primary" size="sm" className="w-full justify-center text-xs">
                <Compass className="w-3.5 h-3.5 mr-1" />
                <span>Rechercher une mission</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Composant interactif de Disponibilité (statut local fonctionnel) */}
        <AvailabilityToggle />

        {/* 4 Cartes synthétiques obligatoires pour le chauffeur */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Disponibilité"
            value={isAvailable ? 'Disponible' : 'Indisponible'}
            subtext={isAvailable ? 'Prêt pour affectation de mission' : 'En repos déclaratif'}
            icon={<CheckCircle2 className="w-5 h-5" />}
            badgeText="Démonstration"
            badgeVariant={isAvailable ? 'success' : 'default'}
            accentColor={isAvailable ? 'emerald' : 'amber'}
          />

          <StatCard
            title="Opportunités"
            value={`${String(opportunities.length).padStart(2, '0')} offres`}
            subtext="Chargements sur les corridors nationaux"
            icon={<Compass className="w-5 h-5" />}
            badgeText="Démonstration"
            badgeVariant="amber"
            accentColor="amber"
          />

          <StatCard
            title="Missions"
            value={`${String(inTransitTrips.length).padStart(2, '0')} active`}
            subtext="Rotations en cours d'exécution"
            icon={<Route className="w-5 h-5" />}
            badgeText="Démonstration"
            badgeVariant="amber"
            accentColor="blue"
          />

          <StatCard
            title="Trajets"
            value={`${driver.tripsCompleted} trajets`}
            subtext="Historique simulé de rotations réussies"
            icon={<Award className="w-5 h-5" />}
            badgeText="Démonstration"
            badgeVariant="amber"
            accentColor="purple"
          />
        </div>

        {/* CONTENU SELON ONGLET OU VUE D'ENSEMBLE */}
        {activeTab === 'dashboard' && (
          <div className="space-y-10">
            {/* Missions recommandées */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    <Compass className="w-5 h-5 text-amber-400" />
                    <span>Opportunités recommandées pour votre profil</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Sélectionnées sur les axes Dakar - Thiès - Kaolack avec rentabilisation des
                    retours.
                  </p>
                </div>

                <Link to="/opportunites">
                  <Button variant="outline" size="sm" className="text-xs">
                    <span>Explorer le catalogue complet</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {opportunities.slice(0, 3).map((opp) => (
                  <OpportunityCard key={opp.id} opportunity={opp} />
                ))}
              </div>
            </section>

            {/* Suivi des trajets en cours */}
            <section className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    <Route className="w-5 h-5 text-emerald-400" />
                    <span>Vos trajets et missions assignées</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Informations opérationnelles, cargaison et contact transporteur.
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

        {/* ONGLET TRAJETS */}
        {activeTab === 'trips' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-slate-800">
              <h2 className="text-2xl font-bold text-white">Historique et trajets en cours</h2>
              <p className="text-xs text-slate-400 mt-1">
                Visualisez vos courses de fret terminées et celles actuellement sur la route.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {trips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          </div>
        )}

        {/* ONGLET DISPONIBILITÉ */}
        {activeTab === 'availability' && (
          <div className="space-y-6 max-w-3xl">
            <div className="pb-4 border-b border-slate-800">
              <h2 className="text-2xl font-bold text-white">Gestion de votre disponibilité</h2>
              <p className="text-xs text-slate-400 mt-1">
                Indiquez si vous êtes prêt à prendre le volant ou si vous êtes en période de repos.
              </p>
            </div>

            <AvailabilityToggle />

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-semibold text-white">
                Corridors et axes de préférence déclarés :
              </h3>
              <div className="flex flex-wrap gap-2">
                {driver.preferredCorridors.map((corridor) => (
                  <Badge key={corridor} variant="amber" className="text-xs py-1 px-3">
                    <Route className="w-3.5 h-3.5 mr-1" />
                    <span>{corridor}</span>
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Les missions correspondant à ces corridors vous sont soumises en priorité lorsque votre
                statut est réglé sur <strong>Disponible</strong>.
              </p>
            </div>
          </div>
        )}

        {/* ONGLET PROFIL */}
        {activeTab === 'profile' && (
          <div className="max-w-3xl space-y-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-2xl">
                IN
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white">{driver.fullName}</h2>
                  <Badge variant="success" className="text-[10px]">
                    <ShieldCheck className="w-3 h-3 mr-1" />
                    <span>Profil Vérifié (Démo)</span>
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                  <span className="flex items-center gap-1 text-amber-400 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{driver.rating} / 5.0</span>
                  </span>
                  <span>&bull;</span>
                  <span>{driver.experienceYears} ans d'expérience</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="text-slate-400 uppercase text-[10px] block font-medium">
                  Catégorie de Permis
                </span>
                <span className="font-semibold text-white">{driver.licenseType}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="text-slate-400 uppercase text-[10px] block font-medium">
                  Téléphone joignable
                </span>
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>{driver.phone}</span>
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="text-slate-400 uppercase text-[10px] block font-medium">
                  Zone de rattachement
                </span>
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{driver.currentCity}</span>
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="text-slate-400 uppercase text-[10px] block font-medium">
                  Trajets déclarés réussis
                </span>
                <span className="font-semibold text-white">{driver.tripsCompleted} voyages</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200/90 leading-relaxed">
              <strong>Statut prototype :</strong> Les informations du chauffeur sont simulées pour
              démontrer le fonctionnement de l'espace chauffeur et le changement de disponibilité.
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
