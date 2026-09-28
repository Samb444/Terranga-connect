import React, { useState } from 'react'
import {
  ShieldAlert,
  TrendingUp,
  Truck,
  Users,
  Building2,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  Percent,
  Clock,
  Fuel,
  UserCheck,
  DollarSign,
  Plus,
  ExternalLink,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTransport } from '../hooks/useTransport'
import { formatFcfa } from '../lib/financeUtils'
import type { Mission, BusinessIntroducer } from '../types'

export const AdminSupervisionPage: React.FC = () => {
  const {
    missions,
    opportunities,
    owner,
    driver,
    shipper,
    settlements,
    subscriptions,
    fuelVouchers,
    businessIntroducers,
    payments,
    releaseTransporterSettlement,
    toggleIntroducerStatus,
    addBusinessIntroducer,
  } = useTransport()

  const [activeTab, setActiveTab] = useState<
    'overview' | 'settlements' | 'subscriptions' | 'vouchers' | 'introducers' | 'payments'
  >('overview')

  const [isAddIntroducerOpen, setIsAddIntroducerOpen] = useState(false)
  const [newIntroducerName, setNewIntroducerName] = useState('')
  const [newIntroducerPhone, setNewIntroducerPhone] = useState('')
  const [newIntroducerZone, setNewIntroducerZone] = useState('Dakar — Port Autonome')
  const [adminFeedback, setAdminFeedback] = useState<string | null>(null)

  // 1. KPI Activité
  const totalMissions = missions.length
  const inProgressMissions = missions.filter((m) => m.status === 'in_progress').length
  const completedMissions = missions.filter((m) => m.status === 'completed').length
  const cancelledMissions = missions.filter((m) => m.status === 'cancelled').length

  // 2. KPI Finances
  const totalGrossFreight = settlements.reduce((sum, s) => sum + s.grossAmount, 0) ||
    missions.reduce((sum, m) => sum + (m.estimatedAmountFcfa || 0), 0)

  const totalCommissionsEarned = settlements.reduce((sum, s) => sum + s.commissionAmount, 0) ||
    missions.reduce((sum, m) => {
      return sum + (m.commissionAmountFcfa || (m.estimatedAmountFcfa * (m.tripType === 'return_cargo' ? 0.40 : 0.30)))
    }, 0)

  const totalFuelAdvancesDisbursed = settlements.reduce((sum, s) => sum + s.advanceAmount, 0) ||
    missions.reduce((sum, m) => sum + (m.estimatedAmountFcfa * 0.10), 0)

  const totalCarrierPayouts = settlements.reduce(
    (sum, s) => (s.status === 'settled' ? sum + s.remainingBalance : sum),
    0
  )

  const pendingSettlementsCount = settlements.filter(
    (s) => s.status === 'settlement_pending'
  ).length

  // 3. KPI Abonnements (30 000 FCFA/mois)
  const activeSubs = subscriptions.filter((s) => s.status === 'active')
  const expiredSubs = subscriptions.filter((s) => s.status === 'expired')
  const pendingSubs = subscriptions.filter((s) => s.status === 'pending')

  // 4. KPI Paiements
  const pendingPayments = payments.filter((p) => p.status === 'pending')
  const successfulPayments = payments.filter((p) => p.status === 'successful')
  const failedPayments = payments.filter((p) => p.status === 'failed')

  // 5. KPI Bons Carburant
  const issuedVouchers = fuelVouchers.filter((v) => v.status === 'issued')
  const usedVouchers = fuelVouchers.filter((v) => v.status === 'used')
  const cancelledVouchers = fuelVouchers.filter((v) => v.status === 'cancelled')

  // 6. KPI Apporteurs d'affaires / Coxeurs
  const activeIntroducers = businessIntroducers.filter((i) => i.status === 'active')
  const suspendedIntroducers = businessIntroducers.filter((i) => i.status === 'suspended')

  const handleReleaseSettlement = async (settlementId: string) => {
    try {
      await releaseTransporterSettlement(settlementId)
      setAdminFeedback('Règlement débloqué et clôturé avec succès ! Le solde est versé au transporteur.')
    } catch (e) {
      setAdminFeedback(e instanceof Error ? e.message : 'Erreur lors du déblocage du règlement.')
    }
  }

  const handleCreateIntroducer = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newIntroducerName || !newIntroducerPhone) return

    addBusinessIntroducer({
      name: newIntroducerName,
      phone: newIntroducerPhone,
      city: newIntroducerZone,
      notes: 'Enregistré via console admin',
    })

    setNewIntroducerName('')
    setNewIntroducerPhone('')
    setIsAddIntroducerOpen(false)
    setAdminFeedback('Nouvel apporteur d’affaires enregistré (Règles de commission à définir).')
  }

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
              Surveillance en direct des missions, abonnements 30 000 FCFA/mois, séquestres, avances carburant (10–15 %), commissions (30 % aller / 40 % retour) et apporteurs d’affaires.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Plateforme active
            </span>
            <Link
              to="/missions"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors inline-flex items-center gap-1"
            >
              <span>Voir missions</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bannière de feedback admin */}
      {adminFeedback && (
        <div className="p-4 rounded-xl bg-purple-950/70 border border-purple-500/40 text-purple-200 flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
            <span>{adminFeedback}</span>
          </div>
          <button
            type="button"
            onClick={() => setAdminFeedback(null)}
            className="text-xs text-purple-300 hover:text-white underline font-semibold"
          >
            Fermer
          </button>
        </div>
      )}

      {/* Navigation des Onglets Admin */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
              : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Vue d’ensemble & Activité</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settlements')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 relative ${
            activeTab === 'settlements'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
              : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Finances & Règlements ({settlements.length})</span>
          {pendingSettlementsCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse ml-1" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('subscriptions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'subscriptions'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
              : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Abonnements 30 000 FCFA ({subscriptions.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('vouchers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'vouchers'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
              : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Fuel className="w-3.5 h-3.5" />
          <span>Bons Carburant ({fuelVouchers.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('introducers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'introducers'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
              : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Apporteurs d'affaires / Coxeurs ({businessIntroducers.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'payments'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
              : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Journal Paiements ({payments.length})</span>
        </button>
      </div>

      {/* ===================== TAB 1 : VUE D'ENSEMBLE ===================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Métriques Activité */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Total Missions
              </span>
              <div className="text-2xl font-bold text-white mt-1">{totalMissions}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Enregistrées sur la plateforme</div>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 block">
                Missions En Cours
              </span>
              <div className="text-2xl font-bold text-amber-300 mt-1">{inProgressMissions}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">En transit sur corridor</div>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 block">
                Missions Livrées
              </span>
              <div className="text-2xl font-bold text-emerald-300 mt-1">{completedMissions}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Émargées avec POD conforme</div>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-400 block">
                Missions Annulées
              </span>
              <div className="text-2xl font-bold text-rose-300 mt-1">{cancelledMissions}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Clôturées sans exécution</div>
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
                <span className="text-xs font-semibold uppercase tracking-wider">Avances Décaissées</span>
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                  <CreditCard className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-amber-400">{formatFcfa(totalFuelAdvancesDisbursed)}</div>
              <div className="text-xs text-slate-400 mt-1">Bons carburant (10–15%)</div>
            </div>

            <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Reversements Soldés</span>
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
            <div className="lg:col-span-2 bg-slate-900/80 rounded-xl border border-slate-800 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white">Supervision des Corridors et Expéditions</h2>
                  <p className="text-xs text-slate-400">Traçabilité complète des missions en transit</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {inProgressMissions} en transit sur {totalMissions}
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
                      const isReturn = mission.tripType === 'return_cargo'
                      const rate = isReturn ? 0.40 : 0.30
                      const comm = mission.commissionAmountFcfa || (mission.estimatedAmountFcfa * rate)
                      return (
                        <tr key={mission.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-mono font-bold text-amber-400">{mission.missionCode}</div>
                            {isReturn ? (
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

            {/* Colonne Droite : Écosystème & Règles */}
            <div className="space-y-6">
              <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-white">Acteurs Clés du Réseau</h3>

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
                    <span>Abonnements actifs (30k FCFA) :</span>
                    <span className="font-semibold text-emerald-400">{activeSubs.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Règlements en attente de solde :</span>
                    <span className="font-semibold text-amber-400">{pendingSettlementsCount}</span>
                  </div>
                </div>
              </div>

              {/* Règles Métier Canoniques */}
              <div className="bg-purple-950/40 rounded-xl p-5 border border-purple-500/30 text-xs space-y-3">
                <div className="font-bold text-purple-200 flex items-center gap-1.5">
                  <Percent className="w-4 h-4 text-purple-400" />
                  Règles Économiques Teranga Connect (Cahier des Charges)
                </div>
                <ul className="list-disc pl-4 space-y-1.5 text-purple-200/90 text-[11px]">
                  <li><strong>Aller standard :</strong> 30% commission Teranga Connect.</li>
                  <li><strong>Retour à vide :</strong> 40% commission incitative sur le fret capté.</li>
                  <li><strong>Avance paramétrable :</strong> 10% à 15% (défaut 10%) en bon numérique.</li>
                  <li><strong>Séquestre :</strong> Fonds consignés avant chargement, solde libéré après POD.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 2 : FINANCES & RÈGLEMENTS ===================== */}
      {activeTab === 'settlements' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-5 shadow-sm space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Supervision Financière & Cycle des Règlements (Settlements)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Conformément au cahier des charges, le statut financier « soldé » n'est jamais automatique lors de la livraison opérationnelle. Il nécessite une validation financière explicite.
            </p>
          </div>

          <div className="bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Réf. Règlement</th>
                    <th className="py-3 px-4">Montant Brut</th>
                    <th className="py-3 px-4">Commission Teranga</th>
                    <th className="py-3 px-4">Avance (10-15%)</th>
                    <th className="py-3 px-4">Solde Transporteur</th>
                    <th className="py-3 px-4">Statut Financier</th>
                    <th className="py-3 px-4 text-right">Action Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {settlements.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-white">{s.id}</div>
                        <div className="text-[10px] text-slate-500">Mission: {s.missionId}</div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white">{formatFcfa(s.grossAmount)}</td>
                      <td className="py-3.5 px-4 text-purple-300 font-semibold">{formatFcfa(s.commissionAmount)}</td>
                      <td className="py-3.5 px-4 text-amber-300">
                        {formatFcfa(s.advanceAmount)}
                        <span className="text-[10px] text-slate-500 ml-1">({s.advancePercent}%)</span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-400">
                        {formatFcfa(s.remainingBalance)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            s.status === 'settled'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : s.status === 'settlement_pending'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse'
                              : s.status === 'funded'
                              ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          {s.status === 'settled'
                            ? 'Soldé / Clôturé'
                            : s.status === 'settlement_pending'
                            ? 'En attente déblocage'
                            : s.status === 'advance_paid'
                            ? 'Avance versée'
                            : s.status === 'funded'
                            ? 'Séquestre approvisionné'
                            : s.status === 'delivery_confirmed'
                            ? 'Livraison confirmée'
                            : 'En attente'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {s.status === 'settlement_pending' ? (
                          <button
                            type="button"
                            onClick={() => handleReleaseSettlement(s.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors shadow-sm cursor-pointer"
                          >
                            Débloquer le solde
                          </button>
                        ) : (
                          <span className="text-slate-500 text-[11px]">
                            {s.status === 'settled' ? 'Règlement finalisé' : 'En cours'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 3 : ABONNEMENTS ===================== */}
      {activeTab === 'subscriptions' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 block">
                Abonnements Actifs
              </span>
              <div className="text-2xl font-bold text-white mt-1">{activeSubs.length}</div>
              <div className="text-xs text-slate-400 mt-1">30 000 FCFA / mois / camion</div>
            </div>

            <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-400 block">
                Abonnements Expirés
              </span>
              <div className="text-2xl font-bold text-white mt-1">{expiredSubs.length}</div>
              <div className="text-xs text-slate-400 mt-1">Renouvellement requis</div>
            </div>

            <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 block">
                En Attente / Résiliés
              </span>
              <div className="text-2xl font-bold text-white mt-1">{pendingSubs.length}</div>
              <div className="text-xs text-slate-400 mt-1">Validation de paiement</div>
            </div>
          </div>

          <div className="bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Registre des Abonnements Professionnels</h3>
              <Link
                to="/abonnement"
                className="text-xs text-amber-400 hover:text-white underline font-medium"
              >
                Page d'abonnement utilisateur
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Utilisateur / Camion</th>
                    <th className="py-3 px-4">Formule</th>
                    <th className="py-3 px-4">Montant</th>
                    <th className="py-3 px-4">Validité</th>
                    <th className="py-3 px-4">Statut</th>
                    <th className="py-3 px-4">Passerelle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {subscriptions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">{sub.userId}</div>
                        <div className="text-[10px] text-amber-400 font-mono">{sub.truckMatricule}</div>
                      </td>
                      <td className="py-3.5 px-4">{sub.plan}</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-400">{formatFcfa(sub.amount)}</td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {sub.startedAt ? `${sub.startedAt} → ${sub.expiresAt}` : 'En attente'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                            sub.status === 'active'
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                              : sub.status === 'expired'
                              ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                              : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          }`}
                        >
                          {sub.status === 'active'
                            ? 'Actif'
                            : sub.status === 'expired'
                            ? 'Expiré'
                            : sub.status === 'pending'
                            ? 'En attente'
                            : 'Résilié'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">{sub.paymentProvider}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 4 : BONS CARBURANT ===================== */}
      {activeTab === 'vouchers' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
            <span className="font-bold text-amber-300">
              ⚠️ Bon carburant numérique simulé — intégration fournisseur à venir :
            </span>{' '}
            Ces bons débloquent l'avance de 10% à 15% pour le carburant et les péages. Les partenariats en cours de modélisation ciblent les réseaux TotalEnergies, Elton Oil, Shell/Vivo Energy et Oryx Energies.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-xs font-semibold uppercase text-amber-400 block">Bons Émis</span>
              <div className="text-2xl font-bold text-white mt-1">{issuedVouchers.length}</div>
              <div className="text-[10px] text-slate-500">Prêts pour utilisation</div>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-xs font-semibold uppercase text-emerald-400 block">Bons Consommés</span>
              <div className="text-2xl font-bold text-white mt-1">{usedVouchers.length}</div>
              <div className="text-[10px] text-slate-500">Scannés en station</div>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-xs font-semibold uppercase text-rose-400 block">Bons Annulés</span>
              <div className="text-2xl font-bold text-white mt-1">{cancelledVouchers.length}</div>
              <div className="text-[10px] text-slate-500">Missions non démarrées</div>
            </div>
          </div>

          <div className="bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Référence</th>
                    <th className="py-3 px-4">Mission</th>
                    <th className="py-3 px-4">Fournisseur Réseau</th>
                    <th className="py-3 px-4">Montant Avance</th>
                    <th className="py-3 px-4">Statut</th>
                    <th className="py-3 px-4">Émis le</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {fuelVouchers.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-400">{v.reference}</td>
                      <td className="py-3.5 px-4">{v.missionId}</td>
                      <td className="py-3.5 px-4">{v.provider}</td>
                      <td className="py-3.5 px-4 font-bold text-white">{formatFcfa(v.amount)}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            v.status === 'used'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : v.status === 'issued'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          }`}
                        >
                          {v.status === 'used' ? 'Consommé' : v.status === 'issued' ? 'Disponible' : 'Annulé'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">{v.issuedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 5 : APPORTEURS D'AFFAIRES (COXURS) ===================== */}
      {activeTab === 'introducers' && (
        <div className="space-y-6">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <span className="font-bold text-amber-300 text-sm block">
                Règles de commission à définir — Intermédiaires & Coxeurs
              </span>
              <p className="text-xs text-amber-200/90 leading-relaxed max-w-3xl">
                Conformément aux directives de conception, le mode d’authentification, la commission exacte, le partage de commission et le cadre juridique des coxeurs restent en phase exploratoire. Aucune règle commerciale définitive n'est imposée arbitrairement.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddIntroducerOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5 shrink-0 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter un apporteur</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-xs font-semibold uppercase text-emerald-400 block">Apporteurs Actifs</span>
              <div className="text-2xl font-bold text-white mt-1">{activeIntroducers.length}</div>
            </div>
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-xs font-semibold uppercase text-rose-400 block">Apporteurs Suspendus</span>
              <div className="text-2xl font-bold text-white mt-1">{suspendedIntroducers.length}</div>
            </div>
          </div>

          {/* Modal / Formulaire d'ajout */}
          {isAddIntroducerOpen && (
            <form
              onSubmit={handleCreateIntroducer}
              className="bg-slate-900 border border-amber-500/40 rounded-2xl p-5 space-y-4 shadow-xl"
            >
              <h3 className="text-sm font-bold text-white">Enregistrer un nouvel apporteur d'affaires (Coxeur)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Nom complet ou pseudonyme</label>
                  <input
                    type="text"
                    required
                    value={newIntroducerName}
                    onChange={(e) => setNewIntroducerName(e.target.value)}
                    placeholder="Ex: Modou Fall (Gare Routière)"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Téléphone mobile</label>
                  <input
                    type="tel"
                    required
                    value={newIntroducerPhone}
                    onChange={(e) => setNewIntroducerPhone(e.target.value)}
                    placeholder="+221 77 *** ** **"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Zone d'influence</label>
                  <input
                    type="text"
                    value={newIntroducerZone}
                    onChange={(e) => setNewIntroducerZone(e.target.value)}
                    placeholder="Ex: Dakar — Thiaroye"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddIntroducerOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          )}

          <div className="bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Nom / Contact</th>
                    <th className="py-3 px-4">Zone</th>
                    <th className="py-3 px-4">Missions Apportées</th>
                    <th className="py-3 px-4">Règle Commission</th>
                    <th className="py-3 px-4">Statut</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {businessIntroducers.map((intro: BusinessIntroducer) => (
                    <tr key={intro.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">{intro.name}</div>
                        <div className="text-[10px] text-slate-400">{intro.phone}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">{intro.city || 'Générale'}</td>
                      <td className="py-3.5 px-4 font-bold text-amber-400">
                        {intro.introducedMissions} mission(s)
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                          Règles de commission à définir
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            intro.status === 'active'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          }`}
                        >
                          {intro.status === 'active' ? 'Actif' : 'Suspendu'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            toggleIntroducerStatus(
                              intro.id,
                              intro.status === 'active' ? 'suspended' : 'active'
                            )
                          }
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors cursor-pointer"
                        >
                          {intro.status === 'active' ? 'Suspendre' : 'Activer'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 6 : JOURNAL DES PAIEMENTS ===================== */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-xs font-semibold uppercase text-emerald-400 block">Paiements Réussis</span>
              <div className="text-2xl font-bold text-white mt-1">{successfulPayments.length}</div>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-xs font-semibold uppercase text-amber-400 block">En Attente</span>
              <div className="text-2xl font-bold text-white mt-1">{pendingPayments.length}</div>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-xs font-semibold uppercase text-rose-400 block">Échoués</span>
              <div className="text-2xl font-bold text-white mt-1">{failedPayments.length}</div>
            </div>
          </div>

          <div className="bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Journal d'Audit Financier des Transactions</h3>
              <p className="text-[11px] text-slate-400">
                Traçabilité des flux pré-payés, souscriptions et règlements débloqués.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Référence</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Montant</th>
                    <th className="py-3 px-4">Passerelle</th>
                    <th className="py-3 px-4">Statut</th>
                    <th className="py-3 px-4">Horodatage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-white">{p.reference}</td>
                      <td className="py-3.5 px-4 capitalize">{p.type}</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-400">{formatFcfa(p.amount)}</td>
                      <td className="py-3.5 px-4 text-slate-400">{p.provider}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            p.status === 'successful'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : p.status === 'pending'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">{p.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
