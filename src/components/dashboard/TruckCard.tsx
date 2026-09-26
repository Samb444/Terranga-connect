import React from 'react'
import { Truck as TruckIcon, MapPin, Gauge, ShieldCheck, Clock } from 'lucide-react'
import type { Truck } from '../../types'
import { Card, CardHeader, CardContent } from '../ui/Card'
import { Badge } from '../ui/Badge'

interface TruckCardProps {
  truck: Truck
}

export const TruckCard: React.FC<TruckCardProps> = ({ truck }) => {
  const getStatusBadge = (status: Truck['status']) => {
    switch (status) {
      case 'available':
        return (
          <Badge variant="success" className="text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Disponible</span>
          </Badge>
        )
      case 'in_transit':
        return (
          <Badge variant="warning" className="text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>En mission</span>
          </Badge>
        )
      case 'maintenance':
        return (
          <Badge variant="default" className="text-xs text-slate-300">
            <span>En maintenance</span>
          </Badge>
        )
      default:
        return (
          <Badge variant="default" className="text-xs">
            <span>Hors ligne</span>
          </Badge>
        )
    }
  }

  return (
    <Card className="bg-slate-900/80 border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group">
      <div>
        <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <TruckIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base tracking-tight">
                  {truck.categoryLabel}
                </span>
              </div>
              <p className="text-xs text-slate-400">{truck.brandModel}</p>
            </div>
          </div>
          {getStatusBadge(truck.status)}
        </CardHeader>

        <CardContent className="space-y-3.5 pt-2">
          {/* Immatriculation fictive clairement notifiée */}
          <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Immatriculation</span>
            <span className="font-mono text-xs font-semibold text-amber-300 tracking-wider">
              {truck.matricule}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/40 border border-slate-800/60">
              <Gauge className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Capacité</span>
                <span className="font-semibold text-white">{truck.tonnageCapacity} tonnes</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/40 border border-slate-800/60">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="truncate">
                <span className="text-slate-400 block text-[10px] uppercase">Position</span>
                <span className="font-semibold text-white truncate block">{truck.currentCity}</span>
              </div>
            </div>
          </div>

          {/* Localisation simulée */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Mise à jour : {truck.lastLocationUpdate}</span>
          </div>
        </CardContent>
      </div>

      <div className="p-4 pt-3 mt-4 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 bg-slate-950/30 -mx-6 -mb-6 rounded-b-xl px-6">
        <span className="inline-flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Fiche certifiée (Démo)</span>
        </span>
        <Badge variant="amber" className="text-[10px] py-0 px-2">
          Démonstration
        </Badge>
      </div>
    </Card>
  )
}
