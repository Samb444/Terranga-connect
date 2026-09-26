import React from 'react'
import {
  Truck,
  Compass,
  ClipboardList,
  Route,
  CheckCircle2,
  Star,
  Activity,
} from 'lucide-react'
import { StatCard } from '../dashboard/StatCard'
import { AvailabilityToggle } from '../dashboard/AvailabilityToggle'
import { useTransport } from '../../hooks/useTransport'

interface ProfileStatsProps {
  role: 'truck_owner' | 'driver'
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({ role }) => {
  const {
    owner,
    driver,
    trucks,
    opportunities,
    applications,
    missions,
  } = useTransport()

  const isOwner = role === 'truck_owner'

  // Statistiques calculées depuis le state
  const ownerMissions = missions.filter((m) => m.ownerId === owner.id || isOwner)
  const ownerActiveMissions = ownerMissions.filter(
    (m) => m.status === 'confirmed' || m.status === 'in_progress'
  )
  const ownerCompletedMissions = ownerMissions.filter((m) => m.status === 'completed')

  const driverApplications = applications.filter(
    (a) => a.driverId === driver.id || a.driverName.includes('Ibrahima')
  )
  const driverMissions = missions.filter(
    (m) => m.driverId === driver.id || m.driverName.includes('Ibrahima')
  )
  const driverActiveMissions = driverMissions.filter(
    (m) => m.status === 'confirmed' || m.status === 'in_progress'
  )
  const driverCompletedMissions = driverMissions.filter((m) => m.status === 'completed')

  if (isOwner) {
    return (
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Activity className="w-4 h-4 text-amber-400" />
          <span>Statistiques de la flotte (Temps Réel)</span>
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Camions déclarés"
            value={String(trucks.length)}
            icon={<Truck className="w-5 h-5 text-amber-400" />}
            subtext="Matériel actif"
            accentColor="amber"
          />

          <StatCard
            title="Opportunités publiées"
            value={String(opportunities.length)}
            icon={<Compass className="w-5 h-5 text-sky-400" />}
            subtext="Total catalogue"
            accentColor="blue"
          />

          <StatCard
            title="Candidatures reçues"
            value={String(applications.length)}
            icon={<ClipboardList className="w-5 h-5 text-amber-400" />}
            subtext={`${applications.filter((a) => a.status === 'pending').length} en attente`}
            accentColor="amber"
          />

          <StatCard
            title="Missions actives"
            value={String(ownerActiveMissions.length)}
            icon={<Route className="w-5 h-5 text-emerald-400" />}
            subtext={`${ownerCompletedMissions.length} terminées`}
            accentColor="emerald"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>Statistiques professionnelles du chauffeur</span>
        </h2>
      </div>

      {/* Carte interactive de disponibilité */}
      <AvailabilityToggle />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Missions attribuées"
          value={String(driverMissions.length)}
          icon={<Route className="w-5 h-5 text-emerald-400" />}
          subtext={`${driverActiveMissions.length} en cours`}
          accentColor="emerald"
        />

        <StatCard
          title="Missions terminées"
          value={String(driverCompletedMissions.length)}
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          subtext="Cycle clôturé"
          accentColor="emerald"
        />

        <StatCard
          title="Candidatures soumises"
          value={String(driverApplications.length)}
          icon={<ClipboardList className="w-5 h-5 text-amber-400" />}
          subtext="Intérêt manifesté"
          accentColor="amber"
        />

        <StatCard
          title="Note d'évaluation"
          value={`${driver.rating} / 5`}
          icon={<Star className="w-5 h-5 text-amber-400 fill-amber-400" />}
          subtext={`${driver.tripsCompleted} rotations [Fictif]`}
          accentColor="amber"
        />
      </div>
    </div>
  )
}
