import React, { useState } from 'react'
import { RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { useTransport } from '../../hooks/useTransport'

interface ResetDemoModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export const ResetDemoModal: React.FC<ResetDemoModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { resetDemoData } = useTransport()
  const [isSuccess, setIsSuccess] = useState(false)

  const handleConfirmReset = () => {
    resetDemoData()
    setIsSuccess(true)
    setTimeout(() => {
      setIsSuccess(false)
      onClose()
      if (onSuccess) onSuccess()
    }, 1200)
  }

  const handleClose = () => {
    setIsSuccess(false)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Réinitialiser la démonstration"
      subtitle="Restauration intégrale des données initiales de démonstration."
      maxWidth="md"
    >
      <div className="space-y-5">
        {isSuccess ? (
          <div className="py-6 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Données restaurées !</h3>
            <p className="text-xs text-slate-300">
              La session de démonstration a été réinitialisée avec succès aux données d'origine.
            </p>
          </div>
        ) : (
          <>
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-amber-300">Attention — Données locales</p>
                <p className="leading-relaxed">
                  Cette action supprimera toutes les modifications locales (nouveaux camions,
                  opportunités publiées, candidatures, missions créées, profil modifié) et
                  restaurera les données de démonstration initiales.
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-400 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <p className="font-semibold text-slate-300">Éléments qui seront restaurés :</p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>Profils Propriétaire (Mamadou Diop) et Chauffeur (Ibrahima Ndiaye)</li>
                <li>Flotte initiale de 3 camions de démonstration</li>
                <li>Catalogue des 9 opportunités de transport et de retour</li>
                <li>Candidatures et missions initiales du cycle de démonstration</li>
                <li>Centre de notifications remis à l'état initial</li>
              </ul>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <Button variant="ghost" size="md" onClick={handleClose}>
                Annuler
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleConfirmReset}
                className="bg-amber-600 hover:bg-amber-500 shadow-amber-950/40"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                <span>Confirmer la réinitialisation</span>
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}
