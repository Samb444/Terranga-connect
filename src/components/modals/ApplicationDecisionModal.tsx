import React, { useState } from 'react'
import type { Application, Truck } from '../../types'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Select } from '../ui/Select'
import {
  CheckCircle2,
  XCircle,
  User,
  MapPin,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react'

interface ApplicationDecisionModalProps {
  isOpen: boolean
  onClose: () => void
  application: Application | null
  actionType: 'accept' | 'reject'
  trucks: Truck[]
  onConfirmAccept: (applicationId: string, truckId: string) => void
  onConfirmReject: (applicationId: string, reason?: string) => void
}

export const ApplicationDecisionModal: React.FC<ApplicationDecisionModalProps> = ({
  isOpen,
  onClose,
  application,
  actionType,
  trucks,
  onConfirmAccept,
  onConfirmReject,
}) => {
  const [selectedTruckId, setSelectedTruckId] = useState<string>(() => {
    return trucks[0]?.id || ''
  })
  const [rejectReason, setRejectReason] = useState('')

  if (!application) return null

  const isAccept = actionType === 'accept'

  const handleConfirm = () => {
    if (isAccept) {
      onConfirmAccept(application.id, selectedTruckId || trucks[0]?.id || 'truck-demo-1')
    } else {
      onConfirmReject(application.id, rejectReason)
    }
    onClose()
  }

  const truckOptions = trucks.map((t) => ({
    value: t.id,
    label: `${t.brandModel} (${t.matricule}) - Capacité : ${t.tonnageCapacity}T`,
  }))

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isAccept ? 'Accepter cette candidature ?' : 'Refuser cette candidature ?'}
      subtitle={
        isAccept
          ? 'Confirmation avant création automatique de la mission de démonstration.'
          : 'La candidature sera marquée comme refusée dans la session active.'
      }
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Rappel du trajet et de la cargaison */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 font-bold text-white text-sm sm:text-base">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{application.origin}</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{application.destination}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-medium">
                Chauffeur candidat :
              </span>
              <span className="font-semibold text-white flex items-center gap-1.5 mt-0.5">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>{application.driverName}</span>
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-medium">
                Marchandise :
              </span>
              <span className="font-semibold text-white block mt-0.5 truncate">
                {application.cargo}
              </span>
            </div>
          </div>
        </div>

        {isAccept ? (
          /* Formulaire d'acceptation : Choix du camion */
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="select-truck" className="text-xs font-semibold text-slate-200">
                Affecter un camion de votre flotte :
              </label>
              <Select
                id="select-truck"
                options={truckOptions}
                value={selectedTruckId}
                onChange={(e) => setSelectedTruckId(e.target.value)}
              />
              <p className="text-[11px] text-slate-400">
                Le camion sélectionné sera rattaché à l’ordre de mission.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Conséquences de la validation (Démonstration)</span>
              </div>
              <ul className="list-disc list-inside text-[11px] text-emerald-300/90 space-y-0.5">
                <li>La candidature passe au statut <strong>Acceptée</strong></li>
                <li>Une mission est automatiquement créée dans <strong>/missions</strong></li>
                <li>L'opportunité passe au statut <strong>En cours</strong></li>
              </ul>
            </div>
          </div>
        ) : (
          /* Formulaire de refus : Motif optionnel */
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="reject-reason" className="text-xs font-semibold text-slate-200">
                Motif indicatif du refus (optionnel) :
              </label>
              <input
                id="reject-reason"
                type="text"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Ex : Créneau horaire non compatible, capacité inadaptée..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                Le refus annulera cette candidature. Aucune mission ne sera créée pour ce chauffeur.
              </p>
            </div>
          </div>
        )}

        {/* Boutons d'action */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
            Annuler
          </Button>

          {isAccept ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleConfirm}
              className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/30"
            >
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
              <span>Confirmer l'acceptation</span>
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleConfirm}
              className="text-xs text-rose-300 hover:text-white hover:bg-rose-600 border-rose-500/40"
            >
              <XCircle className="w-3.5 h-3.5 mr-1.5" />
              <span>Confirmer le refus</span>
            </Button>
          )}
        </div>
      </div>
    </Modal>
  )
}
