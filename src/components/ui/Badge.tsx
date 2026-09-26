import React from 'react'
import { cn } from '../../lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'amber' | 'outline' | 'danger'
  children: React.ReactNode
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  className,
  children,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium tracking-wide'

  const variants = {
    default: 'bg-slate-800 text-slate-300 border border-slate-700/60',
    success: 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50',
    warning: 'bg-amber-950/60 text-amber-300 border border-amber-800/50',
    amber: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    outline: 'border border-slate-700 text-slate-300',
    danger: 'bg-rose-950/60 text-rose-300 border border-rose-800/50',
  }

  return (
    <span className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </span>
  )
}
