import React from 'react'
import {
  Edit3,
  ShieldCheck,
  Building2,
  Calendar,
  ArrowRightLeft,
  Truck,
  User,
} from 'lucide-react'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import type { Owner, Driver } from '../../types'
import { cn } from '../../lib/utils'

interface ProfileHeaderProps {
  role: 'truck_owner' | 'driver'
  owner: Owner
  driver: Driver
  onEditClick: () => void
  onToggleRole: () => void
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  role,
  owner,
  driver,
  onEditClick,
  onToggleRole,
}) => {
  const isOwner = role === 'truck_owner'
  const currentName = isOwner ? owner.fullName : driver.fullName
  const initials = isOwner ? 'MD' : 'IN'
  const memberSince = isOwner
    ? owner.memberSince || '15 Janvier 2026 [Démonstration]'
    : driver.memberSince || '02 Février 2026 [Démonstration]'

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        {/* Avatar & Identité */}
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Avatar avec initiales et bordure thématique */}
          <div
            className={cn(
              'w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center font-extrabold text-2xl sm:text-3xl border shadow-xl relative shrink-0',
              isOwner
                ? 'bg-gradient-to-tr from-amber-600/30 to-amber-500/10 text-amber-300 border-amber-500/40 shadow-amber-950/30'
                : 'bg-gradient-to-tr from-emerald-600/30 to-emerald-500/10 text-emerald-300 border-emerald-500/40 shadow-emerald-950/30'
            )}
          >
            {initials}
            <div
              className={cn(
                'absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-lg flex items-center justify-center border',
                isOwner
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-emerald-500 text-slate-950 border-emerald-400'
              )}
            >
              {isOwner ? <Truck className="w-3.5 h-3.5 stroke-[2.5]" /> : <User className="w-3.5 h-3.5 stroke-[2.5]" />}
            </div>
          </div>

          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {currentName}
              </h1>
              <Badge
                variant={isOwner ? 'amber' : 'success'}
                className="text-xs py-0.5 px-2.5 font-bold"
              >
                {isOwner ? 'Propriétaire de flotte' : 'Chauffeur Poids Lourd'}
              </Badge>
              <Badge variant="outline" className="text-[10px] text-amber-400 border-amber-500/30">
                Profil Démonstratif
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
              {isOwner && (
                <span className="flex items-center gap-1 text-slate-300 font-medium">
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>{owner.companyName}</span>
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Inscrit le {memberSince}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={onToggleRole}
            className="text-xs"
            title="Basculer vers l'autre profil démo"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
            <span>Voir profil {isOwner ? 'Chauffeur' : 'Propriétaire'}</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onEditClick}
            className="text-xs shadow-amber-950/20"
          >
            <Edit3 className="w-3.5 h-3.5 mr-1.5" />
            <span>Modifier mon profil</span>
          </Button>
        </div>
      </div>

      {/* Avertissement Démonstration & Données Fictives */}
      <div className="rounded-xl p-3.5 bg-slate-950/60 border border-slate-800 flex items-start gap-3 text-xs text-slate-400">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-semibold text-slate-200 mr-1.5">
            Données strictement démonstratives :
          </span>
          Ce profil représente un utilisateur type pour l'évaluation de Teranga Connect. Toutes les
          coordonnées sont fictives et anonymisées.
        </div>
      </div>
    </div>
  )
}
