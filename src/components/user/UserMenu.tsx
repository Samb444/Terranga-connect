import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  User,
  Route,
  Bell,
  RotateCcw,
  ChevronDown,
  Building2,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
  LogOut,
} from 'lucide-react'
import { useTransport } from '../../hooks/useTransport'
import { ResetDemoModal } from '../modals/ResetDemoModal'
import { Badge } from '../ui/Badge'
import { cn } from '../../lib/utils'

export interface UserMenuProps {
  className?: string
  showLabel?: boolean
  variant?: 'admin' | 'full'
}

export const UserMenu: React.FC<UserMenuProps> = ({
  className,
  showLabel = true,
  variant = 'admin',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const menuItemsRef = useRef<(HTMLAnchorElement | HTMLButtonElement | null)[]>([])
  const navigate = useNavigate()

  const {
    owner,
    driver,
    shipper,
    activeRole,
    setActiveRole,
    unreadNotificationsCount,
    resetDemoData,
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

  // Fermer avec Echap et gestion du focus clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') {
        setIsOpen(false)
        triggerRef.current?.focus()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        const focusable = menuItemsRef.current.filter(Boolean) as HTMLElement[]
        if (focusable.length > 0) {
          const currentIndex = focusable.indexOf(document.activeElement as HTMLElement)
          const nextIndex = (currentIndex + 1) % focusable.length
          focusable[nextIndex]?.focus()
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        const focusable = menuItemsRef.current.filter(Boolean) as HTMLElement[]
        if (focusable.length > 0) {
          const currentIndex = focusable.indexOf(document.activeElement as HTMLElement)
          const prevIndex = (currentIndex - 1 + focusable.length) % focusable.length
          focusable[prevIndex]?.focus()
        }
      } else if (e.key === 'Home') {
        e.preventDefault()
        const focusable = menuItemsRef.current.filter(Boolean) as HTMLElement[]
        focusable[0]?.focus()
      } else if (e.key === 'End') {
        e.preventDefault()
        const focusable = menuItemsRef.current.filter(Boolean) as HTMLElement[]
        focusable[focusable.length - 1]?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const handleLogout = () => {
    setIsOpen(false)
    resetDemoData()
    navigate('/')
  }

  // --- VARIANT ADMIN (Exigences strictes du Prompt Section 9) ---
  if (variant === 'admin') {
    return (
      <div className={cn('relative inline-block text-left shrink-0', className)} ref={dropdownRef}>
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'flex items-center justify-center gap-2 h-10 min-w-10 2xl:w-auto 2xl:h-auto p-1 2xl:px-2.5 2xl:py-1.5 rounded-xl border transition-colors text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer shrink-0 whitespace-nowrap',
            isOpen
              ? 'bg-slate-800/90 border-amber-500/40 text-amber-400'
              : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60 text-slate-200'
          )}
          title="Administration Teranga"
          aria-label="Administration Teranga"
          aria-haspopup="menu"
          aria-expanded={isOpen}
        >
          {/* Avatar fixe 32x32px avec AT */}
          <div className="w-8 h-8 min-w-8 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold text-xs shrink-0 select-none shadow-sm">
            AT
          </div>

          {/* Libellé visible à partir de 1440px (2xl), compact [AT] en dessous */}
          <span className="hidden 2xl:inline text-xs font-semibold text-white whitespace-nowrap">
            Administration Teranga
          </span>

          <ChevronDown
            className={cn(
              'hidden 2xl:inline w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0',
              isOpen && 'rotate-180 text-amber-400'
            )}
          />
        </button>

        {/* Dropdown Administration Teranga */}
        {isOpen && (
          <div
            className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#091124] border border-white/[0.08] shadow-2xl shadow-black/80 backdrop-blur-xl z-50 overflow-hidden py-1.5 animate-in fade-in zoom-in-95 duration-150"
            role="menu"
            aria-orientation="vertical"
            aria-label="Menu Administration Teranga"
          >
            <div className="px-3.5 py-2 border-b border-slate-800/80 mb-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Session Administrative
              </span>
              <span className="text-xs font-semibold text-white block mt-0.5">
                Administration Teranga
              </span>
            </div>

            {/* 1. Profil */}
            <Link
              ref={(el) => { menuItemsRef.current[0] = el }}
              to="/profil"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/[0.06] transition-colors focus:outline-none focus-visible:bg-white/[0.08] focus-visible:text-amber-400 cursor-pointer"
            >
              <User className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="block font-medium">Profil</span>
                <span className="block text-[10px] text-slate-400 font-normal">
                  Consulter les coordonnées du compte
                </span>
              </div>
            </Link>

            {/* 2. Tableau de bord admin */}
            <Link
              ref={(el) => { menuItemsRef.current[1] = el }}
              to="/admin"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/[0.06] transition-colors focus:outline-none focus-visible:bg-white/[0.08] focus-visible:text-amber-400 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <span className="block font-medium">Tableau de bord admin</span>
                <span className="block text-[10px] text-slate-400 font-normal">
                  Supervision et gestion plateforme
                </span>
              </div>
            </Link>

            {/* 3. Déconnexion */}
            <div className="pt-1 mt-1 border-t border-slate-800/80">
              <button
                ref={(el) => { menuItemsRef.current[2] = el }}
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold text-rose-300 hover:text-rose-200 hover:bg-rose-500/10 transition-colors focus:outline-none focus-visible:bg-rose-500/20 text-left cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-400 shrink-0" />
                <div>
                  <span className="block font-medium">Déconnexion</span>
                  <span className="block text-[10px] text-rose-400/80 font-normal">
                    Réinitialiser et quitter la session
                  </span>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // --- VARIANT FULL (Utilisé dans DashboardLayout pour la bascule de rôles démo) ---
  const isOwner = activeRole === 'truck_owner'
  const isDriver = activeRole === 'driver'
  const isShipper = activeRole === 'shipper'
  const isAdmin = activeRole === 'admin'

  let currentName = owner.fullName
  let roleLabel = 'Propriétaire'
  let subLabel = owner.companyName

  if (isDriver) {
    currentName = driver.fullName
    roleLabel = 'Chauffeur'
    subLabel = 'Chauffeur Poids Lourd'
  } else if (isShipper) {
    currentName = shipper.fullName
    roleLabel = 'Chargeur'
    subLabel = shipper.companyName
  } else if (isAdmin) {
    currentName = 'Administration Teranga'
    roleLabel = 'Admin'
    subLabel = 'Supervision Plateforme'
  }

  const initials =
    currentName
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'TC'

  return (
    <>
      <div className={cn('relative inline-block text-left shrink-0', className)} ref={dropdownRef}>
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border transition-colors text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer',
            isOpen
              ? 'bg-slate-800/90 border-amber-500/40'
              : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
          )}
          aria-label={showLabel ? `Menu utilisateur démo - ${currentName} (${roleLabel})` : 'Menu utilisateur et navigation démo'}
          aria-expanded={isOpen}
        >
          <div
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shadow-md border shrink-0',
              isOwner
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
            )}
          >
            {initials}
          </div>

          {showLabel && (
            <div className="hidden xl:block text-left pr-1">
              <span className="block text-xs font-bold text-white leading-tight truncate max-w-[120px]">
                {currentName}
              </span>
              <span className="block text-[10px] text-amber-400 font-medium">
                {roleLabel} Démo
              </span>
            </div>
          )}

          <ChevronDown
            className={cn(
              'w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0',
              isOpen && 'rotate-180 text-amber-400'
            )}
          />
        </button>

        {isOpen && (
          <div
            className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-[#091124] border border-slate-800 shadow-2xl shadow-black/80 backdrop-blur-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            role="menu"
            aria-orientation="vertical"
          >
            <div className="p-4 border-b border-slate-800/80 bg-slate-900/70 space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-11 h-11 rounded-xl flex items-center justify-center font-extrabold text-sm border shadow-inner',
                    isOwner
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  )}
                >
                  {initials}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-white truncate">{currentName}</p>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{subLabel}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/60 space-y-1.5 text-xs">
                <span className="text-slate-400 block text-[11px]">Changer de rôle actif :</span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveRole('truck_owner')
                      setIsOpen(false)
                      navigate('/proprietaire')
                    }}
                    className={cn(
                      'px-2 py-1.5 rounded-lg text-[11px] font-medium transition-colors text-left flex items-center justify-between cursor-pointer',
                      isOwner
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                    )}
                  >
                    <span>Propriétaire</span>
                    {isOwner && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveRole('driver')
                      setIsOpen(false)
                      navigate('/chauffeur')
                    }}
                    className={cn(
                      'px-2 py-1.5 rounded-lg text-[11px] font-medium transition-colors text-left flex items-center justify-between cursor-pointer',
                      isDriver
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                    )}
                  >
                    <span>Chauffeur</span>
                    {isDriver && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveRole('shipper')
                      setIsOpen(false)
                      navigate('/chargeur')
                    }}
                    className={cn(
                      'px-2 py-1.5 rounded-lg text-[11px] font-medium transition-colors text-left flex items-center justify-between cursor-pointer',
                      isShipper
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                        : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                    )}
                  >
                    <span>Chargeur</span>
                    {isShipper && <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveRole('admin')
                      setIsOpen(false)
                      navigate('/admin')
                    }}
                    className={cn(
                      'px-2 py-1.5 rounded-lg text-[11px] font-medium transition-colors text-left flex items-center justify-between cursor-pointer',
                      isAdmin
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                        : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                    )}
                  >
                    <span>Admin</span>
                    {isAdmin && <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-2 space-y-1 text-xs">
              <Link
                to="/profil"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-slate-800/80 transition-colors"
              >
                <User className="w-4 h-4 text-amber-400" />
                <div className="flex-1">
                  <span className="font-semibold block">Mon Profil Démonstratif</span>
                  <span className="text-[11px] text-slate-400 block">
                    Informations, coordonnées et statistiques
                  </span>
                </div>
              </Link>

              <Link
                to="/notifications"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-slate-800/80 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Bell className="w-4 h-4 text-emerald-400" />
                  <div>
                    <span className="font-semibold block">Centre de Notifications</span>
                    <span className="text-[11px] text-slate-400 block">
                      Alertes candidatures et missions
                    </span>
                  </div>
                </div>
                {unreadNotificationsCount > 0 && (
                  <Badge variant="amber" className="text-[10px]">
                    {unreadNotificationsCount}
                  </Badge>
                )}
              </Link>

              <Link
                to="/missions"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-slate-800/80 transition-colors"
              >
                <Route className="w-4 h-4 text-sky-400" />
                <div className="flex-1">
                  <span className="font-semibold block">Missions & Trajets</span>
                  <span className="text-[11px] text-slate-400 block">
                    Suivi du cycle complet en temps réel
                  </span>
                </div>
              </Link>

              <Link
                to={isOwner ? '/proprietaire' : isDriver ? '/chauffeur' : isShipper ? '/chargeur' : '/admin'}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-slate-800/80 transition-colors"
              >
                {isOwner ? (
                  <Building2 className="w-4 h-4 text-amber-400" />
                ) : isDriver ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isShipper ? (
                  <Building2 className="w-4 h-4 text-sky-400" />
                ) : (
                  <Building2 className="w-4 h-4 text-purple-400" />
                )}
                <div className="flex-1">
                  <span className="font-semibold block">
                    Mon Espace Actif ({roleLabel})
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    Tableau de bord opérationnel
                  </span>
                </div>
              </Link>

              <Link
                to="/abonnement"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-slate-800/80 transition-colors"
              >
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <div className="flex-1">
                  <span className="font-semibold block">Abonnement (30 000 FCFA)</span>
                  <span className="text-[11px] text-slate-400 block">
                    Formule matériel & statut actif
                  </span>
                </div>
              </Link>
            </div>

            <div className="p-2 border-t border-slate-800/80 bg-slate-900/40">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  setIsResetModalOpen(true)
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-rose-300 hover:bg-rose-500/10 hover:text-rose-200 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                  <span>Réinitialiser la session démo</span>
                </div>
                <span className="text-[10px] text-slate-500">Restaurer</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <ResetDemoModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onSuccess={() => {
          navigate('/profil')
        }}
      />
    </>
  )
}
