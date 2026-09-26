import React from 'react'
import { Truck, ShieldCheck, Activity, Terminal } from 'lucide-react'
import { APP_CONFIG } from '../data/constants'
import { Badge } from '../components/ui/Badge'

interface MainLayoutProps {
  children: React.ReactNode
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#070d1e] text-slate-100 selection:bg-amber-500 selection:text-slate-950 font-sans">
      {/* Barre de navigation supérieure */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#070d1e]/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo et identité visuelle */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-950/30">
              <Truck className="w-5 h-5 text-slate-950 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white flex items-center gap-2">
                {APP_CONFIG.name}
              </span>
              <span className="block text-[11px] uppercase tracking-wider text-amber-400/90 font-medium">
                Plateforme Fret &amp; Logistique
              </span>
            </div>
          </div>

          {/* Badges d'état et environnement */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              <span>{APP_CONFIG.phase}</span>
            </div>

            <Badge variant="success" className="py-1 px-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Système opérationnel</span>
            </Badge>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Pied de page technique */}
      <footer className="w-full border-t border-slate-800/60 bg-slate-950/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Teranga Connect &mdash; Infrastructure technique initialisée &bull; Sénégal</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-amber-500" />
              <span>Vite 8 &bull; React 19 &bull; TS Strict &bull; Tailwind v4</span>
            </span>
            <span className="text-slate-500">&bull;</span>
            <span>Port 5173</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
