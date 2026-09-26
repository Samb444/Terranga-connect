import React from 'react'
import { CheckCircle2, Cpu, FileCode2, Palette, Shield } from 'lucide-react'
import { Card, CardTitle, CardDescription } from '../components/ui/Card'
import { TECH_STACK_MODULES } from '../data/constants'

export const ValidationOverviewSection: React.FC = () => {
  const getIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Cpu className="w-5 h-5 text-amber-400" />
      case 1:
        return <FileCode2 className="w-5 h-5 text-sky-400" />
      case 2:
        return <Palette className="w-5 h-5 text-emerald-400" />
      default:
        return <Shield className="w-5 h-5 text-indigo-400" />
    }
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TECH_STACK_MODULES.map((module, idx) => (
          <Card key={module.name} className="relative overflow-hidden group">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 mt-0.5">
                  {getIcon(idx)}
                </div>
                <div>
                  <CardTitle className="text-base font-semibold text-slate-100 flex items-center gap-2">
                    {module.name}
                  </CardTitle>
                  <CardDescription className="mt-1 text-xs text-slate-400">
                    {module.description}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-full shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{module.status}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
