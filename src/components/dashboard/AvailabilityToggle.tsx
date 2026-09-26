import React from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { useTransport } from '../../hooks/useTransport'

export const AvailabilityToggle: React.FC = () => {
  const { driverStatus, toggleDriverStatus, setDriverStatus } = useTransport()
  const isAvailable = driverStatus === 'available'

  return (
    <Card className="bg-slate-900/90 border-slate-800 p-5 sm:p-6 shadow-xl relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
              Statut d'activité en temps réel
            </span>
            <Badge variant="amber" className="text-[10px] py-0 px-2">
              Démonstration
            </Badge>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Disponibilité du chauffeur :</span>
            <span
              className={
                isAvailable
                  ? 'text-emerald-400 font-extrabold'
                  : 'text-slate-400 font-extrabold'
              }
            >
              {isAvailable ? 'Disponible pour missions' : 'Indisponible (Repos)'}
            </span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {isAvailable
              ? 'Votre profil est visible par les propriétaires de camions et répartiteurs pour les chargements sur vos corridors favoris.'
              : 'Vous ne recevez aucune nouvelle proposition de trajet tant que vous êtes en repos ou déjà engagé.'}
          </p>
        </div>

        {/* Boutons d'action interactive */}
        <div className="flex items-center gap-2 self-start sm:self-center shrink-0 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setDriverStatus('available')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isAvailable
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40 ring-1 ring-emerald-400/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
            aria-pressed={isAvailable}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>Disponible</span>
          </button>

          <button
            type="button"
            onClick={() => setDriverStatus('unavailable')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              !isAvailable
                ? 'bg-slate-700 text-white shadow-md shadow-slate-950/40 ring-1 ring-slate-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
            aria-pressed={!isAvailable}
          >
            <XCircle className="w-4 h-4 text-slate-300" />
            <span>Indisponible</span>
          </button>

          {/* Toggle rapide supplémentaire */}
          <button
            type="button"
            onClick={toggleDriverStatus}
            className="hidden lg:flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-900 transition-colors ml-1"
            title="Basculer le statut"
            aria-label="Basculer le statut de disponibilité"
          >
            <div
              className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                isAvailable ? 'bg-emerald-600' : 'bg-slate-800 border border-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  isAvailable ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </div>
          </button>
        </div>
      </div>
    </Card>
  )
}
