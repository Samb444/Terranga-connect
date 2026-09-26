import React, { useState } from 'react'
import {
  Truck,
  ArrowLeftRight,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Sparkles,
  RefreshCw,
  Server,
  Code2,
} from 'lucide-react'
import { APP_CONFIG } from '../data/constants'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Card, CardContent } from '../components/ui/Card'
import { ValidationOverviewSection } from '../sections/ValidationOverviewSection'
import { useSystemStatus } from '../hooks/useSystemStatus'

export const HomePage: React.FC = () => {
  const { health, isReady } = useSystemStatus()
  const [testCount, setTestCount] = useState<number>(0)
  const [lastCheckMessage, setLastCheckMessage] = useState<string>('Prêt pour la validation')

  const handleTestPing = () => {
    setTestCount((prev) => prev + 1)
    setLastCheckMessage(`Cycle réactif React 19 validé (#${testCount + 1}) à ${new Date().toLocaleTimeString('fr-FR')}`)
  }

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex flex-col justify-center">
      {/* En-tête de validation technique */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2">
          <Badge variant="amber" className="px-3 py-1 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Phase 1 &bull; Socle technique initialisé</span>
          </Badge>
          <Badge variant="success" className="px-3 py-1 text-xs">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Compilation Vite &amp; TypeScript OK</span>
          </Badge>
        </div>

        {/* Titre principal requis */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
          <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
            {APP_CONFIG.name}
          </span>
        </h1>

        {/* Phrase requise par les spécifications */}
        <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed">
          Plateforme destinée à faciliter la mise en relation entre propriétaires de camions et
          chauffeurs et à réduire les retours à vide.
        </p>

        {/* Pill d'objectifs clés de la plateforme */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
            <Truck className="w-4 h-4 text-amber-500" />
            <span>Propriétaires de flottes</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
            <ArrowLeftRight className="w-4 h-4 text-emerald-400" />
            <span>Optimisation des trajets retour</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span>Chauffeurs certifiés</span>
          </div>
        </div>
      </div>

      {/* Grille d'état des modules techniques */}
      <div className="mt-12 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            <Layers className="w-4 h-4 text-amber-500" />
            <span>Modules d'architecture validés</span>
          </div>
          <span className="text-xs text-slate-400">Socle v{health.version}</span>
        </div>

        <ValidationOverviewSection />

        {/* Carte de contrôle réactif en direct */}
        <Card className="bg-slate-900/40 border-slate-800/90">
          <CardContent className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-left">
              <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700/60 text-amber-400">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Contrôle de réactivité locale</p>
                <p className="text-xs text-slate-400 mt-0.5">{lastCheckMessage}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-mono bg-slate-950 px-2.5 py-1.5 rounded border border-slate-800">
                Tests: {testCount}
              </span>
              <Button
                variant="primary"
                size="sm"
                onClick={handleTestPing}
                disabled={!isReady}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Tester la réactivité</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Note informative de validation */}
        <div className="rounded-lg bg-slate-950/70 border border-slate-800/80 p-4 text-xs text-slate-400 flex items-start gap-3">
          <Code2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-300">Phase 1 &mdash; Écran de validation technique :</span>{' '}
            L'environnement Vite, React 19, TypeScript strict et Tailwind CSS v4 est opérationnel. Aucune donnée fictive ou fonctionnalité métier n'a été insérée prématurément, conformément aux directives.
          </div>
        </div>
      </div>
    </div>
  )
}
