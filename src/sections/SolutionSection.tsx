import React from 'react'
import {
  Users,
  Search,
  Handshake,
  Truck,
  RotateCcw,
  ArrowRight,
  Sparkles,
  Info,
} from 'lucide-react'
import { Badge } from '../components/ui/Badge'
import { SOLUTION_STEPS } from '../data/constants'

export const SolutionSection: React.FC = () => {
  const getStepIcon = (step: number) => {
    switch (step) {
      case 1:
        return <Users className="w-5 h-5 text-amber-400" />
      case 2:
        return <Search className="w-5 h-5 text-amber-400" />
      case 3:
        return <Handshake className="w-5 h-5 text-emerald-400" />
      case 4:
        return <Truck className="w-5 h-5 text-amber-400" />
      case 5:
        return <RotateCcw className="w-5 h-5 text-emerald-400" />
      default:
        return <Sparkles className="w-5 h-5 text-amber-400" />
    }
  }

  return (
    <section
      id="solution"
      className="py-16 sm:py-24 relative overflow-hidden"
      aria-labelledby="solution-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2">
            <Badge variant="amber" className="py-1 px-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>La Réponse Teranga Connect</span>
            </Badge>
          </div>

          <h2
            id="solution-title"
            className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight"
          >
            Teranga Connect crée le lien entre l'offre et la demande.
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Une approche séquentielle et claire pour coordonner les moyens logistiques, de l'expression du besoin jusqu'à la rentabilisation du trajet retour.
          </p>

          {/* Note sur l'état de développement */}
          <div className="inline-flex items-center gap-2 text-xs text-amber-300/90 bg-amber-950/40 border border-amber-800/40 px-3.5 py-1.5 rounded-full mt-2">
            <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Parcours cible en cours d'élaboration technique</span>
          </div>
        </div>

        {/* Parcours visuel : Propriétaire/Chauffeur -> Recherche -> Mise en relation -> Trajet -> Opportunité retour */}
        <div className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {SOLUTION_STEPS.map((item, index) => (
              <div key={item.step} className="flex flex-col items-center text-center group relative">
                {/* Boîte de l'étape */}
                <div className="w-full p-5 rounded-2xl bg-slate-900/80 border border-slate-800 transition-all duration-300 group-hover:border-amber-500/50 group-hover:bg-slate-900 flex flex-col items-center h-full">
                  <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-3 shadow-inner group-hover:scale-110 transition-transform">
                    {getStepIcon(item.step)}
                  </div>

                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 mb-1">
                    Étape 0{item.step}
                  </span>

                  <h3 className="text-sm font-bold text-white mb-2 min-h-[40px] flex items-center justify-center">
                    {item.role}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed mt-auto">
                    {item.description}
                  </p>
                </div>

                {/* Connecteur fléché (desktop) */}
                {index < SOLUTION_STEPS.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-3 -translate-y-1/2 z-20 text-slate-600 group-hover:text-amber-400 transition-colors">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}

                {/* Connecteur vertical (mobile) */}
                {index < SOLUTION_STEPS.length - 1 && (
                  <div className="flex md:hidden my-2 text-slate-600">
                    <ArrowRight className="w-5 h-5 rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
