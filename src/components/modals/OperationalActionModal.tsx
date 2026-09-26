import React, { useState } from 'react'
import type { Mission, OperationalStepId } from '../../types'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import {
  PackageCheck,
  Truck,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Navigation,
} from 'lucide-react'

interface OperationalActionModalProps {
  isOpen: boolean
  onClose: () => void
  mission: Mission | null
  stepId: OperationalStepId
  onConfirm: (
    missionId: string,
    stepId: OperationalStepId,
    details?: { location?: string; notes?: string }
  ) => void
}

interface OperationalActionFormProps {
  mission: Mission
  stepId: Exclude<OperationalStepId, 'delivery'>
  onClose: () => void
  onConfirm: (
    missionId: string,
    stepId: OperationalStepId,
    details?: { location?: string; notes?: string }
  ) => void
}

const OperationalActionForm: React.FC<OperationalActionFormProps> = ({
  mission,
  stepId,
  onClose,
  onConfirm,
}) => {
  const origin = mission.origin
  const destination = mission.destination

  const defaultLocation =
    stepId === 'pickup'
      ? `${origin} (Site de chargement)`
      : stepId === 'arrival'
      ? `${destination} (Zone de déchargement)`
      : `Axe ${origin} → ${destination}`

  const defaultNotes =
    stepId === 'pickup'
      ? 'Marchandise vérifiée, arrimée et sécurisée sous bâche conforme.'
      : stepId === 'arrival'
      ? 'Camion positionné sur le quai de réception, prêt pour le contrôle et déchargement.'
      : 'Véhicule en route. Vitesse régulée et consignes de sécurité respectées.'

  const [location, setLocation] = useState(defaultLocation)
  const [notes, setNotes] = useState(defaultNotes)

  const config: Record<
    Exclude<OperationalStepId, 'delivery'>,
    {
      title: string
      subtitle: string
      confirmLabel: string
      icon: React.ReactNode
      buttonClass: string
      locationLabel: string
      noticeText: string
    }
  > = {
    pickup: {
      title: 'Confirmer la prise en charge du fret',
      subtitle: 'Contrôle de conformité de la cargaison et chargement sur le camion.',
      confirmLabel: 'Valider la prise en charge',
      icon: <PackageCheck className="w-4 h-4 mr-1.5" />,
      buttonClass: 'bg-blue-600 hover:bg-blue-500 text-white',
      locationLabel: 'Lieu de prise en charge (Origine)',
      noticeText:
        'L’étape passera à « Prise en charge confirmée ». Le statut opérationnel sera mis à jour en temps réel et enregistré dans l’historique.',
    },
    in_transit: {
      title: 'Prendre la route — Départ sur corridor',
      subtitle: 'Enregistrement du départ effectif du véhicule sur le réseau routier.',
      confirmLabel: 'Confirmer le départ en route',
      icon: <Truck className="w-4 h-4 mr-1.5" />,
      buttonClass: 'bg-emerald-600 hover:bg-emerald-500 text-white',
      locationLabel: 'Itinéraire & Corridor',
      noticeText:
        'Le véhicule sera marqué comme « En route sur corridor ». Le donneur d’ordre sera notifié du départ.',
    },
    arrival: {
      title: 'Signaler l’arrivée à destination',
      subtitle: 'Présentation du véhicule au site de livraison pour mise à quai.',
      confirmLabel: 'Confirmer l’arrivée sur site',
      icon: <Navigation className="w-4 h-4 mr-1.5" />,
      buttonClass: 'bg-purple-600 hover:bg-purple-500 text-white',
      locationLabel: 'Site d’arrivée (Destination)',
      noticeText:
        'Le statut passera à « Arrivé à destination ». L’étape finale d’émargement et de livraison deviendra alors disponible.',
    },
  }

  const currentCfg = config[stepId]

  const handleConfirm = () => {
    onConfirm(mission.id, stepId, { location, notes })
    onClose()
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={currentCfg.title}
      subtitle={currentCfg.subtitle}
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Rappel synthétique de la mission */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-amber-400 font-bold">{mission.missionCode}</span>
            <span className="text-slate-400">{mission.cargo}</span>
          </div>

          <div className="flex items-center gap-2 font-bold text-white text-sm">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{mission.origin}</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{mission.destination}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
            <div>
              <span className="text-slate-400 text-[10px] uppercase block">Véhicule :</span>
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

        {/* Champs de saisie opérationnelle de démonstration */}
        <div className="space-y-3 text-xs">
          <div>
            <label htmlFor="operational-location" className="block text-slate-300 font-semibold mb-1">
              {currentCfg.locationLabel}
            </label>
            <input
              id="operational-location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-xs"
            />
          </div>

          <div>
            <label htmlFor="operational-notes" className="block text-slate-300 font-semibold mb-1">
              Observations & Consignes opérationnelles :
            </label>
            <textarea
              id="operational-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-xs resize-none"
            />
          </div>
        </div>

        {/* Encadré d'assurance et garde-métier */}
        <div className="p-3.5 rounded-xl border border-blue-500/25 bg-blue-500/10 text-blue-200 text-xs flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">{currentCfg.noticeText}</p>
        </div>

        {/* Boutons d'action */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
            Annuler
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleConfirm}
            className={`text-xs font-bold ${currentCfg.buttonClass}`}
          >
            {currentCfg.icon}
            <span>{currentCfg.confirmLabel}</span>
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export const OperationalActionModal: React.FC<OperationalActionModalProps> = ({
  isOpen,
  onClose,
  mission,
  stepId,
  onConfirm,
}) => {
  if (!isOpen || !mission || stepId === 'delivery') {
    return null
  }

  return (
    <OperationalActionForm
      key={`${mission.id}-${stepId}`}
      mission={mission}
      stepId={stepId}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  )
}
