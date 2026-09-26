import React from 'react'
import {
  ShieldCheck,
  FileCheck2,
  Users2,
  Eye,
  MessagesSquare,
  Lock,
  Sparkles,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { TRUST_POINTS } from '../data/constants'

export const TrustSection: React.FC = () => {
  const getTrustIcon = (index: number) => {
    switch (index) {
      case 0:
        return <FileCheck2 className="w-5 h-5 text-amber-400" />
      case 1:
        return <Users2 className="w-5 h-5 text-amber-400" />
      case 2:
        return <Eye className="w-5 h-5 text-emerald-400" />
      case 3:
        return <MessagesSquare className="w-5 h-5 text-amber-400" />
      case 4:
      default:
        return <Lock className="w-5 h-5 text-amber-500" />
    }
  }

  return (
    <section
      id="confiance"
      className="py-16 sm:py-24 bg-slate-950/40 border-t border-slate-900"
      aria-labelledby="trust-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2">
            <Badge variant="amber" className="py-1 px-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Principes de confiance</span>
            </Badge>
          </div>

          <h2
            id="trust-title"
            className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight"
          >
            Bâtir un cadre d'échange fiable et transparent
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            La relation entre transporteurs et propriétaires repose sur la clarté des engagements et la rigueur des informations partagées.
          </p>
        </div>

        {/* Grille des piliers de confiance */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TRUST_POINTS.map((point, index) => (
            <Card
              key={point.title}
              className={`bg-slate-900/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900 transition-all flex flex-col justify-between ${
                point.isFuture ? 'relative overflow-hidden' : ''
              }`}
            >
              <div>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    {getTrustIcon(index)}
                  </div>
                  {point.isFuture && (
                    <Badge variant="outline" className="text-[11px] text-amber-400/90 border-amber-500/30 bg-amber-500/10">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Futur mécanisme
                    </Badge>
                  )}
                </CardHeader>

                <CardContent className="pt-1">
                  <CardTitle className="text-base font-semibold text-white mb-2">
                    {point.title}
                  </CardTitle>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {point.description}
                  </p>
                </CardContent>
              </div>

              <div className="p-6 pt-0 mt-4 border-t border-slate-800/50 flex items-center justify-between text-[11px] text-slate-400">
                <span>Principe structurant</span>
                <span className={point.isFuture ? 'text-amber-400' : 'text-emerald-400'}>
                  {point.isFuture ? 'Conception en cours' : 'Socle de conception'}
                </span>
              </div>
            </Card>
          ))}
        </div>

        {/* Clarification de non-disponibilité prématurée */}
        <div className="mt-10 rounded-xl bg-slate-950/70 border border-slate-800 p-4 text-xs text-slate-400 text-center max-w-2xl mx-auto">
          <p>
            <strong className="text-slate-300">Précision technique :</strong> Les mécanismes de vérification d'identité, de contrôle documentaire et de sécurisation financière sont actuellement en cours d'étude et seront déployés lors des phases opérationnelles ultérieures.
          </p>
        </div>
      </div>
    </section>
  )
}
