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
  Phone,
  MapPin,
  ClipboardList,
  CheckCheck,
} from 'lucide-react'
import { DashboardLayout, type NavItemConfig } from '../layouts/DashboardLayout'
import { StatCard } from '../components/dashboard/StatCard'
import { AvailabilityToggle } from '../components/dashboard/AvailabilityToggle'
import { ApplicationCard } from '../components/missions/ApplicationCard'
import { MissionCard } from '../components/missions/MissionCard'
import { OpportunityCard } from '../components/opportunities/OpportunityCard'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'
import { useTransport } from '../hooks/useTransport'

export const DriverDashboardPage: React.FC = () => {
  const { driver, opportunities, applications, missions, driverStatus } = useTransport()

  const [activeTab, setActiveTab] = useState<string>('dashboard')

  // Candidatures du chauffeur connecté (dans la démo, id = driver.id ou chauffeur démo)
  const driverApplications = applications.filter(
    (a) => a.driverId === driver.id || a.driverName.includes('Ibrahima')
  )

  // Missions assignées au chauffeur
  const driverMissions = missions.filter(
    (m) => m.driverId === driver.id || m.driverName.includes('Ibrahima')
  )

  const confirmedMissions = driverMissions.filter(
    (m) => m.status === 'confirmed' || m.status === 'in_progress'
  )
  const completedMissions = driverMissions.filter((m) => m.status === 'completed')

  // Navigation latérale chauffeur avec onglet Candidatures et Missions
  const navItems: NavItemConfig[] = [
    { id: 'dashboard', label: 'Tableau de bord', icon: <LayoutDashboard className="w-4 h-4" /> },
    {
      id: 'applications',
      label: 'Mes candidatures',
      icon: <ClipboardList className="w-4 h-4" />,
      badge: `${String(driverApplications.length).padStart(2, '0')}`,
    },
    {
      id: 'missions',
      label: 'Mes missions',
      icon: <Route className="w-4 h-4" />,
      badge: `${String(driverMissions.length).padStart(2, '0')}`,
      route: '/missions',
    },
    {
      id: 'opportunities',
      label: 'Opportunités',
      icon: <Compass className="w-4 h-4" />,
      route: '/opportunites',
    },
    {
      id: 'availability',
      label: 'Disponibilité',
      icon: <CheckCircle2 className="w-4 h-4" />,
      badge: driverStatus === 'available' ? 'Dispo' : 'Repos',
    },
    { id: 'profile', label: 'Profil', icon: <User className="w-4 h-4" /> },
  ]

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
        {/* En-tête de bienvenue */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="success" className="text-xs py-0.5 px-2.5">
                <Sparkles className="w-3 h-3" />
                <span>Espace Chauffeur Professionnel</span>
              </Badge>
              <Badge variant="outline" className="text-[11px] text-slate-400 py-0.5 px-2">
                Données de démonstration Phase 4
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Bonjour, bienvenue sur votre espace chauffeur.
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Gérez votre disponibilité, suivez vos candidatures sur les trajets de fret et pilotez
              vos missions confirmées en temps réel.
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

        {/* Composant interactif de Disponibilité */}
        <AvailabilityToggle />

        {/* 4 Cartes statistiques calculées dynamiquement selon spec */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Opportunités disponibles"
            value={`${String(opportunities.length).padStart(2, '0')} offres`}
            subtext="Fret disponible sur les corridors"
            icon={<Compass className="w-5 h-5" />}
            badgeText="Démonstration"
            badgeVariant="amber"
            accentColor="amber"
          />

          <StatCard
            title="Mes candidatures"
            value={`${String(driverApplications.length).padStart(2, '0')} actives`}
            subtext="Manifestations d'intérêt enregistrées"
            icon={<ClipboardList className="w-5 h-5" />}
            badgeText="Démonstration"
            badgeVariant="amber"
            accentColor="blue"
          />

          <StatCard
            title="Missions confirmées"
            value={`${String(confirmedMissions.length).padStart(2, '0')} mission${
              confirmedMissions.length > 1 ? 's' : ''
            }`}
            subtext="Validées ou en cours de route"
            icon={<Route className="w-5 h-5" />}
            badgeText="Démonstration"
            badgeVariant="success"
            accentColor="emerald"
          />

          <StatCard
            title="Missions terminées"
            value={`${String(completedMissions.length).padStart(2, '0')} voyage${
              completedMissions.length > 1 ? 's' : ''
            }`}
            subtext="Historique des livraisons réussies"
            icon={<CheckCheck className="w-5 h-5" />}
            badgeText="Démonstration"
            badgeVariant="amber"
            accentColor="purple"
          />
        </div>

        {/* VUE TABLEAU DE BORD PRINCIPAL */}
        {activeTab === 'dashboard' && (
          <div className="space-y-10">
            {/* Section 1 : Mes candidatures (Obligatoire Phase 4) */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-amber-400" />
                    <span>Mes candidatures récentes</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Trajets pour lesquels vous avez manifesté votre intérêt.
                  </p>
                </div>

                {driverApplications.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('applications')}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer self-start sm:self-center"
                  >
                    <span>Voir toutes mes candidatures ({driverApplications.length})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {driverApplications.length === 0 ? (
                <EmptyState
                  icon={<ClipboardList className="w-10 h-10 text-slate-400" />}
                  title="Aucune candidature pour le moment"
                  description="Parcourez le catalogue d’opportunités et cliquez sur « Manifester mon intérêt » pour postuler à un trajet."
                  action={
                    <Link to="/opportunites">
                      <Button variant="primary" size="sm">
                        Découvrir les opportunités
                      </Button>
                    </Link>
                  }
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {driverApplications.slice(0, 3).map((app) => (
                    <ApplicationCard key={app.id} application={app} role="driver" />
                  ))}
                </div>
              )}
            </section>

            {/* Section 2 : Missions confirmées et en cours */}
            <section className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    <Route className="w-5 h-5 text-emerald-400" />
                    <span>Missions confirmées et en cours</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Rotations validées par les transporteurs avec suivi des jalons.
                  </p>
                </div>

                <Link to="/missions">
                  <Button variant="outline" size="sm" className="text-xs">
                    <span>Espace Toutes les missions</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {driverMissions.slice(0, 2).map((mission) => (
                  <MissionCard key={mission.id} mission={mission} />
                ))}
              </div>
            </section>

            {/* Section 3 : Opportunités recommandées */}
            <section className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    <Compass className="w-5 h-5 text-amber-400" />
                    <span>Opportunités recommandées sur vos corridors</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Sélectionnées sur les axes Dakar - Thiès - Kaolack avec rentabilisation des retours.
                  </p>
                </div>

                <Link to="/opportunites">
                  <Button variant="outline" size="sm" className="text-xs">
                    <span>Explorer le catalogue</span>
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
          </div>
        )}

        {/* ONGLET MES CANDIDATURES DÉDIÉ */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <ClipboardList className="w-6 h-6 text-amber-400" />
                  <span>Mes candidatures ({driverApplications.length})</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Suivez en direct l'acceptation de vos candidatures par les transporteurs.
                </p>
              </div>

              <Link to="/opportunites">
                <Button variant="primary" size="sm" className="text-xs">
                  <Compass className="w-3.5 h-3.5 mr-1" />
                  <span>Ajouter une candidature</span>
                </Button>
              </Link>
            </div>

            {driverApplications.length === 0 ? (
              <EmptyState
                icon={<ClipboardList className="w-12 h-12 text-slate-400" />}
                title="Vous n'avez pas encore postulé à une opportunité"
                description="Consultez les trajets de fret disponibles et manifestez votre intérêt en un clic."
                action={
                  <Link to="/opportunites">
                    <Button variant="primary" size="md">
                      Voir les opportunités
                    </Button>
                  </Link>
                }
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {driverApplications.map((app) => (
                  <ApplicationCard key={app.id} application={app} role="driver" />
                ))}
              </div>
            )}
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
                <span className="font-semibold text-white">{completedMissions.length + 142} voyages</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200/90 leading-relaxed">
              <strong>Statut prototype Phase 4 :</strong> Les candidatures et missions sont synchronisées
              localement pour tester la réservation et le cycle transport sans backend.
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
