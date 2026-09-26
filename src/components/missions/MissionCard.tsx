import React from 'react'
import { Link } from 'react-router-dom'
import {
  MapPin,
  ArrowRight,
  Truck,
  PackageCheck,
  User,
  RotateCcw,
  ChevronRight,
} from 'lucide-react'
import type { Mission } from '../../types'
import { MISSION_STATUS_CONFIG, formatFcfa } from '../../lib/missionUtils'
import { Card, CardHeader, CardContent } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'

interface MissionCardProps {
  mission: Mission
}

export const MissionCard: React.FC<MissionCardProps> = ({ mission }) => {
  const statusCfg =
    MISSION_STATUS_CONFIG[mission.status] || MISSION_STATUS_CONFIG.pending
  const isReturn = mission.tripType === 'return_cargo'

  return (
    <Card className="bg-slate-900/80 border-slate-800 hover:border-slate-700/80 transition-all flex flex-col justify-between group shadow-lg">
      <div>
        {/* En-tête de la carte mission */}
        <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {mission.missionCode}
            </span>

            <Badge
              variant={statusCfg.variant}
              className={`text-xs font-semibold py-0.5 px-2.5 flex items-center gap-1.5 ${statusCfg.badgeClass}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dotColor}`} />
              <span>{statusCfg.label}</span>
            </Badge>

            {isReturn && (
              <Badge variant="success" className="text-[10px] py-0.5 px-2">
                <RotateCcw className="w-2.5 h-2.5 mr-1" />
                <span>Retour optimisé</span>
              </Badge>
            )}
          </div>

          <Badge variant="outline" className="text-[10px] text-slate-400 py-0.5 px-2 shrink-0">
            Démonstration
          </Badge>
        </CardHeader>

        <CardContent className="space-y-4 pt-1">
          {/* Corridor Origine -> Destination */}
          <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
            <div className="flex items-center gap-1.5 text-slate-100">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{mission.origin}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="flex items-center gap-1.5 text-slate-100">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{mission.destination}</span>
            </div>
            <span className="text-xs font-normal text-slate-400 ml-auto hidden sm:inline">
              ~{mission.estimatedDistance} km
            </span>
          </div>

          {/* Marchandise */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 text-[10px] uppercase font-semibold">
                <PackageCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Marchandise transportée</span>
              </span>
              <span className="text-[11px] text-slate-400">{mission.departureDate}</span>
            </div>
            <p className="text-sm font-medium text-white line-clamp-1">{mission.cargo}</p>
          </div>

          {/* Grille informations matériel et chauffeur */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/60 space-y-0.5">
              <span className="text-slate-400 text-[10px] uppercase block">Véhicule affecté</span>
              <div className="flex items-center gap-1 mt-0.5 text-slate-200 font-semibold truncate">
                <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{mission.truckMatricule}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/60 space-y-0.5">
              <span className="text-slate-400 text-[10px] uppercase block">Chauffeur assigné</span>
              <div className="flex items-center gap-1 mt-0.5 text-slate-200 font-semibold truncate">
                <User className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{mission.driverName}</span>
              </div>
            </div>
          </div>

          {/* Modèle économique indicatif */}
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] uppercase text-slate-400 block font-medium">
                Montant fret estimé
              </span>
              <span className="text-sm font-bold text-white">
                {mission.estimatedAmountFcfa
                  ? formatFcfa(mission.estimatedAmountFcfa)
                  : mission.estimatedPrice}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase text-slate-400 block font-medium">
                Commission indicative
              </span>
              <span className="text-xs font-semibold text-amber-400">
                {mission.commissionAmountFcfa
                  ? formatFcfa(mission.commissionAmountFcfa)
                  : mission.commissionLabel}
              </span>
            </div>
          </div>

          {/* Étape actuelle dans le cycle */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Cycle de mission</span>
              <span className="text-slate-300 font-medium">{statusCfg.label}</span>
            </div>
            <div className="grid grid-cols-6 gap-1 h-1.5 rounded-full overflow-hidden bg-slate-800">
              <div
                className={`h-full ${
                  statusCfg.stepIndex >= 0 ? 'bg-amber-400' : 'bg-slate-700'
                }`}
                title="1. Candidature"
              />
              <div
                className={`h-full ${
                  statusCfg.stepIndex >= 1 ? 'bg-amber-400' : 'bg-slate-700'
                }`}
                title="2. Acceptation"
              />
              <div
                className={`h-full ${
                  statusCfg.stepIndex >= 2 ? 'bg-blue-400' : 'bg-slate-700'
                }`}
                title="3. Confirmation"
              />
              <div
                className={`h-full ${
                  statusCfg.stepIndex >= 3 ? 'bg-blue-300' : 'bg-slate-700'
                }`}
                title="4. Départ"
              />
              <div
                className={`h-full ${
                  statusCfg.stepIndex >= 4 ? 'bg-emerald-400' : 'bg-slate-700'
                }`}
                title="5. En cours"
              />
              <div
                className={`h-full ${
                  statusCfg.stepIndex >= 5 ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
                title="6. Terminée"
              />
            </div>
          </div>
        </CardContent>
      </div>

      {/* Pied de carte avec CTA */}
      <div className="p-4 sm:p-5 pt-3 mt-3 border-t border-slate-800/80 bg-slate-950/40 -mx-6 -mb-6 rounded-b-xl px-6 flex items-center justify-between gap-3">
        <span className="text-[11px] text-slate-400 truncate">
          Créée le {mission.createdAt}
        </span>

        <Link to={`/missions/${mission.id}`}>
          <Button variant="outline" size="sm" className="group-hover:border-amber-500/50 text-xs">
            <span>Détails & Suivi</span>
            <ChevronRight className="w-3.5 h-3.5 ml-1 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </Link>
      </div>
    </Card>
  )
}
