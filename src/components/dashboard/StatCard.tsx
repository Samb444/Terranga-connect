import React from 'react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { cn } from '../../lib/utils'

interface StatCardProps {
  title: string
  value: string
  subtext?: string
  icon: React.ReactNode
  badgeText?: string
  badgeVariant?: 'amber' | 'success' | 'warning' | 'default'
  className?: string
  accentColor?: 'amber' | 'emerald' | 'blue' | 'purple'
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtext,
  icon,
  badgeText = 'Démonstration',
  badgeVariant = 'amber',
  className,
  accentColor = 'amber',
}) => {
  const accentClasses = {
    amber: 'border-amber-500/20 bg-amber-500/10 text-amber-400',
    emerald: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400',
    blue: 'border-blue-500/20 bg-blue-500/10 text-blue-400',
    purple: 'border-purple-500/20 bg-purple-500/10 text-purple-400',
  }

  return (
    <Card
      className={cn(
        'relative overflow-hidden bg-slate-900/80 border-slate-800 p-5 hover:border-slate-700 transition-all',
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {value}
            </span>
          </div>
          {subtext && (
            <p className="text-xs text-slate-400 pt-1 leading-snug">{subtext}</p>
          )}
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className={cn('p-2.5 rounded-xl border', accentClasses[accentColor])}>
            {icon}
          </div>
          {badgeText && (
            <Badge variant={badgeVariant} className="text-[10px] py-0.5 px-2 font-medium">
              {badgeText}
            </Badge>
          )}
        </div>
      </div>
    </Card>
  )
}
