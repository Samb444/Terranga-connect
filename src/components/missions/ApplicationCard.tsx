import React from 'react'
import { Link } from 'react-router-dom'
import {
  MapPin,
  ArrowRight,
  Truck,
  PackageCheck,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  Route,
} from 'lucide-react'
import type { Application } from '../../types'
import { APPLICATION_STATUS_CONFIG } from '../../lib/missionUtils'
import { Card, CardHeader, CardContent } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'

interface ApplicationCardProps {
  application: Application
  role?: 'driver' | 'owner'
  onAccept?: (application: Application) => void
  onReject?: (application: Application) => void
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  role = 'driver',
  onAccept,
  onReject,
}) => {
  const statusCfg =
    APPLICATION_STATUS_CONFIG[application.status] || APPLICATION_STATUS_CONFIG.pending
  const isOwner = role === 'owner'

  return (
    <Card className="bg-slate-900/80 border-slate-800 hover:border-slate-700/80 transition-all flex flex-col justify-between group shadow-lg">
      <div>
        {/* En-tête de carte */}
        <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={statusCfg.variant}
              className={`text-xs font-semibold py-0.5 px-2.5 flex items-center gap-1.5 ${statusCfg.badgeClass}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dotColor}`} />
              <span>{statusCfg.label}</span>
            </Badge>

            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{application.appliedAt}</span>
            </span>
          </div>

          <Badge variant="outline" className="text-[10px] text-slate-400 py-0.5 px-2 shrink-0">
            Démonstration
          </Badge>
        </CardHeader>

        <CardContent className="space-y-4 pt-1">
          {/* Corridor Origine -> Destination */}
          <div className="flex items-center gap-2 text-base sm:text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
            <div className="flex items-center gap-1 text-slate-100">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{application.origin}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="flex items-center gap-1 text-slate-100">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{application.destination}</span>
            </div>
          </div>

          {/* Titre ou cargaison */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 text-slate-400 text-[10px] uppercase font-semibold">
                <PackageCheck className="w-3 h-3 text-amber-400" />
                <span>Marchandise</span>
              </span>
              <span className="text-[11px] text-slate-400 truncate max-w-[180px]">
                {application.departureDate}
              </span>
            </div>
            <p className="text-sm font-medium text-white line-clamp-1">{application.cargo}</p>
          </div>

          {/* Grille informations supplémentaires */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/60 space-y-0.5">
              <span className="text-slate-400 text-[10px] uppercase block">Type requis / camion</span>
              <div className="flex items-center gap-1.5 text-slate-200 font-semibold truncate">
                <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{application.truckType}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/60 space-y-0.5">
              <span className="text-slate-400 text-[10px] uppercase block">
                {isOwner ? 'Chauffeur candidat' : 'Profil candidat'}
              </span>
              <div className="flex items-center gap-1.5 text-slate-200 font-semibold truncate">
                <User className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{application.driverName}</span>
              </div>
            </div>
          </div>

          {/* Section détaillée pour le propriétaire */}
          {isOwner && (
            <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/15 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-amber-400/90 font-medium">Expérience déclarée :</span>
                <span className="text-slate-300 font-semibold">{application.driverExperience}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-amber-400/90 font-medium">Camion proposé :</span>
                <span className="text-slate-300 truncate max-w-[200px]">
                  {application.proposedTruck}
                </span>
              </div>
              {application.notes && (
                <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800/60">
                  « {application.notes} »
                </p>
              )}
            </div>
          )}

          {/* Note explicative pour le chauffeur */}
          {!isOwner && application.notes && (
            <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/60 text-xs text-slate-300">
              <span className="text-slate-400 text-[10px] block uppercase font-medium">Votre note :</span>
              <p className="italic text-slate-300 text-[11px] mt-0.5">« {application.notes} »</p>
            </div>
          )}
        </CardContent>
      </div>

      {/* Actions en bas de carte */}
      <div className="p-4 sm:p-5 pt-3 mt-3 border-t border-slate-800/80 bg-slate-950/40 -mx-6 -mb-6 rounded-b-xl px-6 flex flex-wrap items-center justify-between gap-3">
        {isOwner ? (
          /* Actions Propriétaire : Accepter ou Refuser */
          application.status === 'pending' ? (
            <div className="flex items-center gap-2 w-full sm:w-auto ml-auto">
              {onReject && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReject(application)}
                  className="text-xs text-rose-300 hover:text-white hover:bg-rose-500/20 hover:border-rose-500/40 border-rose-500/20"
                >
                  <XCircle className="w-3.5 h-3.5 mr-1" />
                  <span>Refuser</span>
                </Button>
              )}
              {onAccept && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onAccept(application)}
                  className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/30"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  <span>Accepter la candidature</span>
                </Button>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between w-full text-xs">
              <span className="text-slate-400">Décision enregistrée</span>
              {application.missionId && (
                <Link to={`/missions/${application.missionId}`}>
                  <Button variant="outline" size="sm" className="text-xs">
                    <Route className="w-3.5 h-3.5 mr-1 text-amber-400" />
                    <span>Voir la mission créée</span>
                  </Button>
                </Link>
              )}
            </div>
          )
        ) : (
          /* Actions Chauffeur : Lien opportunité ou lien mission si acceptée */
          <div className="flex items-center justify-between w-full text-xs">
            <Link
              to={`/opportunites/${application.opportunityId}`}
              className="text-slate-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
            >
              <span>Fiche opportunité</span>
              <ArrowRight className="w-3 h-3" />
            </Link>

            {application.missionId ? (
              <Link to={`/missions/${application.missionId}`}>
                <Button variant="primary" size="sm" className="text-xs">
                  <Route className="w-3.5 h-3.5 mr-1" />
                  <span>Accéder à la mission</span>
                </Button>
              </Link>
            ) : (
              <Badge variant="outline" className="text-[10px] text-slate-400">
                {statusCfg.description}
              </Badge>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
