import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Bell,
  CheckCheck,
  Filter,
  ArrowLeft,
  Trash2,
  ClipboardList,
  Route,
  Compass,
  Sparkles,
} from 'lucide-react'
import { useTransport } from '../hooks/useTransport'
import { NotificationItem } from '../components/notifications/NotificationItem'
import { EmptyState } from '../components/ui/EmptyState'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Header } from '../layouts/Header'
import { Footer } from '../layouts/Footer'
import { DiscoveryModal } from '../components/modals/DiscoveryModal'
import type { NotificationType } from '../types'
import { cn } from '../lib/utils'

export const NotificationsPage: React.FC = () => {
  const {
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
    activeRole,
  } = useTransport()

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'read' | NotificationType>(
    'all'
  )
  const [isDiscoveryOpen, setIsDiscoveryOpen] = useState(false)

  // Filtrage des notifications
  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'unread') return !n.read
    if (activeFilter === 'read') return n.read
    return n.type === activeFilter
  })

  return (
    <div className="min-h-screen flex flex-col bg-[#070d1e] text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      <Header onOpenJoinModal={() => setIsDiscoveryOpen(true)} />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation & Titre */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="space-y-1">
            <Link
              to="/missions"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retour aux missions</span>
            </Link>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                <Bell className="w-6 h-6 text-amber-400" />
                <span>Centre de Notifications</span>
              </h1>
              {unreadNotificationsCount > 0 && (
                <Badge variant="amber" className="text-xs">
                  {unreadNotificationsCount} non lue{unreadNotificationsCount > 1 ? 's' : ''}
                </Badge>
              )}
              <Badge
                variant="outline"
                className="text-xs text-slate-300 border-slate-700 bg-slate-900/80 font-medium"
              >
                Rôle : {activeRole === 'truck_owner' ? 'Propriétaire' : 'Chauffeur'}
              </Badge>
            </div>
          </div>

          {/* Actions globales */}
          <div className="flex items-center gap-2">
            {unreadNotificationsCount > 0 && (
              <Button
                variant="primary"
                size="sm"
                onClick={markAllNotificationsAsRead}
                className="text-xs"
              >
                <CheckCheck className="w-3.5 h-3.5 mr-1.5" />
                <span>Tout marquer comme lu</span>
              </Button>
            )}

            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearNotifications}
                className="text-xs text-slate-400 hover:text-rose-400"
                title="Vider la boîte de notifications"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                <span>Effacer tout</span>
              </Button>
            )}
          </div>
        </div>

        {/* Filtres par onglets */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={cn(
              'px-3.5 py-1.5 rounded-lg font-medium transition-colors shrink-0 cursor-pointer',
              activeFilter === 'all'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-950/20'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
            )}
          >
            Toutes ({notifications.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('unread')}
            className={cn(
              'px-3.5 py-1.5 rounded-lg font-medium transition-colors shrink-0 cursor-pointer flex items-center gap-1.5',
              activeFilter === 'unread'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-950/20'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
            )}
          >
            <span>Non lues</span>
            {unreadNotificationsCount > 0 && (
              <span
                className={cn(
                  'px-1.5 py-0.2 rounded-full text-[10px]',
                  activeFilter === 'unread'
                    ? 'bg-slate-950 text-amber-400 font-bold'
                    : 'bg-amber-500/20 text-amber-300'
                )}
              >
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('application')}
            className={cn(
              'px-3.5 py-1.5 rounded-lg font-medium transition-colors shrink-0 cursor-pointer flex items-center gap-1',
              activeFilter === 'application'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
            )}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Candidatures</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('mission')}
            className={cn(
              'px-3.5 py-1.5 rounded-lg font-medium transition-colors shrink-0 cursor-pointer flex items-center gap-1',
              activeFilter === 'mission'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
            )}
          >
            <Route className="w-3.5 h-3.5" />
            <span>Missions</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('opportunity')}
            className={cn(
              'px-3.5 py-1.5 rounded-lg font-medium transition-colors shrink-0 cursor-pointer flex items-center gap-1',
              activeFilter === 'opportunity'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
            )}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Opportunités</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('system')}
            className={cn(
              'px-3.5 py-1.5 rounded-lg font-medium transition-colors shrink-0 cursor-pointer flex items-center gap-1',
              activeFilter === 'system'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
            )}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Système</span>
          </button>
        </div>

        {/* Liste des notifications ou Empty State */}
        {filteredNotifications.length > 0 ? (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={markNotificationAsRead}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Aucune notification correspondante"
            description={
              activeFilter === 'unread'
                ? 'Toutes vos notifications sont lues ! Vous êtes totalement à jour.'
                : 'Aucune alerte n’a été enregistrée pour ce filtre.'
            }
            action={
              activeFilter !== 'all' ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveFilter('all')}
                  className="mt-3 text-xs"
                >
                  <Filter className="w-3.5 h-3.5 mr-1.5" />
                  <span>Afficher toutes les notifications</span>
                </Button>
              ) : undefined
            }
          />
        )}
      </main>

      <Footer />

      <DiscoveryModal
        isOpen={isDiscoveryOpen}
        onClose={() => setIsDiscoveryOpen(false)}
      />
    </div>
  )
}
