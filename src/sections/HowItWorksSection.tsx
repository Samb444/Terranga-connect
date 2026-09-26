import React from 'react'
import {
  FileText,
  Search,
  MessageSquare,
  Navigation,
  CheckCircle2,
  Workflow,
} from 'lucide-react'
import { Badge } from '../components/ui/Badge'
import { Card, CardContent } from '../components/ui/Card'
import { HOW_IT_WORKS_STEPS } from '../data/constants'

export const HowItWorksSection: React.FC = () => {
  const getStepIcon = (index: number) => {
    switch (index) {
      case 0:
        return <FileText className="w-5 h-5 text-amber-400" />
      case 1:
        return <Search className="w-5 h-5 text-amber-400" />
      case 2:
        return <MessageSquare className="w-5 h-5 text-emerald-400" />
      case 3:
      default:
        return <Navigation className="w-5 h-5 text-amber-400" />
    }
  }

  return (
    <section
      id="fonctionnement"
      className="py-16 sm:py-24 bg-slate-950/50 border-y border-slate-900"
      aria-labelledby="how-it-works-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2">
            <Badge variant="amber" className="py-1 px-3">
              <Workflow className="w-3.5 h-3.5" />
              <span>Fonctionnement cible</span>
            </Badge>
          </div>

          <h2
            id="how-it-works-title"
            className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight"
          >
            Le fonctionnement cible de Teranga Connect
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Quatre étapes structurées pour simplifier l'accès au fret et sécuriser l'organisation des flux de transport de bout en bout.
          </p>
        </div>

        {/* 4 Étapes */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <Card
              key={step.number}
              className="bg-slate-900/80 border-slate-800 hover:border-amber-500/40 relative flex flex-col justify-between transition-all duration-300 group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black font-mono text-amber-400/80 group-hover:text-amber-400 transition-colors">
                    {step.number}
                  </span>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 shadow-sm">
                    {getStepIcon(index)}
                  </div>
                </div>

                <h3 className="text-base font-bold text-white mb-2 tracking-tight">
                  {step.title}
                </h3>

                <CardContent className="p-0 pt-1">
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center gap-1.5 text-xs text-emerald-400/90 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Étape planifiée</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Note de bas de section */}
        <div className="mt-10 p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 text-center max-w-2xl mx-auto">
          <p className="text-xs text-slate-400 leading-relaxed">
            Ce cycle en 4 étapes reflète l'architecture cible en cours d'implémentation. Les flux détaillés et les interfaces de saisie seront déployés au fil des versions techniques.
          </p>
        </div>
      </div>
    </section>
  )
}
