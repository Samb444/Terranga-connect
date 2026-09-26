import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bell, CheckCheck, ExternalLink, Inbox } from 'lucide-react'
import { useTransport } from '../../hooks/useTransport'
import { NotificationItem } from './NotificationItem'
import { cn } from '../../lib/utils'

interface NotificationBellProps {
  className?: string
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const {
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useTransport()

  // Fermer au clic extérieur
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Fermer avec Echap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const recentNotifications = notifications.slice(0, 5)

  return (
    <div className={cn('relative inline-block text-left', className)} ref={dropdownRef}>
      {/* Bouton cloche */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all border border-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500',
          isOpen && 'bg-slate-800 text-amber-400 border-slate-700/60'
        )}
        aria-label={`Centre de notifications - ${unreadNotificationsCount} non lues`}
        aria-expanded={isOpen}
      >
        <Bell className="w-5 h-5" />

        {unreadNotificationsCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[11px] flex items-center justify-center shadow-lg shadow-amber-900/40 animate-pulse">
            {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
          </span>
        )}
      </button>

      {/* Menu déroulant */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#091124] border border-slate-800 shadow-2xl shadow-black/80 backdrop-blur-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
          role="menu"
          aria-orientation="vertical"
        >
          {/* Header */}
          <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">Notifications</span>
              {unreadNotificationsCount > 0 ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {unreadNotificationsCount} nouvelle{unreadNotificationsCount > 1 ? 's' : ''}
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 font-medium">À jour</span>
              )}
            </div>

            {unreadNotificationsCount > 0 && (
              <button
                type="button"
                onClick={markAllNotificationsAsRead}
                className="text-[11px] text-slate-400 hover:text-amber-400 flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-slate-800"
                title="Tout marquer comme lu"
              >
                <CheckCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Tout marquer lu</span>
              </button>
            )}
          </div>

          {/* Liste des notifications */}
          <div className="max-h-96 overflow-y-auto divide-y divide-slate-800/50 p-1.5 space-y-1">
            {recentNotifications.length > 0 ? (
              recentNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markNotificationAsRead}
                  onItemClick={() => setIsOpen(false)}
                  compact
                />
              ))
            ) : (
              <div className="py-8 px-4 text-center space-y-2">
                <div className="w-10 h-10 mx-auto rounded-full bg-slate-800/60 border border-slate-700/50 flex items-center justify-center text-slate-400">
                  <Inbox className="w-5 h-5" />
                </div>
                <p className="text-xs text-slate-300 font-medium">Aucune notification</p>
                <p className="text-[11px] text-slate-400">
                  Vous serez informé ici des candidatures, missions et opportunités.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 border-t border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
            <span className="text-[10px] text-slate-400">Démonstration locale</span>
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 hover:underline px-2 py-1"
            >
              <span>Voir tout</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
