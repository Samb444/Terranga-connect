import React from 'react'
import {
  Truck,
  ArrowRight,
  RotateCcw,
  Navigation,
  ShieldCheck,
  CheckCircle2,
  Package,
} from 'lucide-react'

export const CorridorVisual: React.FC = () => {
  return (
    <div className="relative w-full rounded-2xl border border-slate-800/80 bg-gradient-to-b from-slate-900/90 via-slate-900/50 to-slate-950/80 p-5 sm:p-7 shadow-2xl backdrop-blur-md overflow-hidden">
      {/* Halo lumineux d'arrière-plan */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* En-tête de la carte visuelle */}
      <div className="flex items-center justify-between pb-5 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Corridor Logistique Modélisé
            </p>
            <p className="text-sm font-bold text-white flex items-center gap-2">
              <span>Axe Dakar &bull; Thiès &bull; Kaolack</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                Simulation de flux
              </span>
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Fret optimisé</span>
        </div>
      </div>

      {/* Schéma vectoriel des rotations aller et retour */}
      <div className="mt-6 space-y-5">
        {/* Étape 1 : Trajet Aller avec mission assurée */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 relative transition-all duration-200 hover:border-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-amber-400 uppercase tracking-wide">
                    Trajet Aller
                  </span>
                  <span className="text-slate-400 text-xs">&bull;</span>
                  <span className="text-xs text-slate-300 font-medium">Port de Dakar &rarr; Kaolack</span>
                </div>
                <p className="text-sm font-medium text-slate-200 mt-0.5 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-slate-400" />
                  <span>Cargaison assignée : Matériaux de construction (32T)</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-md">
                <CheckCircle2 className="w-3 h-3" />
                Chargement complet
              </span>
            </div>
          </div>

          {/* Axe visuel dynamique */}
          <div className="mt-3 flex items-center gap-2 text-slate-400 text-xs">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-slate-300 font-medium">Dakar</span>
            <div className="flex-1 h-0.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 rounded" />
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-slate-300 font-medium">Thiès</span>
            <div className="flex-1 h-0.5 bg-gradient-to-r from-amber-600 to-emerald-500 rounded" />
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-slate-300 font-medium">Kaolack</span>
          </div>
        </div>

        {/* Connecteur central indiquant la problématique du retour */}
        <div className="flex items-center justify-center gap-3 py-1">
          <div className="h-px bg-slate-800 flex-1" />
          <div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-[11px] text-slate-300 font-medium flex items-center gap-1.5 shadow-sm">
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Objectif Teranga Connect : Éviter le retour à vide</span>
          </div>
          <div className="h-px bg-slate-800 flex-1" />
        </div>

        {/* Étape 2 : Trajet Retour avec opportunité connectée */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-emerald-900/40 relative transition-all duration-200 hover:border-emerald-800/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">
                    Trajet Retour Optimisé
                  </span>
                  <span className="text-slate-400 text-xs">&bull;</span>
                  <span className="text-xs text-slate-300 font-medium">Kaolack &rarr; Dakar</span>
                </div>
                <p className="text-sm font-medium text-slate-200 mt-0.5 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Opportunité retour connectée : Fret agricole / arachidier</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2.5 py-1 rounded-md">
                <ArrowRight className="w-3 h-3" />
                Retour rentabilisé
              </span>
            </div>
          </div>

          {/* Axe visuel du retour */}
          <div className="mt-3 flex items-center gap-2 text-slate-400 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-slate-300 font-medium">Kaolack</span>
            <div className="flex-1 h-0.5 bg-gradient-to-r from-emerald-500 via-emerald-400 to-amber-400 rounded" />
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-slate-300 font-medium">Thiès</span>
            <div className="flex-1 h-0.5 bg-gradient-to-r from-amber-400 to-amber-500 rounded" />
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-slate-300 font-medium">Dakar</span>
          </div>
        </div>
      </div>

      {/* Barre d'information en bas du visuel */}
      <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>Mise en relation propriétaire &bull; chauffeur &bull; chargeur</span>
        </span>
        <span className="text-slate-500">Représentation schématique du flux cible</span>
      </div>
    </div>
  )
}
