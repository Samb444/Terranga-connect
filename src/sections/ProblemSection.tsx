import React from 'react'
import { Search, RotateCcw, Share2, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { PROBLEM_POINTS } from '../data/constants'

export const ProblemSection: React.FC = () => {
  const getProblemIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Search className="w-5 h-5 text-amber-400" />
      case 1:
        return <RotateCcw className="w-5 h-5 text-amber-500" />
      case 2:
      default:
        return <Share2 className="w-5 h-5 text-amber-400" />
    }
  }

  return (
    <section
      id="probleme"
      className="py-16 sm:py-24 bg-slate-950/50 border-y border-slate-900"
      aria-labelledby="problem-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2">
            <Badge variant="warning" className="py-1 px-3">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Constat &bull; Logistique routière</span>
            </Badge>
          </div>

          <h2
            id="problem-title"
            className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight"
          >
            Un camion qui revient à vide représente une opportunité perdue.
          </h2>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Le transport routier de marchandises fait face à des frictions quotidiennes qui impactent la rentabilité des trajets et la disponibilité des flottes.
          </p>
        </div>

        {/* 3 Problèmes présentés sans aucune statistique non vérifiée */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {PROBLEM_POINTS.map((problem, index) => (
            <Card
              key={problem.title}
              className="bg-slate-900/60 border-slate-800/80 hover:border-amber-500/40 hover:bg-slate-900/90 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 shrink-0">
                    {getProblemIcon(index)}
                  </div>
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold block">
                      Défi 0{index + 1}
                    </span>
                    <CardTitle className="text-lg text-white mt-0.5">
                      {problem.title}
                    </CardTitle>
                  </div>
                </CardHeader>

                <CardContent className="pt-2">
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {problem.description}
                  </p>
                </CardContent>
              </div>

              <div className="p-6 pt-0 mt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                <span>Impact sur la rotation</span>
                <span className="text-amber-400/90 font-medium">Point d'optimisation</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
