import React from 'react'
import { Sparkles, ArrowRight, Truck } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { APP_CONFIG } from '../data/constants'

interface FinalCtaSectionProps {
  onOpenDiscovery: () => void
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ onOpenDiscovery }) => {
  return (
    <section
      id="rejoindre"
      className="py-16 sm:py-24 relative overflow-hidden"
      aria-labelledby="cta-final-title"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl border border-amber-500/30 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 p-8 sm:p-14 text-center shadow-2xl overflow-hidden">
          {/* Lueur d'ambiance */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2">
              <Badge variant="amber" className="py-1.5 px-3.5 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{APP_CONFIG.phase}</span>
              </Badge>
            </div>

            {/* Titre requis mot pour mot */}
            <h2
              id="cta-final-title"
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight"
            >
              Prêt à mieux connecter les trajets et les opportunités ?
            </h2>

            {/* Texte indiquant que Teranga Connect est actuellement en développement */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Teranga Connect est actuellement en développement. Rejoignez la réflexion et suivez l'avancée de la plateforme destinée à révolutionner la mise en relation entre propriétaires de camions et chauffeurs.
            </p>

            {/* Bouton requis mot pour mot */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={onOpenDiscovery}
                className="w-full sm:w-auto shadow-xl shadow-amber-950/40 text-base py-3 px-8"
              >
                <Truck className="w-5 h-5 mr-2" />
                <span>Découvrir Teranga Connect</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            <p className="text-xs text-slate-400 pt-2">
              {APP_CONFIG.statusNotice} &bull; Aucune inscription contraignante requise à ce stade
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
