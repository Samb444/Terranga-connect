import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Truck,
  Menu,
  X,
  LayoutDashboard,
  Boxes,
  Compass,
  Route,
  UserCheck,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  User,
} from 'lucide-react'
import { APP_CONFIG } from '../data/constants'
import { Badge } from '../components/ui/Badge'
import { cn } from '../lib/utils'
import { NotificationBell } from '../components/notifications/NotificationBell'
import { UserMenu } from '../components/user/UserMenu'

import type { UserRole } from '../types'

export interface NavItemConfig {
  id: string
  label: string
  icon: React.ReactNode
  badge?: string
  route?: string // Pour navigation vers une autre page (ex: /opportunites)
}

interface DashboardLayoutProps {
  role: UserRole
  activeTab: string
  onTabChange: (tabId: string) => void
  navItems: NavItemConfig[]
  children: React.ReactNode
  headerActions?: React.ReactNode
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  role,
  activeTab,
  onTabChange,
  navItems,
  children,
  headerActions,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  const isOwner = role === 'truck_owner'
  const isDriver = role === 'driver'
  const isShipper = role === 'shipper'
  const isAdmin = role === 'admin'

  const roleBadgeText = isOwner
    ? 'Propriétaire'
    : isDriver
    ? 'Chauffeur'
    : isShipper
    ? 'Chargeur'
    : 'Admin'

  const roleVariant = isOwner ? 'amber' : isDriver ? 'success' : isShipper ? 'default' : 'outline'

  return (
    <div className="min-h-screen flex flex-col bg-[#070d1e] text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Barre supérieure unifiée */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#070d1e]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Logo Teranga Connect + Badge rôle */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg p-1"
              title="Retour à l'accueil Teranga Connect"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-950/40 group-hover:scale-105 transition-transform">
                <Truck className="w-5 h-5 text-slate-950 stroke-[2.2]" />
              </div>
              <div>
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white block">
                  {APP_CONFIG.name}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-amber-400 font-semibold block">
                  Plateforme Produit
                </span>
              </div>
            </Link>

            <span className="h-5 w-[1px] bg-slate-800 hidden sm:block" />

            {/* Badge Rôle requis */}
            <Badge
              variant={roleVariant}
              className="py-1 px-3 text-xs font-bold"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              <span>{roleBadgeText}</span>
            </Badge>

            <Badge variant="outline" className="hidden lg:inline-flex text-[10px] text-slate-400 py-0.5 px-2">
              Teranga Connect
            </Badge>
          </div>

          {/* Actions & Raccourcis Header */}
          <div className="flex items-center gap-2 sm:gap-3">
            {headerActions && (
              <div className="hidden sm:flex items-center gap-2">{headerActions}</div>
            )}

            {/* Notification Bell & User Menu */}
            <NotificationBell />
            <UserMenu />

            {/* Bascule rapide entre espaces + lien Missions */}
            <div className="hidden xl:flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
              <Link
                to="/proprietaire"
                className={cn(
                  'px-2.5 py-1.5 rounded-md font-medium transition-colors',
                  isOwner
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:text-white'
                )}
              >
                Propriétaire
              </Link>
              <Link
                to="/chauffeur"
                className={cn(
                  'px-2.5 py-1.5 rounded-md font-medium transition-colors',
                  isDriver
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white'
                )}
              >
                Chauffeur
              </Link>
              <Link
                to="/chargeur"
                className={cn(
                  'px-2.5 py-1.5 rounded-md font-medium transition-colors',
                  isShipper
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                    : 'text-slate-400 hover:text-white'
                )}
              >
                Chargeur
              </Link>
              <Link
                to="/admin"
                className={cn(
                  'px-2.5 py-1.5 rounded-md font-medium transition-colors',
                  isAdmin
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'text-slate-400 hover:text-white'
                )}
              >
                Admin
              </Link>
              <Link
                to="/missions"
                className="px-2.5 py-1.5 rounded-md font-medium text-slate-400 hover:text-amber-300 transition-colors flex items-center gap-1"
              >
                <Route className="w-3 h-3 text-amber-400" />
                <span>Missions</span>
              </Link>
            </div>

            <Link
              to="/"
              className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Accueil</span>
            </Link>

            {/* Bouton Menu Mobile */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu de navigation'}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Menu Mobile Déroulant */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-b border-slate-800 bg-[#070d1e] px-4 py-4 space-y-3">
            {headerActions && <div className="sm:hidden pb-2">{headerActions}</div>}

            <p className="text-xs uppercase font-semibold text-slate-400 px-2 tracking-wider">
              Navigation {roleBadgeText}
            </p>

            <nav className="flex flex-col space-y-1">
              {navItems.map((item) => {
                if (item.route) {
                  return (
                    <Link
                      key={item.id}
                      to={item.route}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                        location.pathname === item.route
                          ? 'bg-amber-500/10 text-amber-400 font-semibold'
                          : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </Link>
                  )
                }

                const isActive = activeTab === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onTabChange(item.id)
                      setIsMobileMenuOpen(false)
                    }}
                    className={cn(
                      'flex items-center justify-between w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer',
                      isActive
                        ? 'bg-amber-500/10 text-amber-400 font-semibold'
                        : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <Badge variant="amber" className="text-[10px]">
                        {item.badge}
                      </Badge>
                    )}
                  </button>
                )
              })}
            </nav>

            <div className="pt-3 border-t border-slate-800 space-y-2">
              <p className="text-xs uppercase font-semibold text-slate-400 px-2 tracking-wider">
                Changer d'espace
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/proprietaire"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-center py-2 px-3 rounded-lg text-xs font-medium border ${
                    isOwner
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'border-slate-800 text-slate-400'
                  }`}
                >
                  Propriétaire
                </Link>
                <Link
                  to="/chauffeur"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-center py-2 px-3 rounded-lg text-xs font-medium border ${
                    !isOwner
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'border-slate-800 text-slate-400'
                  }`}
                >
                  Chauffeur
                </Link>
              </div>

              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-2 text-xs text-slate-400 hover:text-white"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Retour à la landing page</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Corps du dashboard : Sidebar Desktop + Contenu principal */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 flex gap-8">
        {/* Sidebar Desktop */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 space-y-6">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <Link
              to="/profil"
              className="flex items-center gap-3 pb-4 mb-3 border-b border-slate-800 hover:bg-slate-800/40 p-1.5 -m-1.5 rounded-xl transition-colors group"
              title="Voir mon profil démonstratif"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                {isOwner ? <Boxes className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              <div className="overflow-hidden flex-1">
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider group-hover:text-amber-400 transition-colors">
                  Profil Démo
                </p>
                <p className="text-sm font-bold text-white truncate">
                  {isOwner ? 'Mamadou Diop' : 'Ibrahima Ndiaye'}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {isOwner ? 'Transports Teranga' : 'Chauffeur Poids Lourd'}
                </p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
            </Link>

            <nav className="space-y-1" aria-label="Navigation latérale">
              {navItems.map((item) => {
                if (item.route) {
                  return (
                    <Link
                      key={item.id}
                      to={item.route}
                      className={cn(
                        'flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-xs font-medium transition-all group',
                        location.pathname === item.route
                          ? 'bg-amber-500/15 text-amber-300 font-bold border border-amber-500/20'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-slate-400 group-hover:text-amber-400 transition-colors">
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  )
                }

                const isActive = activeTab === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onTabChange(item.id)}
                    className={cn(
                      'flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer group text-left',
                      isActive
                        ? 'bg-amber-500/15 text-amber-300 font-bold border border-amber-500/20 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={
                          isActive
                            ? 'text-amber-400'
                            : 'text-slate-400 group-hover:text-amber-400 transition-colors'
                        }
                      >
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <Badge variant="amber" className="text-[10px] py-0 px-2 font-normal">
                        {item.badge}
                      </Badge>
                    )}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Encadré d'assurance prototype */}
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-4 text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Environnement Démonstration</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              Toutes les données affichées ou ajoutées lors de votre navigation restent en mémoire
              locale de démonstration.
            </p>
          </div>
        </aside>

        {/* Contenu principal */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  )
}

export {
  LayoutDashboard,
  Boxes,
  Compass,
  Route,
  UserCheck,
}
