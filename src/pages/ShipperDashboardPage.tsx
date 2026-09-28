import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Building2, 
  Plus, 
  Package, 
  Truck, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight, 
  MapPin, 
  Clock, 
  CheckCircle2
} from 'lucide-react'
import { useTransport } from '../hooks/useTransport'
import { PublishOpportunityModal } from '../components/forms/PublishOpportunityModal'
import { formatFcfa } from '../lib/missionUtils'
import type { Mission, Opportunity } from '../types'

export const ShipperDashboardPage: React.FC = () => {
  const { shipper, opportunities, missions } = useTransport()
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false)

  // Opportunities and missions related to this shipper
  const shipperOpportunities: Opportunity[] = opportunities.filter(
    (o: Opportunity) => o.publishedBy === shipper.companyName || o.publishedBy === shipper.fullName
  )
  
  const shipperMissions: Mission[] = missions.filter(
    (m: Mission) => m.shipperId === shipper.id || m.shipperName === shipper.companyName
  )

  const activeMissionsCount = shipperMissions.filter(
    (m: Mission) => m.status === 'in_progress' || m.status === 'confirmed' || m.status === 'accepted'
  ).length

  const completedMissionsCount = shipperMissions.filter(
    (m: Mission) => m.status === 'completed'
  ).length

  const totalEscrowDeposited = shipperMissions.reduce(
    (sum: number, m: Mission) => sum + (m.estimatedAmountFcfa || 0), 
    0
  )

  return (
    <div className="min-h-screen bg-[#070d1e] text-slate-100 p-4 sm:p-8 space-y-6">
      {/* Shipper Header Banner */}
      <div className="bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold uppercase tracking-wider border border-sky-500/30">
              <Building2 className="w-3.5 h-3.5" />
              Espace Chargeur & Donneur d'Ordre
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {shipper.companyName}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
              Publiez vos besoins de fret, bénéficiez de notre garantie séquestre, et optimisez vos tarifs grâce à l'affrètement de retours à vide vers Dakar et les corridors régionaux.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsPublishModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm transition-all shadow-lg shadow-sky-500/25 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Publier un fret
            </button>
            <Link
              to="/opportunites"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors border border-slate-700"
            >
              Toutes les opportunités
            </Link>
          </div>
        </div>

        {/* Escrow Guarantee Highlight */}
        <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4" />
            Séquestre garanti Teranga Connect
          </div>
          <span className="hidden sm:inline text-slate-600">•</span>
          <div>Paiement bloqué jusqu'à livraison émargée et vérifiée</div>
          <span className="hidden sm:inline text-slate-600">•</span>
          <div>Traçabilité en temps réel du départ au déchargement</div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Frets Publiés</span>
            <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">{shipperOpportunities.length}</div>
          <div className="text-xs text-slate-400 mt-1">Offres ouvertes sur la plateforme</div>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Missions en cours</span>
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-400">{activeMissionsCount}</div>
          <div className="text-xs text-slate-400 mt-1">Camions en transit / chargement</div>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Livraisons Réussies</span>
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-400">{completedMissionsCount}</div>
          <div className="text-xs text-slate-400 mt-1">Bordereaux émargés conformes</div>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Fonds Sécurisés</span>
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-indigo-300">{formatFcfa(totalEscrowDeposited)}</div>
          <div className="text-xs text-slate-400 mt-1">En compte séquestre partenaire</div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Live Missions Tracking (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/80 rounded-xl border border-slate-800 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Suivi Opérationnel de vos Expéditions</h2>
                <p className="text-xs text-slate-400">Missions attribuées à un transporteur et suivies par Teranga Connect</p>
              </div>
              <Link
                to="/missions"
                className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
              >
                Toutes les missions <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {shipperMissions.length === 0 ? (
              <div className="p-10 text-center">
                <Truck className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-slate-300">Aucune expédition active pour le moment</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                  Publiez une demande de fret pour recevoir des propositions de transporteurs qualifiés.
                </p>
                <button
                  type="button"
                  onClick={() => setIsPublishModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-600 text-white text-xs font-medium hover:bg-sky-500 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Publier une demande
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-800">
                {shipperMissions.map((mission: Mission) => {
                  const statusColors: Record<string, string> = {
                    in_progress: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
                    confirmed: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
                    accepted: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
                    completed: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
                    cancelled: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
                  }

                  return (
                    <div key={mission.id} className="p-5 hover:bg-slate-800/40 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            {mission.missionCode}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                              statusColors[mission.status] || 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}
                          >
                            {mission.status === 'in_progress' ? 'En transit' : mission.status}
                          </span>
                          {mission.tripType === 'return_cargo' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              Retour optimisé
                            </span>
                          )}
                        </div>
                        <div className="text-sm font-bold text-white">
                          {formatFcfa(mission.estimatedAmountFcfa)}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>
                            <strong>Trajet :</strong> {mission.origin} → {mission.destination}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Truck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>
                            <strong>Transporteur :</strong> {mission.ownerName} ({mission.truckMatricule})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          Chauffeur : {mission.driverName}
                        </div>
                        <Link
                          to={`/missions/${mission.id}`}
                          className="font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
                        >
                          Détails & Suivi direct <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Active Freight Offers Published by Shipper */}
          <div className="bg-slate-900/80 rounded-xl border border-slate-800 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Vos Demandes de Fret Ouvertes</h2>
                <p className="text-xs text-slate-400">Offres publiées en attente de transporteur</p>
              </div>
              <button
                type="button"
                onClick={() => setIsPublishModalOpen(true)}
                className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Nouvelle demande
              </button>
            </div>

            {shipperOpportunities.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                Vous n'avez pas de demande de fret ouverte actuellement.
              </div>
            ) : (
              <div className="divide-y divide-slate-800">
                {shipperOpportunities.map((opp: Opportunity) => (
                  <div key={opp.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-sm">{opp.title}</span>
                        {opp.isReturnTrip && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Fret Retour
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-400" />
                          {opp.origin} → {opp.destination}
                        </span>
                        <span>•</span>
                        <span>{opp.weightTons} tonnes ({opp.cargoType})</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div className="text-right">
                        <div className="text-sm font-bold text-white">{opp.estimatedPrice}</div>
                        <div className="text-[10px] text-slate-400">Budget pré-bloqué</div>
                      </div>
                      <Link
                        to={`/opportunites/${opp.id}`}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors border border-slate-700"
                      >
                        Consulter
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Escrow Mechanism & Shipper Security Card */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-xl p-5 text-white shadow-md border border-slate-800">
            <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" />
              Sécurité des Fonds & Règlements
            </div>
            <h3 className="text-base font-bold mb-2">Le Mécanisme Séquestre Teranga</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Pour protéger les chargeurs et éliminer les risques de non-livraison ou d'avaries non résolues, Teranga Connect bloque les fonds à la commande :
            </p>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5 bg-white/5 p-3 rounded-lg border border-white/10">
                <div className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                  1
                </div>
                <div>
                  <span className="font-semibold text-white">Pré-paiement Sécurisé :</span> Le montant du transport est consigné sur compte séquestre partenaire agréé.
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-white/5 p-3 rounded-lg border border-white/10">
                <div className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                  2
                </div>
                <div>
                  <span className="font-semibold text-white">Bon Carburant / Péages :</span> Avance contrôlée de 10 à 15% versée sous forme de bon numérique au transporteur pour débuter la mission.
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-white/5 p-3 rounded-lg border border-white/10">
                <div className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                  3
                </div>
                <div>
                  <span className="font-semibold text-white">Validation du Bordereau :</span> Le solde net n'est débloqué via Wave / Orange Money qu'après validation du bon de livraison émargé (POD).
                </div>
              </div>
            </div>
          </div>

          {/* Quick Shipper Profile Info */}
          <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white">Coordonnées du Compte Chargeur</h3>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Entreprise :</span>
                <span className="font-medium text-slate-200">{shipper.companyName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Contact référent :</span>
                <span className="font-medium text-slate-200">{shipper.fullName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Téléphone / WhatsApp :</span>
                <span className="font-medium text-slate-200">{shipper.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Secteur :</span>
                <span className="font-medium text-slate-200">{shipper.companyType || 'Agroalimentaire & BTP'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Zone d'expédition :</span>
                <span className="font-medium text-slate-200">{shipper.city || 'Port Autonome de Dakar'}</span>
              </div>
            </div>

            <Link
              to="/profil"
              className="block w-full text-center py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700"
            >
              Modifier les informations chargeur
            </Link>
          </div>
        </div>
      </div>

      {/* Publish Opportunity Modal */}
      <PublishOpportunityModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
      />
    </div>
  )
}
