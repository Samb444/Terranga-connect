import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { ShieldAlert, ArrowRight, UserCheck } from 'lucide-react'
import { useTransport } from '../../hooks/useTransport'
import {
  canAccessRoute,
  AUTH_PROTOTYPE_DISCLAIMER,
  getRoleLabel,
  getDefaultRouteForRole,
  ROUTE_PERMISSIONS,
} from '../../lib/permissions'
import type { UserRole } from '../../types'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: UserRole[]
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRoles }) => {
  const { activeRole, setActiveRole } = useTransport()
  const location = useLocation()

  const allowed = requiredRoles
    ? activeRole === 'admin' || requiredRoles.includes(activeRole)
    : canAccessRoute(activeRole, location.pathname)

  if (allowed) {
    return <>{children}</>
  }

  // Trouve les rôles acceptés pour cette page
  const matchingRule = ROUTE_PERMISSIONS.find((r) => r.pathPattern.test(location.pathname))
  const rolesExpected = requiredRoles || matchingRule?.allowedRoles || ['admin']

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900/90 border border-rose-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center mx-auto mb-4 text-rose-400">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
          Accès restreint
        </h1>

        <p className="text-sm text-slate-300 mb-4">
          Cette section nécessite des privilèges spécifiques non accordés à votre rôle actuel.
        </p>

        <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 mb-5 text-left text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-400">Votre rôle actif :</span>
            <span className="font-semibold text-amber-300">{getRoleLabel(activeRole)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Rôle(s) autorisé(s) :</span>
            <span className="font-semibold text-emerald-400">
              {rolesExpected.map((r) => getRoleLabel(r)).join(' ou ')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Page demandée :</span>
            <span className="font-mono text-slate-300 truncate max-w-[180px]">
              {location.pathname}
            </span>
          </div>
        </div>

        {/* Changement rapide de rôle en mode prototype */}
        <div className="mb-6 text-left">
          <p className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-blue-400" />
            Basculer de rôle (Environnement prototype) :
          </p>
          <div className="grid grid-cols-2 gap-2">
            {rolesExpected.map((role) => (
              <button
                key={role}
                onClick={() => setActiveRole(role)}
                className="px-3 py-2 text-xs font-medium rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 transition-all hover:scale-[1.02] text-center"
              >
                Passer en {getRoleLabel(role)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <Link
            to={getDefaultRouteForRole(activeRole)}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/20"
          >
            Retourner à mon espace
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/"
            className="w-full inline-flex items-center justify-center px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
          >
            Accueil Teranga Connect
          </Link>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed italic">
          ⚠️ {AUTH_PROTOTYPE_DISCLAIMER}
        </div>
      </div>
    </div>
  )
}
