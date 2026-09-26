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
} from 'lucide-react'
import { useTransport } from '../hooks/useTransport'
import { Header } from '../layouts/Header'
import { Footer } from '../layouts/Footer'
import { MissionTimeline } from '../components/missions/MissionTimeline'
import {
  MissionActionModal,
  type MissionActionType,
} from '../components/modals/MissionActionModal'
import { DiscoveryModal } from '../components/modals/DiscoveryModal'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import {
  MISSION_STATUS_CONFIG,
  calculateMissionEconomics,
} from '../lib/missionUtils'

export const MissionDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const {
    getMissionById,
    acceptMission,
    confirmMission,
    startMission,
    completeMission,
    cancelMission,
  } = useTransport()

  const [isDiscoveryOpen, setIsDiscoveryOpen] = useState(false)
  const [modalAction, setModalAction] = useState<MissionActionType>('start')
  const [isActionModalOpen, setIsActionModalOpen] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)

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
                Démonstration Phase 6
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

        {/* Bloc central : Timeline & Actions de simulation du cycle */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne gauche (2 colonnes) : Timeline & Détails cargaison */}
          <div className="lg:col-span-2 space-y-6">
            {/* Timeline visuelle interactive */}
            <MissionTimeline timeline={mission.timeline} status={mission.status} />

            {/* Fiche détaillée acteurs et conditions */}
            <Card className="bg-slate-900/80 border-slate-800 p-6 space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <FileText className="w-4 h-4 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  Acteurs & Informations opérationnelles
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
            {/* Panneau d'actions de simulation (Exigence 10) */}
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
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => handleOpenActionModal('accept')}
                      className="w-full justify-center bg-blue-600 hover:bg-blue-500 text-white shadow-blue-950/30 text-xs font-bold"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1.5" />
                      <span>Accepter la mission</span>
                    </Button>
                  </div>
                )}

                {/* Action : Démarrer la mission (si accepted ou confirmed) */}
                {(mission.status === 'accepted' || mission.status === 'confirmed') && (
                  <div className="space-y-2">
                    <span className="text-[10px] text-slate-400 uppercase font-medium block">
                      Action disponible :
                    </span>
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => handleOpenActionModal('start')}
                      className="w-full justify-center bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/30 text-xs font-bold"
                    >
                      <Play className="w-4 h-4 mr-1.5 fill-current" />
                      <span>Démarrer la mission</span>
                    </Button>
                  </div>
                )}

                {/* Action : Terminer la mission (si in_progress) */}
                {mission.status === 'in_progress' && (
                  <div className="space-y-2">
                    <span className="text-[10px] text-slate-400 uppercase font-medium block">
                      Action disponible :
                    </span>
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => handleOpenActionModal('complete')}
                      className="w-full justify-center bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/30 text-xs font-bold"
                    >
                      <CheckCheck className="w-4 h-4 mr-1.5" />
                      <span>Terminer la mission</span>
                    </Button>
                  </div>
                )}

                {/* État mission déjà terminée */}
                {mission.status === 'completed' && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 text-center space-y-1">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                    <p className="font-bold">Mission terminée</p>
                    <p className="text-[11px] text-emerald-300/80">
                      Le cycle complet a été clôturé et validé avec succès.
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

                {/* Bouton d'annulation (si pas déjà terminée ou annulée) */}
                {mission.status !== 'completed' && mission.status !== 'cancelled' && (
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

            {/* Modèle économique & Décomposition financière (Exigence 14) */}
            <Card className="bg-slate-900/90 border-slate-800 p-6 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                <Coins className="w-4 h-4 text-amber-400" />
                <h3 className="text-base font-bold text-white">Modèle économique indicatif</h3>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400">Montant fret brut estimé :</span>
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
                  <span className="text-slate-400">Net estimé transporteur / chauffeur :</span>
                  <span className="font-bold text-emerald-400">
                    {economics.driverNetFormatted}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-t border-slate-800/60">
                  <span className="text-slate-400">Avance carburant & péages (10-15%) :</span>
                  <span className="font-medium text-slate-300">
                    ~ {economics.fuelAdvanceFormatted}
                  </span>
                </div>
              </div>

              {/* Mention obligatoire Exigence 14 */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <span className="font-semibold text-slate-300 block">
                  Hypothèses de démonstration :
                </span>
                <p className="leading-relaxed">
                  Modèle économique envisagé : 30 % sur trajet aller, 40 % sur retour optimisé,
                  abonnement matériel 30 000 FCFA/mois. Aucun paiement réel n’est déclenché.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
      <DiscoveryModal isOpen={isDiscoveryOpen} onClose={() => setIsDiscoveryOpen(false)} />
      <MissionActionModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        mission={mission}
        actionType={modalAction}
        onConfirmAction={handleConfirmAction}
      />
    </div>
  )
}
