import React, { useState } from 'react'
import {
  PackageCheck,
  Truck,
  MapPin,
  CheckCircle2,
  Clock,
  Navigation,
  FileCheck2,
  ShieldCheck,
  CheckCheck,
  AlertTriangle,
  History,
  ChevronDown,
  ChevronUp,
  UserCheck,
  ArrowRightLeft,
} from 'lucide-react'
import type { Mission, OperationalStepId } from '../../types'
import {
  OPERATIONAL_STEPS,
  OPERATIONAL_STATUS_CONFIG,
  getMissionTracking,
  getOperationalStepState,
  getNextOperationalAction,
  canPerformOperationalStep,
} from '../../lib/missionUtils'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { useTransport } from '../../hooks/useTransport'

interface MissionOperationalTrackingProps {
  mission: Mission
  onTriggerOperationalStep: (stepId: OperationalStepId) => void
}

export const MissionOperationalTracking: React.FC<MissionOperationalTrackingProps> = ({
  mission,
  onTriggerOperationalStep,
}) => {
  const { activeRole, setActiveRole } = useTransport()
  const [showHistory, setShowHistory] = useState(true)

  const tracking = getMissionTracking(mission)
  const currentStatusCfg = OPERATIONAL_STATUS_CONFIG[tracking.currentStatus]
  const nextAction = getNextOperationalAction(mission)

  const isCompleted = mission.status === 'completed'
  const isCancelled = mission.status === 'cancelled'
  const isPendingOrAccepted =
    mission.status === 'pending' || mission.status === 'accepted' || mission.status === 'interest'
  const isInProgress = mission.status === 'in_progress'

  const stepIcons: Record<OperationalStepId, React.ReactNode> = {
    pickup: <PackageCheck className="w-4 h-4" />,
    in_transit: <Truck className="w-4 h-4" />,
    arrival: <Navigation className="w-4 h-4" />,
    delivery: <CheckCheck className="w-4 h-4" />,
  }

  // Vérification de garde pour la prochaine action
  const nextGuard = nextAction
    ? canPerformOperationalStep(mission, nextAction.stepId)
    : { allowed: false }

  const handleToggleRole = () => {
    setActiveRole(activeRole === 'truck_owner' ? 'driver' : 'truck_owner')
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Halo subtil de fond */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* En-tête de la section Suivi Opérationnel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
              Phase 7 &bull; Suivi Opérationnel
            </span>
            <span className="text-xs font-mono font-bold text-amber-400">
              {mission.missionCode}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-400" />
            <span>Suivi opérationnel & Gestion de la livraison</span>
          </h2>

          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Acheminement en temps réel, jalons logistiques protégés et confirmation de réception.
          </p>
        </div>

        {/* Statut opérationnel actuel & Rôle */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant={
              isCompleted
                ? 'success'
                : isCancelled
                ? 'danger'
                : isInProgress
                ? 'success'
                : 'default'
            }
            className={`text-xs py-1.5 px-3 flex items-center gap-2 font-semibold ${currentStatusCfg.badgeClass}`}
          >
            <span className={`w-2 h-2 rounded-full ${currentStatusCfg.dotColor}`} />
            <span>{currentStatusCfg.label}</span>
          </Badge>

          {/* Rôle actif & switch rapide */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-300">
            <UserCheck className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Rôle actif :</span>
            <span className="font-semibold text-white">
              {activeRole === 'driver' ? 'Chauffeur' : 'Propriétaire'}
            </span>
            <button
              type="button"
              onClick={handleToggleRole}
              title="Basculer de rôle pour tester"
              className="ml-1 p-0.5 text-slate-400 hover:text-amber-400 cursor-pointer transition-colors"
            >
              <ArrowRightLeft className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* --- ÉTAT 1 : MISSION NON COMMENCÉE (Pending ou Accepted) --- */}
      {isPendingOrAccepted && (
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">
                Suivi opérationnel en attente de démarrage
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {mission.status === 'pending'
                  ? 'La mission est actuellement en attente d’acceptation formelle. Le suivi opérationnel s’activera une fois la mission acceptée et démarrée.'
                  : 'La mission est acceptée et attribuée. Dès que le chauffeur active le démarrage (« Démarrer la mission »), les étapes de prise en charge, transit et livraison seront opérationnelles.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* --- ÉTAT 2 : MISSION ANNULÉE --- */}
      {isCancelled && (
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 space-y-2">
          <div className="flex items-center gap-2 font-bold text-rose-300 text-sm">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Mission annulée — Suivi opérationnel désactivé</span>
          </div>
          <p className="text-xs text-rose-200/90 leading-relaxed">
            Cette mission a été clôturée suite à annulation. Aucune action de prise en charge ou de livraison ne peut être réalisée.
          </p>
        </div>
      )}

      {/* --- STEPPER OPÉRATIONNEL : LES 4 ÉTAPES CANONIQUES (Section 6 & 8) --- */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span className="font-semibold uppercase tracking-wider text-[10px]">
            Progression des étapes de livraison
          </span>
          <span className="text-[11px] text-slate-400">
            {isCompleted
              ? '4 / 4 étapes franchies'
              : isInProgress
              ? `${Math.max(1, currentStatusCfg.stepIndex)} / 4 étapes franchies`
              : '0 / 4 étapes franchies'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {OPERATIONAL_STEPS.map((step) => {
            const stepState = getOperationalStepState(tracking, step.id)
            const isStepDone = stepState === 'completed'
            const isStepActive = stepState === 'current'

            let stepTimestamp: string | undefined
            if (step.id === 'pickup') stepTimestamp = tracking.pickedUpAt
            if (step.id === 'in_transit') stepTimestamp = tracking.inTransitAt
            if (step.id === 'arrival') stepTimestamp = tracking.arrivedAt
            if (step.id === 'delivery') stepTimestamp = tracking.deliveredAt

            return (
              <div
                key={step.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                  isStepActive
                    ? 'bg-amber-500/10 border-amber-500/40 shadow-lg shadow-amber-950/20 ring-1 ring-amber-500/30'
                    : isStepDone
                    ? 'bg-emerald-950/20 border-emerald-500/30'
                    : 'bg-slate-950/50 border-slate-800/80 opacity-70'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isStepDone
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : isStepActive
                          ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold animate-pulse'
                          : 'bg-slate-800 text-slate-400 border border-slate-700/50'
                      }`}
                    >
                      {isStepDone ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <span>{step.stepNumber}</span>
                      )}
                    </span>

                    <span className="text-[10px] font-semibold uppercase tracking-wider">
                      {isStepDone ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Validé</span>
                        </span>
                      ) : isStepActive ? (
                        <span className="text-amber-400 font-bold bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-400/30">
                          Étape active
                        </span>
                      ) : (
                        <span className="text-slate-400">À venir</span>
                      )}
                    </span>
                  </div>

                  <div>
                    <h3
                      className={`text-sm font-bold flex items-center gap-1.5 ${
                        isStepActive
                          ? 'text-amber-300'
                          : isStepDone
                          ? 'text-white'
                          : 'text-slate-400'
                      }`}
                    >
                      <span>{stepIcons[step.id]}</span>
                      <span>{step.label}</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                      {step.description}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/60 text-[11px]">
                  <div className="text-slate-400 flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{step.locationDefault(mission)}</span>
                  </div>

                  {stepTimestamp && (
                    <div className="text-emerald-400/90 font-medium flex items-center gap-1 mt-1 truncate">
                      <Clock className="w-3 h-3 shrink-0" />
                      <span className="truncate">{stepTimestamp}</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* --- ZONE D'ACTION CONTEXTUELLE PROCHAIN PAS (Sections 7, 8, 9) --- */}
      {isInProgress && nextAction && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-amber-500/30 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>Action opérationnelle requise :</span>
              </span>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <span>Étape {nextAction.stepNumber} : {nextAction.label}</span>
              </h4>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                {nextAction.description}. Lieu prévu : <span className="text-amber-300 font-semibold">{nextAction.locationDefault}</span>.
              </p>
            </div>

            {activeRole === 'driver' ? (
              <Button
                variant="primary"
                size="md"
                disabled={!nextGuard.allowed}
                onClick={() => onTriggerOperationalStep(nextAction.stepId)}
                className={`shrink-0 text-xs font-extrabold px-5 py-2.5 shadow-lg cursor-pointer ${
                  nextAction.stepId === 'delivery'
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50'
                    : nextAction.stepId === 'arrival'
                    ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-950/50'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-950/40'
                }`}
              >
                {stepIcons[nextAction.stepId]}
                <span className="ml-1.5">{nextAction.actionLabel}</span>
              </Button>
            ) : (
              <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
                <Badge variant="outline" className="text-[11px] text-amber-400 border-amber-500/30 bg-amber-500/10 py-1 px-2.5">
                  Action réservée au Chauffeur
                </Badge>
                <button
                  type="button"
                  onClick={handleToggleRole}
                  className="text-[11px] text-slate-400 hover:text-amber-300 underline transition-colors cursor-pointer"
                >
                  Basculer en vue Chauffeur pour tester
                </button>
              </div>
            )}
          </div>

          {/* Règle de garde explicite */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Garde-métier : Les étapes doivent obligatoirement être validées dans l’ordre séquentiel.</span>
            </span>
            <span className="text-slate-400 font-mono">
              Chauffeur : {mission.driverName}
            </span>
          </div>
        </div>
      )}

      {/* --- ATTESTATION & CERTIFICAT DE LIVRAISON (Quand la mission est livrée) --- */}
      {isCompleted && tracking.deliveryConfirmation && (
        <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-500/20">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-md">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <span>Bordereau de livraison & Émargement contradictoire</span>
                  <Badge variant="success" className="text-[10px] py-0.5">
                    Validé
                  </Badge>
                </h4>
                <p className="text-xs text-emerald-300/80">
                  Récépissé officiel de fin de mission enregistré dans la session.
                </p>
              </div>
            </div>

            <div className="font-mono text-xs font-bold text-emerald-300 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-500/30 self-start sm:self-center">
              Réf : {tracking.deliveryConfirmation.receiptCode}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase block font-medium">
                Réceptionnaire sur site :
              </span>
              <p className="font-bold text-white text-sm">
                {tracking.deliveryConfirmation.signerName}
              </p>
              <p className="text-slate-400 text-[11px]">
                {tracking.deliveryConfirmation.signerRole}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase block font-medium">
                Date & Heure d'émargement :
              </span>
              <p className="font-bold text-emerald-400 text-sm">
                {tracking.deliveryConfirmation.confirmedAt}
              </p>
              <p className="text-slate-400 text-[11px]">Remise effectuée sans réserve</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase block font-medium">
                Destination de livraison :
              </span>
              <p className="font-bold text-white text-sm truncate">{mission.destination}</p>
              <p className="text-slate-400 text-[11px] truncate">
                Véhicule {mission.truckMatricule}
              </p>
            </div>
          </div>

          {tracking.deliveryConfirmation.notes && (
            <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 text-xs text-slate-300 space-y-0.5">
              <span className="text-slate-400 text-[10px] uppercase font-semibold block">
                Observations de déchargement :
              </span>
              <p className="italic text-[11px] text-slate-300">
                « {tracking.deliveryConfirmation.notes} »
              </p>
            </div>
          )}

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Livraison confirmée — Aucune action opérationnelle supplémentaire attendue.</span>
            </span>
            <span className="text-[11px] text-emerald-400/80 font-mono">Mission clôturée</span>
          </div>
        </div>
      )}

      {/* --- JOURNAL HISTORIQUE DES ÉVÉNEMENTS OPÉRATIONNELS (Section 11) --- */}
      <div className="pt-2 border-t border-slate-800">
        <button
          type="button"
          onClick={() => setShowHistory(!showHistory)}
          className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-white py-2 transition-colors cursor-pointer select-none"
        >
          <div className="flex items-center gap-2 font-semibold">
            <History className="w-4 h-4 text-amber-400" />
            <span>Historique chronologique des événements ({tracking.history.length})</span>
          </div>
          <div className="flex items-center gap-1 text-[11px]">
            <span>{showHistory ? 'Masquer' : 'Afficher'}</span>
            {showHistory ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </div>
        </button>

        {showHistory && (
          <div className="mt-3 space-y-2.5">
            {tracking.history.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-3 text-center">
                Aucun événement enregistré pour le moment.
              </p>
            ) : (
              <div className="space-y-2">
                {tracking.history.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-3 sm:p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-colors hover:border-slate-700"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs sm:text-sm">
                          {evt.label}
                        </span>
                        {evt.authorName && (
                          <span className="text-[10px] text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded">
                            Par {evt.authorName}
                          </span>
                        )}
                      </div>

                      {evt.location && (
                        <p className="text-[11px] text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                          <span>{evt.location}</span>
                        </p>
                      )}

                      {evt.notes && (
                        <p className="text-[11px] text-slate-300 italic pt-0.5">
                          « {evt.notes} »
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 text-slate-400 font-mono text-[11px] flex items-center gap-1.5 self-start sm:self-center">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{evt.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
