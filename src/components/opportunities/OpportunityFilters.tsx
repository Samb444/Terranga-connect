import React from 'react'
import { Search, Filter, RotateCcw } from 'lucide-react'
import { SENEGAL_CITIES, TRUCK_CATEGORIES } from '../../data/mockData'
import { Button } from '../ui/Button'

export interface FilterState {
  searchQuery: string
  origin: string
  destination: string
  truckCategory: string
  tripType: 'all' | 'outbound' | 'return'
}

interface OpportunityFiltersProps {
  filters: FilterState
  onFilterChange: (newFilters: FilterState) => void
  onReset: () => void
  totalCount: number
  filteredCount: number
}

export const OpportunityFilters: React.FC<OpportunityFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  totalCount,
  filteredCount,
}) => {
  const isFiltered =
    filters.searchQuery !== '' ||
    filters.origin !== '' ||
    filters.destination !== '' ||
    filters.truckCategory !== '' ||
    filters.tripType !== 'all'

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
      {/* Barre supérieure : Recherche texte & compteur */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Rechercher par marchandise, ville, ou mot-clé..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-700 bg-slate-950/80 text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
          />
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
          <span className="text-slate-400">
            Affichage de <strong className="text-white">{filteredCount}</strong> sur{' '}
            {totalCount} opportunités
          </span>

          {isFiltered && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-amber-400 hover:text-amber-300 text-xs py-1 px-2.5 h-auto"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              <span>Réinitialiser</span>
            </Button>
          )}
        </div>
      </div>

      {/* Ligne des sélecteurs de filtrage */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Origine */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
            Origine
          </label>
          <select
            value={filters.origin}
            onChange={(e) => onFilterChange({ ...filters, origin: e.target.value })}
            className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="">Toutes les origines</option>
            {SENEGAL_CITIES.map((city) => (
              <option key={`orig-${city}`} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Destination */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
            Destination
          </label>
          <select
            value={filters.destination}
            onChange={(e) => onFilterChange({ ...filters, destination: e.target.value })}
            className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="">Toutes les destinations</option>
            {SENEGAL_CITIES.map((city) => (
              <option key={`dest-${city}`} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Type de camion requis */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
            Type de camion
          </label>
          <select
            value={filters.truckCategory}
            onChange={(e) => onFilterChange({ ...filters, truckCategory: e.target.value })}
            className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="">Tous les types de camions</option>
            {TRUCK_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Type de trajet (Aller / Retour) */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
            Type d'opportunité
          </label>
          <select
            value={filters.tripType}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                tripType: e.target.value as FilterState['tripType'],
              })
            }
            className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="all">Toutes les opportunités</option>
            <option value="return">Retours à vide à optimiser</option>
            <option value="outbound">Trajets aller standards</option>
          </select>
        </div>
      </div>

      {/* Raccourcis rapides */}
      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
        <Filter className="w-3.5 h-3.5 text-amber-400" />
        <span className="text-[11px] uppercase tracking-wider font-medium">Filtres rapides :</span>
        <button
          type="button"
          onClick={() =>
            onFilterChange({
              ...filters,
              tripType: filters.tripType === 'return' ? 'all' : 'return',
            })
          }
          className={`px-2.5 py-1 rounded-full border text-xs cursor-pointer transition-colors ${
            filters.tripType === 'return'
              ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50 font-semibold'
              : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
          }`}
        >
          Retours à vide uniquement
        </button>

        <button
          type="button"
          onClick={() =>
            onFilterChange({
              ...filters,
              origin: filters.origin === 'Dakar' ? '' : 'Dakar',
            })
          }
          className={`px-2.5 py-1 rounded-full border text-xs cursor-pointer transition-colors ${
            filters.origin === 'Dakar'
              ? 'bg-amber-950 text-amber-300 border-amber-500/50 font-semibold'
              : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
          }`}
        >
          Départ de Dakar
        </button>

        <button
          type="button"
          onClick={() =>
            onFilterChange({
              ...filters,
              destination: filters.destination === 'Dakar' ? '' : 'Dakar',
            })
          }
          className={`px-2.5 py-1 rounded-full border text-xs cursor-pointer transition-colors ${
            filters.destination === 'Dakar'
              ? 'bg-amber-950 text-amber-300 border-amber-500/50 font-semibold'
              : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
          }`}
        >
          Arrivée à Dakar
        </button>
      </div>
    </div>
  )
}
