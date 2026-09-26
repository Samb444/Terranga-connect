import React from 'react'
import { Link } from 'react-router-dom'
import {
  ClipboardList,
  Route,
  Compass,
  Bell,
  Check,
  ChevronRight,
} from 'lucide-react'
import type { AppNotification } from '../../types'
import { cn } from '../../lib/utils'

interface NotificationItemProps {
  notification: AppNotification
  onMarkAsRead?: (id: string) => void
  onItemClick?: () => void
  compact?: boolean
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onItemClick,
  compact = false,
}) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'application':
        return <ClipboardList className="w-4 h-4 text-amber-400" />
      case 'mission':
        return <Route className="w-4 h-4 text-emerald-400" />
      case 'opportunity':
        return <Compass className="w-4 h-4 text-sky-400" />
      case 'system':
      default:
        return <Bell className="w-4 h-4 text-purple-400" />
    }
  }

  const getIconBg = () => {
    switch (notification.type) {
      case 'application':
        return 'bg-amber-500/10 border-amber-500/20'
      case 'mission':
        return 'bg-emerald-500/10 border-emerald-500/20'
      case 'opportunity':
        return 'bg-sky-500/10 border-sky-500/20'
      case 'system':
      default:
        return 'bg-purple-500/10 border-purple-500/20'
    }
  }

  const handleClick = () => {
    if (!notification.read && onMarkAsRead) {
      onMarkAsRead(notification.id)
    }
    if (onItemClick) {
      onItemClick()
    }
  }

  const content = (
    <div
      className={cn(
        'group flex items-start gap-3 transition-colors rounded-xl',
        compact ? 'p-2.5' : 'p-4 border',
        notification.read
          ? compact
            ? 'hover:bg-slate-800/40 text-slate-300'
            : 'bg-slate-900/40 border-slate-800/70 hover:bg-slate-900/70 text-slate-300'
          : compact
            ? 'bg-amber-500/5 hover:bg-amber-500/10 text-white font-medium'
            : 'bg-gradient-to-r from-amber-500/10 via-slate-900/80 to-slate-900/60 border-amber-500/30 hover:border-amber-500/50 text-white'
      )}
    >
      <div
        className={cn(
          'shrink-0 rounded-lg border flex items-center justify-center',
          compact ? 'w-8 h-8' : 'w-10 h-10',
          getIconBg()
        )}
      >
        {getIcon()}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p
            className={cn(
              'truncate font-semibold',
              compact ? 'text-xs' : 'text-sm',
              !notification.read ? 'text-amber-200' : 'text-slate-200'
            )}
          >
            {notification.title}
          </p>
          <span className="shrink-0 text-[10px] text-slate-400">
            {notification.createdAt}
          </span>
        </div>

        <p
          className={cn(
            'mt-1 leading-relaxed text-slate-300',
            compact ? 'text-[11px] line-clamp-2' : 'text-xs'
          )}
        >
          {notification.message}
        </p>

        <div className="flex items-center justify-between gap-2 mt-2 pt-1">
          <div className="flex items-center gap-1.5">
            {!notification.read && (
              <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Non lu
              </span>
            )}
            {notification.targetRole && notification.targetRole !== 'all' && (
              <span className="text-[10px] text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700/60">
                {notification.targetRole === 'truck_owner' ? 'Propriétaire' : 'Chauffeur'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!notification.read && onMarkAsRead && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onMarkAsRead(notification.id)
                }}
                className="text-[10px] text-slate-400 hover:text-amber-400 flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-slate-800 transition-colors"
                title="Marquer comme lu"
              >
                <Check className="w-3 h-3" />
                <span>Marquer lu</span>
              </button>
            )}
            {notification.link && (
              <span className="text-[10px] text-amber-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                <span>Détails</span>
                <ChevronRight className="w-3 h-3" />
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  if (notification.link) {
    return (
      <Link
        to={notification.link}
        onClick={handleClick}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-xl"
      >
        {content}
      </Link>
    )
  }

  return (
    <div onClick={handleClick} className="cursor-pointer">
      {content}
    </div>
  )
}
