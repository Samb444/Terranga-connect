import React from 'react'
import { ArrowRight, MapPin, Truck, Calendar, CheckCircle2, Clock } from 'lucide-react'
import type { Trip } from '../../types'
import { Card, CardHeader, CardContent } from '../ui/Card'
import { Badge } from '../ui/Badge'

interface TripCardProps {
  trip: Trip
}

export const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  const getStatusBadge = (status: Trip['status']) => {
    switch (status) {
      case 'in_transit':
        return (
          <Badge variant="warning" className="text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            <span>En transit</span>
          </Badge>
        )
      case 'scheduled':
        return (
          <Badge variant="default" className="text-xs text-blue-300 border-blue-800/40 bg-blue-950/40">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>Planifié</span>
          </Badge>
        )
      case 'completed':
        return (
          <Badge variant="success" className="text-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Terminé</span>
          </Badge>
        )
    }
  }

  return (
    <Card className="bg-slate-900/80 border-slate-800 hover:border-slate-700 transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
            {trip.tripCode}
          </span>
          {trip.isReturnTrip && (
            <Badge variant="success" className="text-[10px] py-0.5 px-2 font-medium">
              Retour optimisé
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(trip.status)}
          <Badge variant="amber" className="text-[10px] py-0.5 px-2">
            Démo
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        {/* Trajet Origine -> Destination */}
        <div className="flex items-center gap-3 text-base sm:text-lg font-bold text-white">
          <div className="flex items-center gap-1.5 text-amber-400">
            <MapPin className="w-4 h-4" />
            <span>{trip.origin}</span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400" />
          <div className="flex items-center gap-1.5 text-emerald-400">
            <MapPin className="w-4 h-4" />
            <span>{trip.destination}</span>
          </div>
        </div>

        {/* Détails du fret et du camion */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-300">
          <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/80">
            <span className="text-slate-400 text-[10px] uppercase block">Cargaison</span>
            <span className="font-semibold text-white">{trip.cargo}</span>
            <span className="text-slate-400 ml-1">({trip.weightTons} tonnes)</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/80">
            <span className="text-slate-400 text-[10px] uppercase block">Camion &amp; Chauffeur</span>
            <div className="flex items-center gap-1.5 text-white font-medium truncate">
              <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{trip.truckMatricule}</span>
            </div>
            <span className="text-[11px] text-slate-400 truncate block mt-0.5">
              Cond. {trip.driverName}
            </span>
          </div>
        </div>

        {/* Date */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/60">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Départ : {trip.departureDate}</span>
          </div>
          <span>Arrivée est. : {trip.estimatedArrival}</span>
        </div>
      </CardContent>
    </Card>
  )
}
