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
} from 'lucide-react'
import { useTransport } from '../../hooks/useTransport'
import { ResetDemoModal } from '../modals/ResetDemoModal'
import { Badge } from '../ui/Badge'
import { cn } from '../../lib/utils'

interface UserMenuProps {
  className?: string
}

export const UserMenu: React.FC<UserMenuProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const {
    owner,
    driver,
    shipper,
    activeRole,
    setActiveRole,
    unreadNotificationsCount,
  } = useTransport()

  const isOwner = activeRole === 'truck_owner'
  const isDriver = activeRole === 'driver'
  const isShipper = activeRole === 'shipper'
  const isAdmin = activeRole === 'admin'

  let currentName = owner.fullName
  let initials = 'MD'
  let roleLabel = 'Propriétaire'
  let subLabel = owner.companyName

  if (isDriver) {
    currentName = driver.fullName
    initials = 'IN'
    roleLabel = 'Chauffeur'
    subLabel = 'Chauffeur Poids Lourd'
  } else if (isShipper) {
    currentName = shipper.fullName
    initials = 'AS'
    roleLabel = 'Chargeur'
    subLabel = shipper.companyName
  } else if (isAdmin) {
    currentName = 'Administration Teranga'
    initials = 'TC'
    roleLabel = 'Admin'
    subLabel = 'Supervision Plateforme'
  }

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

  return (
    <>
      <div className={cn('relative inline-block text-left', className)} ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border transition-all text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer',
            isOpen
              ? 'bg-slate-800/90 border-amber-500/40'
              : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
          )}
          aria-label={`Menu utilisateur démo - ${currentName} (${roleLabel})`}
          aria-expanded={isOpen}
        >
          {/* Avatar avec initiales */}
          <div
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shadow-md border',
              isOwner
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
            )}
          >
            {initials}
          </div>

          {/* Nom & Rôle masqués sur petit écran */}
          <div className="hidden sm:block text-left pr-1">
            <span className="block text-xs font-bold text-white leading-tight truncate max-w-[120px]">
              {currentName}
            </span>
            <span className="block text-[10px] text-amber-400 font-medium">
              {roleLabel} Démo
            </span>
          </div>

          <ChevronDown
            className={cn(
              'w-3.5 h-3.5 text-slate-400 transition-transform duration-200',
              isOpen && 'rotate-180 text-amber-400'
            )}
          />
        </button>

        {/* Menu déroulant */}
        {isOpen && (
          <div
            className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-[#091124] border border-slate-800 shadow-2xl shadow-black/80 backdrop-blur-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            role="menu"
            aria-orientation="vertical"
          >
            {/* Header du profil */}
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
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-white truncate">{currentName}</p>
                    <Badge variant="outline" className="text-[9px] py-0 px-1.5 text-amber-400 border-amber-500/30">
                      Fictif
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{subLabel}</p>
                </div>
              </div>

              {/* Bascule de profil multi-rôles */}
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
                      'px-2 py-1.5 rounded-lg text-[11px] font-medium transition-colors text-left flex items-center justify-between',
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
                      'px-2 py-1.5 rounded-lg text-[11px] font-medium transition-colors text-left flex items-center justify-between',
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
                      'px-2 py-1.5 rounded-lg text-[11px] font-medium transition-colors text-left flex items-center justify-between',
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
                      'px-2 py-1.5 rounded-lg text-[11px] font-medium transition-colors text-left flex items-center justify-between',
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

            {/* Liens de navigation du menu */}
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

              <Link
                to="/chargeur"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
              >
                <Building2 className="w-3.5 h-3.5 text-sky-400" />
                <span className="text-xs">Espace Chargeur & Donneur d'ordre</span>
              </Link>

              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
              >
                <Building2 className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-xs">Supervision Plateforme & Admin</span>
              </Link>
            </div>

            {/* Section réinitialisation / fin de session démo */}
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
