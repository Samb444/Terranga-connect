import React, { useState } from 'react'
import type { Mission } from '../../types'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import {
  CheckCheck,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Building2,
  User,
  Truck,
  AlertCircle,
} from 'lucide-react'
import { generateDeliveryReceiptCode } from '../../lib/missionUtils'

interface DeliveryConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  mission: Mission | null
  onConfirmDelivery: (
    missionId: string,
    confirmation: {
      signerName: string
      signerRole: string
      notes?: string
      receiptCode: string
    }
  ) => void
}

interface DeliveryConfirmationFormProps {
  mission: Mission
  onClose: () => void
  onConfirmDelivery: (
    missionId: string,
    confirmation: {
      signerName: string
      signerRole: string
      notes?: string
      receiptCode: string
    }
  ) => void
}

const DeliveryConfirmationForm: React.FC<DeliveryConfirmationFormProps> = ({
  mission,
  onClose,
  onConfirmDelivery,
}) => {
  const defaultReceiptCode = React.useMemo(
    () => generateDeliveryReceiptCode(mission.missionCode),
    [mission.missionCode]
  )

  const [signerName, setSignerName] = useState('Amadou Kane')
  const [signerRole, setSignerRole] = useState('Responsable Réception & Quai')
  const [receiptCode] = useState(defaultReceiptCode)
  const [notes, setNotes] = useState(
    'Cargaison complète réceptionnée conforme et sans réserve. Déchargement achevé.'
  )
  const [hasAcknowledged, setHasAcknowledged] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!signerName.trim()) {
      setErrorMsg('Le nom du réceptionnaire est requis pour valider l’émargement.')
      return
    }
    if (!hasAcknowledged) {
      setErrorMsg('Veuillez cocher la confirmation contradictoire avant de valider.')
      return
    }

    onConfirmDelivery(mission.id, {
      signerName: signerName.trim(),
      signerRole: signerRole.trim() || 'Réceptionnaire',
      notes: notes.trim(),
      receiptCode,
    })
    onClose()
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Confirmation de livraison & Émargement"
      subtitle="Validation contradictoire de la remise de marchandise et clôture de mission."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Rappel complet des informations pertinentes (Exigence Section 9) */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {mission.missionCode}
              </span>
              <span className="text-white font-medium">{mission.cargo}</span>
            </div>
            <span className="font-mono text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Réf BL : {receiptCode}
            </span>
          </div>

          {/* Corridor & Destination */}
          <div className="flex items-center gap-2 font-bold text-white text-sm sm:text-base pt-1">
            <div className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{mission.origin}</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <div className="flex items-center gap-1.5 text-emerald-300">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{mission.destination} (Destination finale)</span>
            </div>
          </div>

          {/* Acteurs concernés & Véhicule (Exigence Section 9) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 space-y-0.5">
              <span className="text-slate-400 text-[10px] uppercase block font-medium flex items-center gap-1">
                <Building2 className="w-3 h-3 text-blue-400" />
                <span>Transporteur</span>
              </span>
              <span className="font-bold text-white block truncate">{mission.ownerName}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 space-y-0.5">
              <span className="text-slate-400 text-[10px] uppercase block font-medium flex items-center gap-1">
                <User className="w-3 h-3 text-emerald-400" />
                <span>Chauffeur</span>
              </span>
              <span className="font-bold text-white block truncate">{mission.driverName}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 space-y-0.5">
              <span className="text-slate-400 text-[10px] uppercase block font-medium flex items-center gap-1">
                <Truck className="w-3 h-3 text-amber-400" />
                <span>Véhicule</span>
              </span>
              <span className="font-bold text-amber-400 block truncate">{mission.truckMatricule}</span>
            </div>
          </div>

          {/* Étape actuelle */}
          <div className="flex items-center gap-2 text-xs pt-1 text-slate-300">
            <span className="text-slate-400 text-[11px]">Étape actuelle :</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/15 border border-purple-500/30 text-purple-300 font-semibold text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              <span>Arrivé à destination — Prêt pour émargement</span>
            </span>
          </div>
        </div>

        {/* Message d'erreur éventuel */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Formulaire de décharge et émargement de livraison */}
        <div className="space-y-3.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="signer-name" className="block text-slate-200 font-semibold mb-1">
                Nom du réceptionnaire sur site <span className="text-rose-400">*</span> :
              </label>
              <input
                id="signer-name"
                type="text"
                required
                value={signerName}
                onChange={(e) => {
                  setSignerName(e.target.value)
                  setErrorMsg(null)
                }}
                placeholder="Ex : Amadou Kane"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-xs"
              />
            </div>

            <div>
              <label htmlFor="signer-role" className="block text-slate-200 font-semibold mb-1">
                Fonction / Qualité du signataire :
              </label>
              <input
                id="signer-role"
                type="text"
                value={signerRole}
                onChange={(e) => setSignerRole(e.target.value)}
                placeholder="Ex : Responsable Dépôt / Magasinier"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-xs"
              />
            </div>
          </div>

          <div>
            <label htmlFor="delivery-notes" className="block text-slate-200 font-semibold mb-1">
              Réserves ou observations contradictoires (Démonstration) :
            </label>
            <textarea
              id="delivery-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex : Marchandise contrôlée conforme, palettes intactes..."
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-xs resize-none"
            />
          </div>

          {/* Case à cocher d'attestation contradictoire */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
            <input
              id="acknowledge-checkbox"
              type="checkbox"
              checked={hasAcknowledged}
              onChange={(e) => {
                setHasAcknowledged(e.target.checked)
                setErrorMsg(null)
              }}
              className="mt-0.5 rounded border-slate-700 text-amber-500 focus:ring-amber-500 cursor-pointer"
            />
            <label
              htmlFor="acknowledge-checkbox"
              className="text-[11px] text-slate-300 leading-relaxed cursor-pointer select-none"
            >
              Je certifie que la marchandise a été intégralement déchargée au point convenu (
              {mission.destination}) et que le bon de livraison <span className="font-mono font-semibold text-amber-400">{receiptCode}</span> a été validé contradictoirement.
            </label>
          </div>
        </div>

        {/* Encadré d'information légale & démonstration */}
        <div className="p-3.5 rounded-xl border border-emerald-500/25 bg-emerald-500/10 text-emerald-200 text-xs flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-[11px]">
            <p className="font-semibold text-emerald-300">
              Impact de la validation de livraison :
            </p>
            <p className="text-emerald-200/90 leading-relaxed">
              La mission passera au statut <span className="font-bold">« Terminée »</span>, l’historique d’exécution sera clôturé, et une notification officielle de livraison sera transmise à l’ensemble des parties.
            </p>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
          <Button variant="ghost" size="sm" type="button" onClick={onClose} className="text-xs">
            Annuler
          </Button>

          <Button
            variant="primary"
            size="sm"
            type="submit"
            className="text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40"
          >
            <CheckCheck className="w-4 h-4 mr-1.5" />
            <span>Valider l’émargement et clôturer</span>
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export const DeliveryConfirmationModal: React.FC<DeliveryConfirmationModalProps> = ({
  isOpen,
  onClose,
  mission,
  onConfirmDelivery,
}) => {
  if (!isOpen || !mission) {
    return null
  }

  return (
    <DeliveryConfirmationForm
      key={mission.id}
      mission={mission}
      onClose={onClose}
      onConfirmDelivery={onConfirmDelivery}
    />
  )
}
