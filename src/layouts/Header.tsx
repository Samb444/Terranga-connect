import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Truck, Menu, X, ArrowRight, Compass, Route, Bell, User } from 'lucide-react'
import { APP_CONFIG, NAV_LINKS } from '../data/constants'
import { Button } from '../components/ui/Button'
import { NotificationBell } from '../components/notifications/NotificationBell'
import { UserMenu } from '../components/user/UserMenu'

interface HeaderProps {
  onOpenJoinModal: () => void
}

export const Header: React.FC<HeaderProps> = ({ onOpenJoinModal }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fermer avec la touche Echap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setIsMobileMenuOpen(false)

    if (location.pathname !== '/') {
      navigate(`/${href}`)
      return
    }

    const targetId = href.replace('#', '')
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'border-b border-slate-800/90 bg-[#070d1e]/90 backdrop-blur-md shadow-lg shadow-black/20'
          : 'border-b border-slate-800/50 bg-[#070d1e]/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo & Identité Teranga Connect */}
        <Link
          to="/"
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg p-1"
          aria-label="Retour en haut de page - Teranga Connect"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-950/40 group-hover:scale-105 transition-transform duration-200">
            <Truck className="w-5 h-5 text-slate-950 stroke-[2.2]" />
          </div>
          <div>
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white block">
              {APP_CONFIG.name}
            </span>
            <span className="text-[11px] uppercase tracking-wider text-amber-400 font-semibold block">
              Fret &bull; Réseau Routier
            </span>
          </div>
        </Link>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2" aria-label="Navigation principale">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-amber-400 hover:bg-slate-800/40 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              {link.label}
            </a>
          ))}

          {/* Lien direct Opportunités */}
          <Link
            to="/opportunites"
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/20 rounded-lg transition-colors ml-1"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Opportunités</span>
          </Link>

          {/* Lien direct Missions */}
          <Link
            to="/missions"
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-emerald-300 hover:text-emerald-200 bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 rounded-lg transition-colors ml-1"
          >
            <Route className="w-3.5 h-3.5" />
            <span>Missions</span>
          </Link>
        </nav>

        {/* Action Header Desktop */}
        <div className="hidden md:flex items-center gap-3">
          <NotificationBell />
          <UserMenu />
          <Button
            variant="primary"
            size="md"
            onClick={onOpenJoinModal}
            className="shadow-amber-900/30"
          >
            <span>Rejoindre Teranga Connect</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Bouton Hamburger & Actions Mobile */}
        <div className="flex md:hidden items-center gap-2">
          <NotificationBell />
          <UserMenu />
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
            aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Menu Déroulant Mobile */}
      {isMobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="md:hidden border-b border-slate-800 bg-[#070d1e]/98 backdrop-blur-xl px-4 pt-3 pb-6 shadow-2xl transition-all"
        >
          <nav className="flex flex-col space-y-1" aria-label="Navigation mobile">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-4 py-3 text-base font-medium text-slate-200 hover:text-amber-400 hover:bg-slate-900/80 rounded-lg transition-colors focus:outline-none focus-ring-2 focus:ring-amber-500"
              >
                {link.label}
              </a>
            ))}

            <Link
              to="/opportunites"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-3 text-base font-semibold text-amber-300 bg-amber-500/10 rounded-lg border border-amber-500/20"
            >
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4" />
                <span>Opportunités de transport</span>
              </div>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/missions"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-3 text-base font-semibold text-emerald-300 bg-emerald-500/10 rounded-lg border border-emerald-500/20"
            >
              <div className="flex items-center gap-2">
                <Route className="w-4 h-4" />
                <span>Missions en cours & à venir</span>
              </div>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/profil"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-3 text-base font-semibold text-slate-200 hover:text-amber-400 bg-slate-900/80 rounded-lg border border-slate-800"
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-amber-400" />
                <span>Mon Profil Démonstratif</span>
              </div>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/notifications"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-3 text-base font-semibold text-slate-200 hover:text-amber-400 bg-slate-900/80 rounded-lg border border-slate-800"
            >
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-400" />
                <span>Centre de Notifications</span>
              </div>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="pt-4 mt-2 border-t border-slate-800 space-y-2">
              <Button
                variant="primary"
                size="md"
                className="w-full justify-center"
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  onOpenJoinModal()
                }}
              >
                <span>Rejoindre Teranga Connect</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/proprietaire"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2.5 px-3 rounded-lg text-center text-xs font-medium bg-slate-900 border border-slate-800 text-amber-300"
                >
                  Espace Propriétaire
                </Link>
                <Link
                  to="/chauffeur"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2.5 px-3 rounded-lg text-center text-xs font-medium bg-slate-900 border border-slate-800 text-emerald-300"
                >
                  Espace Chauffeur
                </Link>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
