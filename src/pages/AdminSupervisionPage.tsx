import React from 'react'
import { 
  ShieldAlert, 
  TrendingUp, 
  Truck, 
  Users, 
  Building2, 
  CreditCard, 
  CheckCircle2, 
  ArrowRight, 
  Percent
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTransport } from '../hooks/useTransport'
import { formatFcfa } from '../lib/missionUtils'
import type { Mission } from '../types'

export const AdminSupervisionPage: React.FC = () => {
  const { missions, opportunities, owner, driver, shipper } = useTransport()

  // Financial ledger aggregation
  const totalGrossFreight = missions.reduce(
    (sum: number, m: Mission) => sum + (m.estimatedAmountFcfa || 0), 
    0
  )

  const totalCommissionsEarned = missions.reduce((sum: number, m: Mission) => {
    return sum + (m.commissionAmountFcfa || (m.estimatedAmountFcfa * (m.tripType === 'return_cargo' ? 0.40 : 0.30)))
  }, 0)

  const totalFuelAdvancesDisbursed = missions.reduce((sum: number, m: Mission) => {
    return sum + (m.estimatedAmountFcfa * 0.12)
  }, 0)

  const totalCarrierPayouts = missions.reduce((sum: number, m: Mission) => {
    const rate = m.tripType === 'return_cargo' ? 0.60 : 0.70
    return sum + (m.estimatedAmountFcfa * rate)
  }, 0)

  const activeMissions = missions.filter(
    (m: Mission) => m.status === 'in_progress' || m.status === 'confirmed' || m.status === 'accepted'
  )
  const returnTripsCount = missions.filter((m: Mission) => m.tripType === 'return_cargo').length

  return (
    <div className="min-h-screen bg-[#070d1e] text-slate-100 p-4 sm:p-8 space-y-6">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider border border-purple-500/30">
              <ShieldAlert className="w-3.5 h-3.5" />
              Console de Supervision Plateforme & Administration
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Tour de Contrôle Opérationnelle & Financière
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
              Surveillance en direct des flux de transporteurs, chauffeurs et chargeurs, suivi du compte de séquestre, arbitrage des litiges et perception des commissions (30% aller / 40% retour).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Plateforme active
            </span>
          </div>
        </div>
      </div>

      {/* Global Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Volume Fret Transité</span>
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">{formatFcfa(totalGrossFreight)}</div>
          <div className="text-xs text-slate-400 mt-1">Montant brut sous séquestre</div>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Commissions Teranga</span>
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-purple-400">{formatFcfa(totalCommissionsEarned)}</div>
          <div className="text-xs text-slate-400 mt-1">30% Aller / 40% Fret Retour</div>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Avances Carburant Débloquées</span>
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-400">{formatFcfa(totalFuelAdvancesDisbursed)}</div>
          <div className="text-xs text-slate-400 mt-1">Bons numériques aux transporteurs (10-15%)</div>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Reversements Transporteurs</span>
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-400">{formatFcfa(totalCarrierPayouts)}</div>
          <div className="text-xs text-slate-400 mt-1">Soldes versés post-émargement POD</div>
        </div>
      </div>

      {/* Grid: Live Corridor Supervision & Ecosystem Actors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Missions Supervision */}
        <div className="lg:col-span-2 bg-slate-900/80 rounded-xl border border-slate-800 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Supervision des Corridors et Expéditions</h2>
              <p className="text-xs text-slate-400">Traçabilité complète des missions en transit</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {activeMissions.length} active(s) sur {missions.length} totale(s)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Code / Type</th>
                  <th className="py-3 px-4">Itinéraire</th>
                  <th className="py-3 px-4">Acteurs</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4">Montant & Commission</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {missions.map((mission: Mission) => {
                  const comm = mission.commissionAmountFcfa || (mission.estimatedAmountFcfa * (mission.tripType === 'return_cargo' ? 0.40 : 0.30))
                  return (
                    <tr key={mission.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-amber-400">{mission.missionCode}</div>
                        {mission.tripType === 'return_cargo' ? (
                          <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Fret Retour (40%)
                          </span>
                        ) : (
                          <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                            Aller Standard (30%)
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-white">{mission.origin} → {mission.destination}</div>
                        <div className="text-[10px] text-slate-400">Camion: {mission.truckMatricule}</div>
                      </td>
                      <td className="py-3.5 px-4 space-y-0.5">
                        <div className="text-white">
                          <span className="text-slate-400">Ch:</span> {mission.shipperName || 'Chargeur GMMS'}
                        </div>
                        <div className="text-slate-300">
                          <span className="text-slate-400">Tr:</span> {mission.ownerName}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${
                            mission.status === 'in_progress'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : mission.status === 'completed'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}
                        >
                          {mission.status === 'in_progress' ? 'En transit' : mission.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">{formatFcfa(mission.estimatedAmountFcfa)}</div>
                        <div className="text-[10px] text-purple-300 font-semibold">Comm: {formatFcfa(comm)}</div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to={`/missions/${mission.id}`}
                          className="font-semibold text-purple-400 hover:text-purple-300 inline-flex items-center gap-1"
                        >
                          Détails <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Ecosystem Verification & Platform Health */}
        <div className="space-y-6">
          <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white">État du Réseau Teranga Connect</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">{owner.companyName}</div>
                    <div className="text-[10px] text-slate-400">Flotte : {owner.truckCount || 2} camions déclarés</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                  Vérifié
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">{driver.fullName}</div>
                    <div className="text-[10px] text-slate-400">Permis Poids Lourd : {driver.licenseType}</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                  Actif
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">{shipper.companyName}</div>
                    <div className="text-[10px] text-slate-400">Chargeur & Donneur d'ordre vérifié</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                  Solvable
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>Opportunités ouvertes :</span>
                <span className="font-semibold text-white">{opportunities.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Taux de retour à vide capté :</span>
                <span className="font-semibold text-emerald-400">
                  {Math.round((returnTripsCount / (missions.length || 1)) * 100)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Abonnement mensuel transporteur :</span>
                <span className="font-semibold text-white">30 000 FCFA / camion</span>
              </div>
            </div>
          </div>

          {/* Model Rules & Business Reference Reminder */}
          <div className="bg-purple-950/40 rounded-xl p-5 border border-purple-500/30 text-xs space-y-3">
            <div className="font-bold text-purple-200 flex items-center gap-1.5">
              <Percent className="w-4 h-4 text-purple-400" />
              Règles Économiques Appliquées (Cahier des Charges)
            </div>
            <ul className="list-disc pl-4 space-y-1.5 text-purple-200/90">
              <li><strong>Trajet Aller :</strong> 30% commission prélevée sur le montant payé par le chargeur.</li>
              <li><strong>Fret Retour à vide :</strong> 40% commission incitative sur le fret capté en région.</li>
              <li><strong>Avance Carburant / Péages :</strong> 10% à 15% provisionnée en bon numérique pour démarrage immédiat.</li>
              <li><strong>Séquestre :</strong> Paiement chargeur bloqué jusqu'à livraison conforme et signature du bordereau.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
