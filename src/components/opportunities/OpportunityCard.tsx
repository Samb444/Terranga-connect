import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, Truck, Calendar, PackageCheck, RotateCcw } from 'lucide-react'
import type { Opportunity } from '../../types'
import { Card, CardHeader, CardContent } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { useTransport } from '../../hooks/useTransport'

interface OpportunityCardProps {
  opportunity: Opportunity
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity }) => {
  const { isInterested } = useTransport()
  const interested = isInterested(opportunity.id)

  return (
    <Card className="bg-slate-900/80 border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group shadow-lg">
      <div>
        {/* En-tête de carte */}
        <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            {opportunity.isReturnTrip ? (
              <Badge variant="success" className="text-xs font-semibold py-0.5 px-2.5">
                <RotateCcw className="w-3 h-3" />
                <span>Opportunité de retour</span>
              </Badge>
            ) : (
              <Badge variant="default" className="text-xs font-medium py-0.5 px-2.5 text-slate-300">
                <span>Trajet aller</span>
              </Badge>
            )}

            {interested && (
              <Badge variant="amber" className="text-[11px] py-0.5 px-2 bg-amber-500/20 text-amber-300 border-amber-500/30">
                Intérêt manifesté
              </Badge>
            )}
          </div>

          <Badge variant="amber" className="text-[10px] py-0.5 px-2 shrink-0">
            {opportunity.badgeNotice}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-4 pt-1">
          {/* Corridor Origine -> Destination */}
          <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
            <div className="flex items-center gap-1 text-slate-100">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{opportunity.origin}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="flex items-center gap-1 text-slate-100">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{opportunity.destination}</span>
            </div>
          </div>

          {/* Type de marchandise */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <PackageCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="uppercase text-[10px] tracking-wider font-semibold">Marchandise</span>
            </div>
            <p className="text-sm font-medium text-white line-clamp-1">
              {opportunity.cargoType}
            </p>
          </div>

          {/* Grille spécifications camion et poids */}
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-2 rounded-lg bg-slate-950/40 border border-slate-800/60">
              <span className="text-slate-400 text-[10px] uppercase block">Type requis</span>
              <div className="flex items-center gap-1 mt-0.5 text-slate-200 font-semibold truncate">
                <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{opportunity.truckCategoryLabel}</span>
              </div>
            </div>

            <div className="p-2 rounded-lg bg-slate-950/40 border border-slate-800/60">
              <span className="text-slate-400 text-[10px] uppercase block">Capacité / Poids</span>
              <span className="font-semibold text-white block mt-0.5">
                {opportunity.weightTons} tonnes
              </span>
            </div>
          </div>

          {/* Date indicative */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Départ : {opportunity.departureDate}</span>
          </div>
        </CardContent>
      </div>

      {/* Pied de carte avec CTA vers les détails */}
      <div className="p-5 pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between gap-3 bg-slate-950/30 -mx-6 -mb-6 rounded-b-xl px-6">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-medium">
            Tarif indicatif
          </span>
          <span className="text-xs font-semibold text-emerald-400">
            {opportunity.estimatedPrice || 'À négocier'}
          </span>
        </div>

        <Link to={`/opportunites/${opportunity.id}`}>
          <Button variant="outline" size="sm" className="group-hover:border-amber-500/50">
            <span>Voir les détails</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </Link>
      </div>
    </Card>
  )
}
