import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Truck,
  Menu,
  X,
  ArrowRight,
  Compass,
  Route,
  Bell,
  User,
  ShieldCheck,
  LogOut,
  ChevronDown,
} from 'lucide-react'
import { APP_CONFIG, NAV_LINKS } from '../data/constants'
import { NotificationBell } from '../components/notifications/NotificationBell'
import { UserMenu } from '../components/user/UserMenu'
import { useTransport } from '../hooks/useTransport'
import { cn } from '../lib/utils'

interface HeaderProps {
  onOpenJoinModal: () => void
}

export const Header: React.FC<HeaderProps> = ({ onOpenJoinModal }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMoreNavOpen, setIsMoreNavOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('accueil')
  const moreNavRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { unreadNotificationsCount, resetDemoData } = useTransport()

  const isLandingPage = location.pathname === '/'
  const isSecondaryActive =
    (isLandingPage && activeSection === 'a-propos') || location.pathname === '/opportunites'

  // Détection du scroll pour ombre portée sobre
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fermer le menu secondaire "Plus" au clic extérieur ou Échap
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreNavRef.current && !moreNavRef.current.contains(e.target as Node)) {
        setIsMoreNavOpen(false)
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMoreNavOpen) {
        setIsMoreNavOpen(false)
      }
    }
    if (isMoreNavOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMoreNavOpen])

  // Verrouillage de l'overflow du body quand le drawer mobile est ouvert
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  // Fermer le drawer avec la touche Echap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Détection de la section active sur la landing page
  useEffect(() => {
    if (!isLandingPage) return

    const sectionIds = ['accueil', 'fonctionnement', 'proprietaires', 'chauffeurs', 'a-propos']
    const observers: IntersectionObserver[] = []

    sectionIds.forEach((id) => {
      const element = document.getElementById(id)
      if (!element) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id)
            }
          })
        },
        { rootMargin: '-20% 0px -70% 0px' }
      )

      observer.observe(element)
      observers.push(observer)
    })

    return () => {
      observers.forEach((obs) => obs.disconnect())
    }
  }, [isLandingPage])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setIsMobileMenuOpen(false)
    setIsMoreNavOpen(false)

    if (location.pathname !== '/') {
      navigate(`/${href}`)
      return
    }

    const targetId = href.replace('#', '')
    setActiveSection(targetId)
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleMobileLogout = () => {
    setIsMobileMenuOpen(false)
    resetDemoData()
    navigate('/')
  }

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 w-full h-[72px] min-h-[72px] border-b border-white/[0.08] bg-[#070d1e]/95 backdrop-blur-md transition-shadow duration-200',
          isScrolled ? 'shadow-lg shadow-black/40' : 'shadow-sm shadow-black/10'
        )}
      >
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-2 lg:gap-3 2xl:gap-4">
          {/* ZONE A — LOGO (flex-shrink: 0) */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              to="/"
              className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg p-0.5"
              aria-label="Retour à l'accueil - Teranga Connect"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center shadow-md shadow-amber-950/30 shrink-0">
                <Truck className="w-5 h-5 text-slate-950 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base lg:text-lg tracking-tight text-white block leading-tight whitespace-nowrap">
                  {APP_CONFIG.name}
                </span>
                <span className="hidden 2xl:block text-[10px] uppercase tracking-wider text-amber-400 font-semibold leading-tight whitespace-nowrap">
                  Fret &bull; Réseau Routier
                </span>
              </div>
            </Link>
          </div>

          {/* ZONE B — NAVIGATION DESKTOP (flex: 1; min-width: 0; display: flex; justify-content: center;) */}
          <nav
            aria-label="Navigation principale"
            className="hidden lg:flex flex-1 min-w-0 justify-center items-center px-1"
          >
            <div className="flex items-center justify-center gap-1 xl:gap-1.5 2xl:gap-3 min-w-0">
              {/* 4 Liens Essentiels (visibles dès lg et supérieur) */}
              {NAV_LINKS.slice(0, 4).map((link) => {
                const isCurrentActive =
                  isLandingPage && activeSection === link.href.replace('#', '')

                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    aria-current={isCurrentActive ? 'page' : undefined}
                    className={cn(
                      'relative py-1.5 px-2 xl:px-2.5 text-xs xl:text-[13px] 2xl:text-sm font-medium whitespace-nowrap shrink-0 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-md',
                      isCurrentActive
                        ? 'text-amber-400'
                        : 'text-slate-300 hover:text-white hover:bg-white/[0.04]',
                      "after:content-[''] after:absolute after:bottom-0 after:left-2 after:right-2 after:h-[2px] after:rounded-full after:transition-colors duration-150",
                      isCurrentActive ? 'after:bg-amber-400' : 'after:bg-transparent'
                    )}
                  >
                    {link.label}
                  </a>
                )
              })}

              {/* Liens Secondaires inline sur écran >= 1280px (xl:) */}
              {NAV_LINKS.slice(4).map((link) => {
                const isRoute = 'isRoute' in link && Boolean(link.isRoute)
                const isCurrentActive = isRoute
                  ? location.pathname === link.href
                  : isLandingPage && activeSection === link.href.replace('#', '')

                if (isRoute) {
                  return (
                    <Link
                      key={link.label}
                      to={link.href}
                      aria-current={isCurrentActive ? 'page' : undefined}
                      className={cn(
                        'hidden xl:inline-block relative py-1.5 px-2 xl:px-2.5 text-xs xl:text-[13px] 2xl:text-sm font-medium whitespace-nowrap shrink-0 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-md',
                        isCurrentActive
                          ? 'text-amber-400'
                          : 'text-slate-300 hover:text-white hover:bg-white/[0.04]',
                        "after:content-[''] after:absolute after:bottom-0 after:left-2 after:right-2 after:h-[2px] after:rounded-full after:transition-colors duration-150",
                        isCurrentActive ? 'after:bg-amber-400' : 'after:bg-transparent'
                      )}
                    >
                      {link.label}
                    </Link>
                  )
                }

                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    aria-current={isCurrentActive ? 'page' : undefined}
                    className={cn(
                      'hidden xl:inline-block relative py-1.5 px-2 xl:px-2.5 text-xs xl:text-[13px] 2xl:text-sm font-medium whitespace-nowrap shrink-0 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-md',
                      isCurrentActive
                        ? 'text-amber-400'
                        : 'text-slate-300 hover:text-white hover:bg-white/[0.04]',
                      "after:content-[''] after:absolute after:bottom-0 after:left-2 after:right-2 after:h-[2px] after:rounded-full after:transition-colors duration-150",
                      isCurrentActive ? 'after:bg-amber-400' : 'after:bg-transparent'
                    )}
                  >
                    {link.label}
                  </a>
                )
              })}

              {/* Menu compact "Plus" sur écran 1024px-1279px (lg:flex xl:hidden) */}
              <div className="relative xl:hidden" ref={moreNavRef}>
                <button
                  type="button"
                  onClick={() => setIsMoreNavOpen(!isMoreNavOpen)}
                  className={cn(
                    'flex items-center gap-1 py-1.5 px-2 text-xs font-medium rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer whitespace-nowrap shrink-0',
                    isSecondaryActive
                      ? 'text-amber-400 bg-white/[0.04]'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                  )}
                  aria-expanded={isMoreNavOpen}
                  aria-haspopup="menu"
                  aria-label="Plus d'onglets de navigation"
                >
                  <span>Plus</span>
                  <ChevronDown
                    className={cn(
                      'w-3.5 h-3.5 transition-transform duration-150 shrink-0',
                      isMoreNavOpen && 'rotate-180 text-amber-400'
                    )}
                  />
                </button>

                {isMoreNavOpen && (
                  <div
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-44 rounded-xl bg-[#091124] border border-white/[0.08] shadow-2xl shadow-black/80 backdrop-blur-xl p-1 z-50 animate-in fade-in zoom-in-95 duration-150"
                    role="menu"
                    aria-label="Navigation secondaire"
                  >
                    <a
                      href="#a-propos"
                      role="menuitem"
                      onClick={(e) => {
                        setIsMoreNavOpen(false)
                        handleNavClick(e, '#a-propos')
                      }}
                      className={cn(
                        'flex items-center px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer',
                        activeSection === 'a-propos' && isLandingPage
                          ? 'text-amber-400 bg-white/[0.06]'
                          : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                      )}
                    >
                      À propos
                    </a>
                    <Link
                      to="/opportunites"
                      role="menuitem"
                      onClick={() => setIsMoreNavOpen(false)}
                      className={cn(
                        'flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer',
                        location.pathname === '/opportunites'
                          ? 'text-amber-400 bg-white/[0.06]'
                          : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                      )}
                    >
                      <span>Opportunités</span>
                      <Compass className="w-3.5 h-3.5 text-amber-400" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </nav>

          {/* ZONE C — ACTIONS DESKTOP (flex-shrink: 0; display: flex; align-items: center;) */}
          <div className="hidden lg:flex flex-shrink-0 items-center gap-1.5 xl:gap-2 2xl:gap-3">
            {/* 8. Icône notification avec compteur */}
            <NotificationBell />

            {/* 9. Missions */}
            <Link
              to="/missions"
              aria-current={location.pathname === '/missions' ? 'page' : undefined}
              className={cn(
                'relative px-2.5 xl:px-3 py-1.5 text-xs xl:text-[13px] 2xl:text-sm font-medium whitespace-nowrap shrink-0 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500',
                location.pathname === '/missions'
                  ? 'text-amber-400 font-semibold bg-white/[0.04]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              )}
            >
              Missions
            </Link>

            {/* 10. Administration Teranga */}
            <UserMenu variant="admin" />

            {/* 11. Bouton CTA : Rejoindre Teranga Connect → */}
            <button
              type="button"
              onClick={onOpenJoinModal}
              className="h-[44px] min-h-[44px] max-h-[44px] px-3.5 2xl:px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-semibold text-xs 2xl:text-sm shrink-0 whitespace-nowrap shadow-md shadow-amber-950/20 hover:shadow-lg hover:shadow-amber-900/30 transition-colors transition-shadow duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 flex items-center justify-center cursor-pointer"
            >
              <span>Rejoindre Teranga Connect</span>
              <ArrowRight className="w-4 h-4 ml-1.5 shrink-0" />
            </button>
          </div>

          {/* CONTROLES MOBILE / TABLETTE (<1024px) : [Logo] [Cloche] [☰] */}
          <div className="flex lg:hidden flex-shrink-0 items-center gap-2">
            <NotificationBell />
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-10 h-10 min-w-10 rounded-xl flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 shrink-0 cursor-pointer"
              aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 shrink-0" />
              ) : (
                <Menu className="w-5 h-5 shrink-0" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* TIROIR / DRAWER MOBILE (<1024px) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Panneau Drawer latéral */}
          <div
            id="mobile-navigation-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navigation mobile"
            className="fixed inset-y-0 right-0 z-50 w-full max-w-[340px] sm:max-w-sm bg-[#091124] border-l border-white/[0.08] shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-250"
          >
            {/* Header du drawer */}
            <div className="p-4 border-b border-white/[0.08] flex items-center justify-between shrink-0 bg-slate-900/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center shadow-md shrink-0">
                  <Truck className="w-4 h-4 text-slate-950 stroke-[2.2]" />
                </div>
                <div>
                  <span className="font-extrabold text-sm text-white block leading-tight">
                    {APP_CONFIG.name}
                  </span>
                  <span className="text-[10px] text-amber-400 font-semibold block uppercase tracking-wider">
                    Fret &bull; Réseau Routier
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer"
                aria-label="Fermer le menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Liste verticale des liens (Ordre strict demandé par Section 11) */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Liens mobiles">
              {/* 1. Accueil */}
              <a
                href="#accueil"
                onClick={(e) => handleNavClick(e, '#accueil')}
                className="flex items-center px-3.5 py-2.5 text-sm font-medium text-slate-200 hover:text-amber-400 hover:bg-white/[0.04] rounded-xl transition-colors"
              >
                Accueil
              </a>

              {/* 2. Fonctionnement */}
              <a
                href="#fonctionnement"
                onClick={(e) => handleNavClick(e, '#fonctionnement')}
                className="flex items-center px-3.5 py-2.5 text-sm font-medium text-slate-200 hover:text-amber-400 hover:bg-white/[0.04] rounded-xl transition-colors"
              >
                Fonctionnement
              </a>

              {/* 3. Propriétaires */}
              <a
                href="#proprietaires"
                onClick={(e) => handleNavClick(e, '#proprietaires')}
                className="flex items-center px-3.5 py-2.5 text-sm font-medium text-slate-200 hover:text-amber-400 hover:bg-white/[0.04] rounded-xl transition-colors"
              >
                Propriétaires
              </a>

              {/* 4. Chauffeurs */}
              <a
                href="#chauffeurs"
                onClick={(e) => handleNavClick(e, '#chauffeurs')}
                className="flex items-center px-3.5 py-2.5 text-sm font-medium text-slate-200 hover:text-amber-400 hover:bg-white/[0.04] rounded-xl transition-colors"
              >
                Chauffeurs
              </a>

              {/* 5. À propos */}
              <a
                href="#a-propos"
                onClick={(e) => handleNavClick(e, '#a-propos')}
                className="flex items-center px-3.5 py-2.5 text-sm font-medium text-slate-200 hover:text-amber-400 hover:bg-white/[0.04] rounded-xl transition-colors"
              >
                À propos
              </a>

              {/* 6. Opportunités */}
              <Link
                to="/opportunites"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between px-3.5 py-2.5 text-sm font-medium text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Compass className="w-4 h-4 text-amber-400" />
                  <span>Opportunités</span>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-400/60" />
              </Link>

              {/* Séparateur élégant */}
              <div className="py-2">
                <div className="border-t border-white/[0.08]" />
              </div>

              {/* 7. Notifications */}
              <Link
                to="/notifications"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between px-3.5 py-2.5 text-sm font-medium text-slate-200 hover:text-white hover:bg-white/[0.04] rounded-xl transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Bell className="w-4 h-4 text-emerald-400" />
                  <span>Notifications</span>
                </div>
                {unreadNotificationsCount > 0 && (
                  <span className="min-w-5 h-5 px-1.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">
                    {unreadNotificationsCount}
                  </span>
                )}
              </Link>

              {/* 8. Missions */}
              <Link
                to="/missions"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between px-3.5 py-2.5 text-sm font-medium text-slate-200 hover:text-white hover:bg-white/[0.04] rounded-xl transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Route className="w-4 h-4 text-sky-400" />
                  <span>Missions</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </Link>

              {/* 9. Administration Teranga */}
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between px-3.5 py-2.5 text-sm font-medium text-slate-200 hover:text-white hover:bg-white/[0.04] rounded-xl transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center text-[10px] font-bold">
                    AT
                  </div>
                  <span>Administration Teranga</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </Link>

              {/* 10. Profil */}
              <Link
                to="/profil"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between px-3.5 py-2.5 text-sm font-medium text-slate-200 hover:text-white hover:bg-white/[0.04] rounded-xl transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-amber-400" />
                  <span>Profil</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </Link>

              {/* 11. Tableau de bord admin */}
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between px-3.5 py-2.5 text-sm font-medium text-slate-200 hover:text-white hover:bg-white/[0.04] rounded-xl transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <span>Tableau de bord admin</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </Link>

              {/* 12. Déconnexion */}
              <button
                type="button"
                onClick={handleMobileLogout}
                className="w-full flex items-center justify-between px-3.5 py-2.5 text-sm font-medium text-rose-300 hover:text-rose-200 hover:bg-rose-500/10 rounded-xl transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>Déconnexion</span>
                </div>
                <span className="text-[10px] text-slate-500">Restaurer démo</span>
              </button>
            </nav>

            {/* CTA Mobile pleine largeur (Section 11) */}
            <div className="p-4 border-t border-white/[0.08] bg-slate-950/60 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  onOpenJoinModal()
                }}
                className="w-full h-[46px] rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-semibold text-sm shadow-lg shadow-amber-950/30 flex items-center justify-center transition-colors transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer"
              >
                <span>Rejoindre Teranga Connect</span>
                <ArrowRight className="w-4 h-4 ml-2 shrink-0" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
