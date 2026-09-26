import React from 'react'
import {
  CheckCircle2,
  Clock,
  Truck,
  FileCheck2,
  UserCheck,
  PackageCheck,
  AlertCircle,
  ShieldCheck,
  Play,
} from 'lucide-react'
import type { MissionTimelineStep, MissionStatus } from '../../types'
import { MISSION_STATUS_CONFIG } from '../../lib/missionUtils'

interface MissionTimelineProps {
  timeline: MissionTimelineStep[]
  status: MissionStatus
}

export const MissionTimeline: React.FC<MissionTimelineProps> = ({ timeline, status }) => {
  const isCancelled = status === 'cancelled'

  const stepIcons = [
    <FileCheck2 key="0" className="w-4 h-4" />,
    <UserCheck key="1" className="w-4 h-4" />,
    <ShieldCheck key="2" className="w-4 h-4" />,
    <Play key="3" className="w-4 h-4 fill-current" />,
    <Truck key="4" className="w-4 h-4" />,
    <PackageCheck key="5" className="w-4 h-4" />,
  ]

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>Cycle de progression de la mission</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-normal">
              Simulation temps réel
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Suivi des jalons depuis la manifestation d’intérêt jusqu'au déchargement.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isCancelled ? (
            <span className="text-xs font-semibold text-rose-400 bg-rose-500/10 px-3 py-1 rounded-lg border border-rose-500/20 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Mission Annulée</span>
            </span>
          ) : (
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Statut : {MISSION_STATUS_CONFIG[status]?.label || status}</span>
            </span>
          )}
        </div>
      </div>

      {/* Vue Timeline Responsive */}
      <div className="relative pt-2">
        <ol className="relative border-l border-slate-800 ml-4 sm:ml-6 space-y-8 sm:space-y-10">
          {timeline.map((step, index) => {
            const isCompleted = step.status === 'completed'
            const isCurrent = step.status === 'current'

            return (
              <li key={step.id} className="ml-8 relative group">
                {/* Pastille indicateur */}
                <span
                  className={`absolute -left-12 sm:-left-14 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full ring-4 ring-[#070d1e] transition-all ${
                    isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                      : isCurrent
                      ? 'bg-amber-500 text-slate-950 font-bold ring-amber-500/30 shadow-lg shadow-amber-500/20 animate-pulse'
                      : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  ) : isCurrent ? (
                    stepIcons[index % stepIcons.length]
                  ) : (
                    <span className="text-xs font-semibold">{index + 1}</span>
                  )}
                </span>

                {/* Contenu de l'étape */}
                <div
                  className={`p-4 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-amber-500/10 border-amber-500/30 shadow-md'
                      : isCompleted
                      ? 'bg-slate-950/40 border-slate-800/80'
                      : 'bg-slate-950/20 border-slate-800/40 opacity-70'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <h4
                      className={`text-sm sm:text-base font-bold flex items-center gap-2 ${
                        isCurrent
                          ? 'text-amber-300'
                          : isCompleted
                          ? 'text-white'
                          : 'text-slate-400'
                      }`}
                    >
                      <span>{step.label}</span>
                      {isCurrent && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                          Étape active
                        </span>
                      )}
                      {isCompleted && (
                        <span className="text-[10px] font-medium text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Validé</span>
                        </span>
                      )}
                    </h4>

                    {step.timestamp && (
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{step.timestamp}</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">{step.description}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
