import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  RotateCcw,
  CheckCircle2,
  Play,
  CheckCheck,
  AlertTriangle,
  AlertCircle,
  Coins,
  FileText,
  Phone,
  PackageCheck,
  Truck,
  Navigation,
  Clock,
} from 'lucide-react'
import { useTransport } from '../hooks/useTransport'
import { Header } from '../layouts/Header'
import { Footer } from '../layouts/Footer'
import { MissionTimeline } from '../components/missions/MissionTimeline'
import { MissionOperationalTracking } from '../components/missions/MissionOperationalTracking'
import {
  MissionActionModal,
  type MissionActionType,
} from '../components/modals/MissionActionModal'
import { OperationalActionModal } from '../components/modals/OperationalActionModal'
import { DeliveryConfirmationModal } from '../components/modals/DeliveryConfirmationModal'
import { DiscoveryModal } from '../components/modals/DiscoveryModal'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import {
  MISSION_STATUS_CONFIG,
  calculateMissionEconomics,
  getNextOperationalAction,
} from '../lib/missionUtils'
import type { OperationalStepId } from '../types'

export const MissionDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const {
    getMissionById,
    acceptMission,
    confirmMission,
    startMission,
    completeMission,
    cancelMission,
    confirmPickup,
    startTransit,
    signalArrival,
    confirmDelivery,
    activeRole,
    settlements,
    fuelVouchers,
    releaseTransporterSettlement,
    redeemFuelVoucher,
  } = useTransport()

  const [isDiscoveryOpen, setIsDiscoveryOpen] = useState(false)
  const [modalAction, setModalAction] = useState<MissionActionType>('start')
  const [isActionModalOpen, setIsActionModalOpen] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)

  // Modals opérationnels Phase 7
  const [isOperationalModalOpen, setIsOperationalModalOpen] = useState(false)
  const [operationalStepToConfirm, setOperationalStepToConfirm] =
    useState<OperationalStepId>('pickup')
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false)

  const mission = id ? getMissionById(id) : undefined

  if (!mission) {
    return (
      <div className="min-h-screen flex flex-col bg-[#070d1e] text-slate-100 font-sans">
        <Header onOpenJoinModal={() => setIsDiscoveryOpen(true)} />
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-16 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
          <h1 className="text-2xl font-bold text-white">Mission non trouvée</h1>
          <p className="text-sm text-slate-400">
            La mission demandée n'existe pas ou la session de démonstration a été réinitialisée.
          </p>
          <Link to="/missions">
            <Button variant="primary" size="md">
              Retour aux missions
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  const statusCfg =
    MISSION_STATUS_CONFIG[mission.status] || MISSION_STATUS_CONFIG.pending
  const isReturn = mission.tripType === 'return_cargo'
  const economics = calculateMissionEconomics(
    mission.estimatedAmountFcfa || mission.estimatedPrice,
    isReturn
  )
  const nextOperationalAction = getNextOperationalAction(mission)

  const missionSettlement = settlements.find((s) => s.missionId === mission.id)
  const missionFuelVoucher = fuelVouchers.find((v) => v.missionId === mission.id)

  const handleReleaseSettlement = async (settlementId: string) => {
    try {
      await releaseTransporterSettlement(settlementId)
      setFeedbackMessage('Règlement final validé et solde versé avec succès au transporteur !')
    } catch (e) {
      setFeedbackMessage(e instanceof Error ? e.message : 'Erreur lors du versement du solde.')
    }
  }

  const handleRedeemVoucher = async (voucherId: string) => {
    try {
      await redeemFuelVoucher(voucherId)
      setFeedbackMessage('Bon carburant consommé en station avec succès (simulation démo).')
    } catch (e) {
      setFeedbackMessage(e instanceof Error ? e.message : 'Erreur lors de la validation du bon.')
    }
  }

  // Gestion des actions du cycle général Phase 6
  const handleOpenActionModal = (actionType: MissionActionType) => {
    setModalAction(actionType)
    setIsActionModalOpen(true)
  }

  const handleConfirmAction = (missionId: string, actionType: MissionActionType) => {
    if (actionType === 'accept') {
      acceptMission(missionId)
      setFeedbackMessage('Mission acceptée avec succès ! Le départ peut désormais être préparé.')
    } else if (actionType === 'confirm') {
      confirmMission(missionId)
      setFeedbackMessage('Mission validée avec succès !')
    } else if (actionType === 'start') {
      startMission(missionId)
      setFeedbackMessage('Trajet démarré ! La mission est désormais en cours d’acheminement.')
    } else if (actionType === 'complete') {
      completeMission(missionId)
      setFeedbackMessage('Mission clôturée ! Livraison marquée comme achevée avec succès.')
    } else if (actionType === 'cancel') {
      cancelMission(missionId)
      setFeedbackMessage('Mission annulée dans la démonstration.')
    }
  }

  // Déclencheur des étapes de suivi opérationnel Phase 7
  const handleTriggerOperationalStep = (stepId: OperationalStepId) => {
    if (stepId === 'delivery') {
      setIsDeliveryModalOpen(true)
    } else {
      setOperationalStepToConfirm(stepId)
      setIsOperationalModalOpen(true)
    }
  }

  const handleConfirmOperationalAction = (
    missionId: string,
    stepId: OperationalStepId,
    details?: { location?: string; notes?: string }
  ) => {
    if (stepId === 'pickup') {
      confirmPickup(missionId, details)
      setFeedbackMessage('Prise en charge validée ! La marchandise est sécurisée à bord.')
    } else if (stepId === 'in_transit') {
      startTransit(missionId, details)
      setFeedbackMessage('Départ confirmé ! Le camion est en route sur le corridor routier.')
    } else if (stepId === 'arrival') {
      signalArrival(missionId, details)
      setFeedbackMessage('Arrivée à destination signalée ! Le véhicule est stationné pour déchargement.')
    }
  }

  const handleConfirmDeliveryAction = (
    missionId: string,
    confirmation: {
      signerName: string
      signerRole: string
      notes?: string
      receiptCode: string
    }
  ) => {
    confirmDelivery(missionId, confirmation)
    setFeedbackMessage(
      `Livraison confirmée et émargée avec succès par ${confirmation.signerName} (Réf : ${confirmation.receiptCode}) !`
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#070d1e] text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      <Header onOpenJoinModal={() => setIsDiscoveryOpen(true)} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Fil d'Ariane */}
        <div className="flex items-center gap-2 text-xs">
          <Link
            to="/missions"
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Toutes les missions</span>
          </Link>
          <span className="text-slate-400">/</span>
          <span className="text-amber-400 font-mono font-semibold truncate">
            {mission.missionCode}
          </span>
        </div>

        {/* Feedback message banner */}
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

        {/* En-tête de la fiche mission */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20">
                  {mission.missionCode}
                </span>

                <Badge
                  variant={statusCfg.variant}
                  className={`text-xs py-1 px-3 flex items-center gap-1.5 ${statusCfg.badgeClass}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dotColor}`} />
                  <span>{statusCfg.label}</span>
                </Badge>

                {isReturn && (
                  <Badge variant="success" className="text-xs py-1 px-3">
                    <RotateCcw className="w-3 h-3 mr-1" />
                    <span>Retour optimisé</span>
                  </Badge>
                )}
              </div>

              <Badge variant="outline" className="text-xs text-slate-400 py-1 px-3">
                Démonstration Phase 7
              </Badge>
            </div>

            {/* Titre & Description de la mission */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {mission.title || `Transport de fret ${mission.cargo} (${mission.origin} → ${mission.destination})`}
              </h1>
              <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
                {mission.description || `Mission de transport routier de ${mission.cargo} entre ${mission.origin} et ${mission.destination}.`}
              </p>
            </div>

            {/* Corridor principal */}
            <div className="flex flex-wrap items-center gap-3 text-lg sm:text-xl font-bold text-white pt-1">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0" />
                <span>{mission.origin}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="flex items-center gap-1.5">
                <MapPin className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{mission.destination}</span>
              </div>
              <span className="text-xs font-normal text-slate-400">
                (~{mission.estimatedDistance} km)
              </span>
            </div>

            {/* Métriques clés en ligne */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400 text-[10px] uppercase block font-medium">
                  Créée le
                </span>
                <span className="text-xs sm:text-sm font-bold text-white block mt-0.5 truncate">
                  {mission.createdAt}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400 text-[10px] uppercase block font-medium">
                  Date de départ
                </span>
                <span className="text-xs sm:text-sm font-bold text-white block mt-0.5 truncate">
                  {mission.departureDate}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400 text-[10px] uppercase block font-medium">
                  Véhicule assigné
                </span>
                <span className="text-xs sm:text-sm font-bold text-amber-400 block mt-0.5 truncate">
                  {mission.truckMatricule}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400 text-[10px] uppercase block font-medium">
                  Tarif fret convenu
                </span>
                <span className="text-xs sm:text-sm font-bold text-emerald-400 block mt-0.5 truncate">
                  {economics.totalFormatted}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* --- SECTION DÉDIÉE : SUIVI OPÉRATIONNEL & GESTION DE LA LIVRAISON (PHASE 7 - Exigence Section 6) --- */}
        <MissionOperationalTracking
          mission={mission}
          onTriggerOperationalStep={handleTriggerOperationalStep}
        />

        {/* Bloc central : Timeline générale Phase 6 & Fiche d'acteurs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne gauche (2 colonnes) : Timeline générale & Acteurs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Timeline générale du cycle de vie (Phase 6) */}
            <MissionTimeline timeline={mission.timeline} status={mission.status} />

            {/* Fiche détaillée acteurs et conditions */}
            <Card className="bg-slate-900/80 border-slate-800 p-6 space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <FileText className="w-4 h-4 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  Acteurs & Informations contractuelles
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Transporteur propriétaire */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                    Transporteur / Propriétaire
                  </span>
                  <p className="font-bold text-white text-sm">{mission.ownerName}</p>
                  <p className="text-slate-400 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>Contact : +221 77 *** ** 89 [Fictif]</span>
                  </p>
                  <Badge variant="outline" className="text-[10px]">
                    Flotte Teranga Connect
                  </Badge>
                </div>

                {/* Chauffeur professionnel */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">
                    Chauffeur professionnel
                  </span>
                  <p className="font-bold text-white text-sm">{mission.driverName}</p>
                  <p className="text-slate-400 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{mission.driverPhone || '+221 77 *** ** 42 [Fictif]'}</span>
                  </p>
                  <Badge variant="success" className="text-[10px]">
                    Permis C/E Vérifié [Démo]
                  </Badge>
                </div>
              </div>

              {/* Véhicule & Calendrier opérationnel (Aller & Retour) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase block font-medium">
                    Camion & Spécifications
                  </span>
                  <p className="font-bold text-white text-sm">{mission.truckMatricule}</p>
                  <p className="text-slate-400 text-xs">{mission.truckType}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase block font-medium">
                    Date éventuelle de retour
                  </span>
                  <p className="font-bold text-white text-sm">
                    {mission.returnDate || (isReturn ? 'Retour immédiat après déchargement' : 'Trajet simple direct (Sans retour)')}
                  </p>
                  <p className="text-slate-400 text-xs">
                    Départ aller : {mission.departureDate}
                  </p>
                </div>
              </div>

              {mission.notes && (
                <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80 text-xs text-slate-300 space-y-1">
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">
                    Consignes & Observations de mission :
                  </span>
                  <p className="italic text-[11px] leading-relaxed">« {mission.notes} »</p>
                </div>
              )}
            </Card>
          </div>

          {/* Colonne droite (1 colonne) : Actions de simulation & Modèle économique */}
          <div className="space-y-6">
            {/* Panneau d'actions de simulation (Console d'action synchronisée) */}
            <Card className="bg-slate-900/90 border-slate-800 p-6 space-y-5">
              <div className="space-y-1.5 pb-3 border-b border-slate-800">
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                  Console d'action démonstration
                </span>
                <h3 className="text-base font-bold text-white">Pilotage du cycle de mission</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Permet de tester en direct le passage entre les statuts opérationnels.
                </p>
              </div>

              <div className="space-y-3">
                {/* Action : Accepter la mission (si pending ou interest) */}
                {(mission.status === 'pending' || mission.status === 'interest') && (
                  <div className="space-y-2">
                    <span className="text-[10px] text-slate-400 uppercase font-medium block">
                      Action disponible :
                    </span>
                    {activeRole === 'truck_owner' ? (
                      <Button
                        variant="primary"
                        size="md"
                        onClick={() => handleOpenActionModal('accept')}
                        className="w-full justify-center bg-blue-600 hover:bg-blue-500 text-white shadow-blue-950/30 text-xs font-bold"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1.5" />
                        <span>Accepter la mission</span>
                      </Button>
                    ) : (
                      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 text-center">
                        <Clock className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                        <span>En attente de validation par le propriétaire du camion.</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Action : Démarrer la mission (si accepted ou confirmed) */}
                {(mission.status === 'accepted' || mission.status === 'confirmed') && (
                  <div className="space-y-2">
                    <span className="text-[10px] text-slate-400 uppercase font-medium block">
                      Action disponible :
                    </span>
                    {activeRole === 'driver' ? (
                      <Button
                        variant="primary"
                        size="md"
                        onClick={() => handleOpenActionModal('start')}
                        className="w-full justify-center bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/30 text-xs font-bold"
                      >
                        <Play className="w-4 h-4 mr-1.5 fill-current" />
                        <span>Démarrer la mission</span>
                      </Button>
                    ) : (
                      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 text-center">
                        <Truck className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                        <span>Mission acceptée. Prête pour le départ par le chauffeur ({mission.driverName}).</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions opérationnelles directes quand la mission est en cours (Phase 7 & 8) */}
                {mission.status === 'in_progress' && nextOperationalAction && (
                  <div className="space-y-2.5">
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-medium block">
                        Action opérationnelle suivante :
                      </span>
                      {activeRole === 'driver' ? (
                        <Button
                          variant="primary"
                          size="md"
                          onClick={() => handleTriggerOperationalStep(nextOperationalAction.stepId)}
                          className={`w-full justify-center text-xs font-bold ${
                            nextOperationalAction.stepId === 'delivery'
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40'
                              : nextOperationalAction.stepId === 'arrival'
                              ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-950/40'
                              : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-950/40'
                          }`}
                        >
                          {nextOperationalAction.stepId === 'pickup' && (
                            <PackageCheck className="w-4 h-4 mr-1.5" />
                          )}
                          {nextOperationalAction.stepId === 'in_transit' && (
                            <Truck className="w-4 h-4 mr-1.5" />
                          )}
                          {nextOperationalAction.stepId === 'arrival' && (
                            <Navigation className="w-4 h-4 mr-1.5" />
                          )}
                          {nextOperationalAction.stepId === 'delivery' && (
                            <CheckCheck className="w-4 h-4 mr-1.5" />
                          )}
                          <span>{nextOperationalAction.actionLabel}</span>
                        </Button>
                      ) : (
                        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 text-center space-y-1">
                          <span className="text-amber-400 font-semibold block text-[11px]">
                            {nextOperationalAction.actionLabel}
                          </span>
                          <span>Action réservée au chauffeur assigné ({mission.driverName}).</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* État mission déjà terminée */}
                {mission.status === 'completed' && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 text-center space-y-1">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                    <p className="font-bold">Mission terminée & livrée</p>
                    <p className="text-[11px] text-emerald-300/80">
                      Le cycle opérationnel et contradictoire a été clôturé avec succès.
                    </p>
                  </div>
                )}

                {/* État mission annulée */}
                {mission.status === 'cancelled' && (
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 text-center space-y-1">
                    <AlertTriangle className="w-6 h-6 text-rose-400 mx-auto" />
                    <p className="font-bold">Mission annulée</p>
                    <p className="text-[11px] text-rose-300/80">
                      Cette mission a été annulée dans la démonstration.
                    </p>
                  </div>
                )}

                {/* Bouton d'annulation (réservé au propriétaire / gestion de mission) */}
                {activeRole === 'truck_owner' && mission.status !== 'completed' && mission.status !== 'cancelled' && (
                  <div className="pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenActionModal('cancel')}
                      className="w-full justify-center text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                      <span>Annuler la mission</span>
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            {/* Modèle économique & Décomposition financière (Cahier des charges : 30% aller / 40% retour / séquestre / avance carburant 10-15%) */}
            <Card className="bg-slate-900/90 border-slate-800 p-6 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                <Coins className="w-4 h-4 text-amber-400" />
                <h3 className="text-base font-bold text-white">Modèle économique & Règlements</h3>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400">Montant fret brut convenu :</span>
                  <span className="font-bold text-white">{economics.totalFormatted}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-t border-slate-800/60">
                  <span className="text-slate-400">
                    Commission Teranga ({economics.commissionPercentLabel}) :
                  </span>
                  <span className="font-bold text-amber-400">
                    - {economics.commissionFormatted}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-t border-slate-800/60">
                  <span className="text-slate-400">Avance carburant ({economics.advancePercent}%) :</span>
                  <span className="font-medium text-amber-300">
                    {economics.fuelAdvanceFormatted}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-t border-slate-800/60">
                  <span className="text-slate-400">Solde final après avance :</span>
                  <span className="font-bold text-emerald-400">
                    {economics.remainingBalanceFormatted}
                  </span>
                </div>
              </div>

              {/* État du Règlement Financier (Settlement) */}
              <div className="pt-2 border-t border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">
                    Cycle Financier (Séquestre & Settlement)
                  </span>
                  {missionSettlement && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        missionSettlement.status === 'settled'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : missionSettlement.status === 'settlement_pending'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse'
                          : missionSettlement.status === 'funded'
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {missionSettlement.status === 'settled'
                        ? 'Soldé / Clôturé'
                        : missionSettlement.status === 'settlement_pending'
                        ? 'En attente de versement solde'
                        : missionSettlement.status === 'advance_paid'
                        ? 'Avance versée'
                        : missionSettlement.status === 'funded'
                        ? 'Séquestre approvisionné'
                        : missionSettlement.status === 'delivery_confirmed'
                        ? 'Livraison confirmée'
                        : 'En attente financement'}
                    </span>
                  )}
                </div>

                {/* Progression financière distincte de la livraison */}
                <div className="space-y-2 text-[11px]">
                  <div className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <span className="font-semibold text-white">Séquestre Chargeur :</span>
                      <p className="text-slate-400 text-[10px]">
                        {missionSettlement?.status === 'pending'
                          ? 'En attente de consignation des fonds.'
                          : 'Fonds sécurisés à 100% sur compte séquestre Teranga.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                        missionSettlement &&
                        ['advance_paid', 'delivery_confirmed', 'settlement_pending', 'settled'].includes(
                          missionSettlement.status
                        )
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {missionSettlement &&
                      ['advance_paid', 'delivery_confirmed', 'settlement_pending', 'settled'].includes(
                        missionSettlement.status
                      )
                        ? '✓'
                        : '2'}
                    </div>
                    <div>
                      <span className="font-semibold text-white">
                        Avance Carburant & Péages ({economics.advancePercent}%) :
                      </span>
                      <p className="text-slate-400 text-[10px]">
                        {missionFuelVoucher
                          ? `Bon numérique émis (${missionFuelVoucher.reference})`
                          : 'Débloqué dès départ confirmé'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                        missionSettlement?.status === 'settled'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : missionSettlement?.status === 'settlement_pending'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {missionSettlement?.status === 'settled' ? '✓' : '3'}
                    </div>
                    <div>
                      <span className="font-semibold text-white">Solde Net Transporteur :</span>
                      <p className="text-slate-400 text-[10px]">
                        {missionSettlement?.status === 'settled'
                          ? `Solde de ${economics.remainingBalanceFormatted} versé le ${missionSettlement.settledAt || 'récemment'}.`
                          : missionSettlement?.status === 'settlement_pending'
                          ? 'Livraison émargée. Étape financière requise pour débloquer le solde.'
                          : 'Versé après confirmation contradictoire du bordereau POD.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Déblocage Financier si settlement_pending */}
                {missionSettlement?.status === 'settlement_pending' && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                      <Coins className="w-3.5 h-3.5" />
                      <span>Règlement prêt à être débloqué</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      La livraison a été confirmée avec émargement. Conformément au cahier des charges, le statut financier ne passe pas automatiquement à « soldé » sans validation.
                    </p>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleReleaseSettlement(missionSettlement.id)}
                      className="w-full justify-center bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      <span>Débloquer le versement du solde ({economics.remainingBalanceFormatted})</span>
                    </Button>
                  </div>
                )}
              </div>

              {/* Bon Carburant Numérique Associé */}
              {missionFuelVoucher && (
                <div className="pt-2 border-t border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                      Bon Carburant Numérique
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        missionFuelVoucher.status === 'used'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {missionFuelVoucher.status === 'used' ? 'Consommé en station' : 'Disponible'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Réf. Bon :</span>
                      <span className="font-mono font-bold text-white">{missionFuelVoucher.reference}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Réseau partenaire :</span>
                      <span className="font-semibold text-slate-200">{missionFuelVoucher.provider}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Valeur avance :</span>
                      <span className="font-bold text-amber-400">
                        {economics.fuelAdvanceFormatted}
                      </span>
                    </div>
                    {missionFuelVoucher.status === 'issued' && (
                      <div className="pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRedeemVoucher(missionFuelVoucher.id)}
                          className="w-full justify-center text-[11px] border-amber-500/40 text-amber-300 hover:bg-amber-500/10"
                        >
                          Simuler scan en station-service
                        </Button>
                      </div>
                    )}
                    <p className="text-[10px] text-slate-500 italic pt-1">
                      ⚠️ Bon carburant simulé — intégration fournisseur à venir (Total, Elton, Shell, Oryx)
                    </p>
                  </div>
                </div>
              )}

              {/* Mention obligatoire et intégrations réelles */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <span className="font-semibold text-slate-300 block">
                  Règles économiques du cahier des charges :
                </span>
                <p className="leading-relaxed">
                  30 % sur trajet aller, 40 % sur retour optimisé, abonnement matériel 30 000 FCFA/mois. Architecture prête pour intégration réelle Wave & Orange Money (mode démonstration actif).
                </p>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
      <DiscoveryModal isOpen={isDiscoveryOpen} onClose={() => setIsDiscoveryOpen(false)} />

      {/* Modal d'actions Phase 6 (Acceptation, Démarrage, Annulation) */}
      <MissionActionModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        mission={mission}
        actionType={modalAction}
        onConfirmAction={handleConfirmAction}
      />

      {/* Modal d'action opérationnelle Phase 7 (Prise en charge, Départ, Arrivée) */}
      <OperationalActionModal
        isOpen={isOperationalModalOpen}
        onClose={() => setIsOperationalModalOpen(false)}
        mission={mission}
        stepId={operationalStepToConfirm}
        onConfirm={handleConfirmOperationalAction}
      />

      {/* Modal d'émargement et confirmation de livraison (Exigence Section 9) */}
      <DeliveryConfirmationModal
        isOpen={isDeliveryModalOpen}
        onClose={() => setIsDeliveryModalOpen(false)}
        mission={mission}
        onConfirmDelivery={handleConfirmDeliveryAction}
      />
    </div>
  )
}
