import React from 'react'
import { Truck, AlertCircle } from 'lucide-react'
import { APP_CONFIG, NAV_LINKS } from '../data/constants'

export const Footer: React.FC = () => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const targetId = href.replace('#', '')
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950 py-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start justify-between">
          {/* Identité Teranga Connect & Description */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 shadow-md shadow-amber-950/20">
                <Truck className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">
                {APP_CONFIG.name}
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {APP_CONFIG.description}
            </p>
          </div>

          {/* Liens de navigation */}
          <div className="md:col-span-1 md:text-center">
            <h4 className="text-xs uppercase tracking-wider text-slate-300 font-semibold mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-slate-400 hover:text-amber-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Mention Projet en cours de développement */}
          <div className="md:col-span-1 md:text-right flex flex-col md:items-end space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{APP_CONFIG.statusNotice}</span>
            </div>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              Plateforme en cours de conception et d’élaboration technique pour le transport et la logistique au Sénégal.
            </p>
          </div>
        </div>

        {/* Ligne inférieure */}
        <div className="mt-10 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Teranga Connect &mdash; Tous droits réservés.</p>
          <p className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Infrastructure &bull; Phase 2</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
