import React, { useEffect, useRef } from 'react'
import { X, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { APP_CONFIG } from '../../data/constants'

interface DiscoveryModalProps {
  isOpen: boolean
  onClose: () => void
}

export const DiscoveryModal: React.FC<DiscoveryModalProps> = ({ isOpen, onClose }) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus()
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose()
        }
      }
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="discovery-modal-title"
      aria-describedby="discovery-modal-description"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bouton de fermeture accessible */}
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
          aria-label="Fermer la fenêtre d'information"
        >
          <X className="w-5 h-5" />
        </button>

        {/* En-tête */}
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="amber" className="py-1 px-2.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Prototype &bull; Accès anticipé</span>
          </Badge>
          <span className="text-xs text-slate-400">{APP_CONFIG.phase}</span>
        </div>

        <h3 id="discovery-modal-title" className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Rejoindre l'aventure Teranga Connect
        </h3>

        <div id="discovery-modal-description" className="mt-4 space-y-4 text-sm text-slate-300 leading-relaxed">
          <p>
            <strong className="text-white">Teranga Connect</strong> est actuellement en cours de conception et de développement technique. 
            Aucun compte utilisateur ni paiement n'est exigé à ce stade.
          </p>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/90 space-y-2.5">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <span>Conception ciblée pour le fret routier sénégalais et sous-régional.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <span>Priorité donnée à la réduction des retours à vide des camions.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <span>Préparation des modules opérationnels propriétaires et chauffeurs.</span>
            </div>
          </div>

          <p className="text-xs text-slate-400">
            Les prochaines phases intégreront les formulaires de pré-enregistrement et les espaces dédiés aux propriétaires de flottes et aux chauffeurs.
          </p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button
            variant="outline"
            size="md"
            className="w-full sm:w-auto"
            onClick={onClose}
          >
            Fermer
          </Button>
          <Button
            variant="primary"
            size="md"
            className="w-full sm:w-auto"
            onClick={() => {
              onClose()
              const target = document.getElementById('fonctionnement')
              target?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            <span>Découvrir le fonctionnement</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
