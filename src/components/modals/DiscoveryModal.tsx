import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { X, Sparkles, ArrowRight, Truck, UserCheck, Compass } from 'lucide-react'
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="discovery-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bouton de fermeture accessible */}
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors cursor-pointer"
          aria-label="Fermer la fenêtre d'information"
        >
          <X className="w-5 h-5" />
        </button>

        {/* En-tête */}
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="amber" className="py-1 px-2.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Prototype Phase 3 &bull; Première interface produit</span>
          </Badge>
          <span className="text-xs text-slate-400">{APP_CONFIG.phase}</span>
        </div>

        <h3 id="discovery-modal-title" className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Accéder à la démonstration interactive
        </h3>

        <p className="mt-2 text-sm text-slate-300 leading-relaxed">
          Choisissez votre parcours utilisateur pour explorer l'interface produit de Teranga Connect.
          Aucun compte réel ni paiement n'est exigé : toutes les données sont locales.
        </p>

        {/* Choix du parcours : Propriétaire ou Chauffeur */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/proprietaire"
            onClick={onClose}
            className="p-5 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-950 hover:border-amber-500/50 transition-all flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-105 transition-transform">
                <Truck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base group-hover:text-amber-400 transition-colors">
                Propriétaire de camion
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Supervisez votre flotte, publiez un fret et trouvez des retours à vide.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center text-xs font-semibold text-amber-400">
              <span>Ouvrir l'espace Propriétaire</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/chauffeur"
            onClick={onClose}
            className="p-5 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-950 hover:border-emerald-500/50 transition-all flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-105 transition-transform">
                <UserCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors">
                Chauffeur professionnel
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Indiquez votre disponibilité, recherchez une mission et suivez vos trajets.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center text-xs font-semibold text-emerald-400">
              <span>Ouvrir l'espace Chauffeur</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Lien direct opportunités */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Link
            to="/opportunites"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-amber-400 transition-colors"
          >
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Consulter le catalogue des opportunités de fret &rarr;</span>
          </Link>

          <Button variant="outline" size="sm" onClick={onClose} className="w-full sm:w-auto">
            Fermer
          </Button>
        </div>
      </div>
    </div>
  )
}
