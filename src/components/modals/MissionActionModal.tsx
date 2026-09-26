import React from 'react'
import type { Mission } from '../../types'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import {
  CheckCircle2,
  Play,
  CheckCheck,
  AlertTriangle,
  MapPin,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'

export type MissionActionType = 'accept' | 'confirm' | 'start' | 'complete' | 'cancel'

interface MissionActionModalProps {
  isOpen: boolean
  onClose: () => void
  mission: Mission | null
  actionType: MissionActionType
  onConfirmAction: (missionId: string, actionType: MissionActionType) => void
}

export const MissionActionModal: React.FC<MissionActionModalProps> = ({
  isOpen,
  onClose,
  mission,
  actionType,
  onConfirmAction,
}) => {
  if (!mission) return null

  const config: Record<
    MissionActionType,
    {
      title: string
      subtitle: string
      confirmLabel: string
      icon: React.ReactNode
      buttonVariant: 'primary' | 'secondary' | 'outline' | 'ghost'
      buttonClass?: string
      alertText: string
    }
  > = {
    accept: {
      title: 'Accepter la mission de transport ?',
      subtitle: 'Validation de l’ordre de mission et accord entre les parties.',
      confirmLabel: 'Accepter la mission',
      icon: <CheckCircle2 className="w-4 h-4 mr-1.5" />,
      buttonVariant: 'primary',
      buttonClass: 'bg-blue-600 hover:bg-blue-500 text-white',
      alertText:
        'Le statut de la mission passera à « Acceptée ». Le chauffeur pourra ensuite démarrer le trajet dès le chargement effectué.',
    },
    confirm: {
      title: 'Confirmer la mission de transport ?',
      subtitle: 'Validation finale de l’ordre de mission par le propriétaire.',
      confirmLabel: 'Confirmer la mission',
      icon: <CheckCircle2 className="w-4 h-4 mr-1.5" />,
      buttonVariant: 'primary',
      buttonClass: 'bg-blue-600 hover:bg-blue-500 text-white',
      alertText:
        'La mission sera fermement acceptée et validée. Le chauffeur pourra ensuite la démarrer au moment du chargement.',
    },
    start: {
      title: 'Démarrer le trajet de mission ?',
      subtitle: 'Prise en charge de la marchandise et départ sur le corridor.',
      confirmLabel: 'Démarrer le trajet',
      icon: <Play className="w-4 h-4 mr-1.5 fill-current" />,
      buttonVariant: 'primary',
      buttonClass: 'bg-emerald-600 hover:bg-emerald-500 text-white',
      alertText:
        'Le statut passera à "En cours". La mission apparaîtra comme active sur les tableaux de bord.',
    },
    complete: {
      title: 'Clôturer et marquer comme terminée ?',
      subtitle: 'Attestation de déchargement complet et émargement de la livraison.',
      confirmLabel: 'Valider la fin de mission',
      icon: <CheckCheck className="w-4 h-4 mr-1.5" />,
      buttonVariant: 'primary',
      buttonClass: 'bg-emerald-600 hover:bg-emerald-500 text-white',
      alertText:
        'La mission sera enregistrée dans l’historique des courses terminées avec succès.',
    },
    cancel: {
      title: 'Annuler cette mission ?',
      subtitle: 'Interruption de la mission dans la session de démonstration.',
      confirmLabel: 'Confirmer l’annulation',
      icon: <AlertTriangle className="w-4 h-4 mr-1.5" />,
      buttonVariant: 'outline',
      buttonClass: 'text-rose-300 hover:text-white hover:bg-rose-600 border-rose-500/40',
      alertText:
        'La mission sera marquée comme annulée. Cette action est irréversible dans la session.',
    },
  }

  const currentCfg = config[actionType]

  const handleConfirm = () => {
    onConfirmAction(mission.id, actionType)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={currentCfg.title}
      subtitle={currentCfg.subtitle}
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Rappel des données de mission */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-amber-400 font-bold">{mission.missionCode}</span>
            <span className="text-slate-400">{mission.cargo}</span>
          </div>

          <div className="flex items-center gap-2 font-bold text-white text-sm sm:text-base">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{mission.origin}</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{mission.destination}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-1 border-t border-slate-800/80">
            <div>
              <span className="text-slate-400 text-[10px] uppercase block">Camion :</span>
              <span className="font-medium text-white truncate block">
                {mission.truckMatricule}
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase block">Chauffeur :</span>
              <span className="font-medium text-white truncate block">
                {mission.driverName}
              </span>
            </div>
          </div>
        </div>

        {/* Encadré explicatif */}
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
            actionType === 'cancel'
              ? 'bg-rose-500/10 border-rose-500/25 text-rose-200'
              : 'bg-amber-500/10 border-amber-500/25 text-amber-200'
          }`}
        >
          {actionType === 'cancel' ? (
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          )}
          <p className="text-[11px] leading-relaxed">{currentCfg.alertText}</p>
        </div>

        {/* Boutons d'action */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
            Retour
          </Button>

          <Button
            variant={currentCfg.buttonVariant}
            size="sm"
            onClick={handleConfirm}
            className={`text-xs ${currentCfg.buttonClass || ''}`}
          >
            {currentCfg.icon}
            <span>{currentCfg.confirmLabel}</span>
          </Button>
        </div>
      </div>
    </Modal>
  )
}
