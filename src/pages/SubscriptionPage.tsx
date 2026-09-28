import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Fuel,
  Sparkles,
  RefreshCw,
  Clock,
  History,
  Info,
  Calendar,
  Truck as TruckIcon,
  ArrowLeft,
} from 'lucide-react'
import { useTransport } from '../hooks/useTransport'
import { Header } from '../layouts/Header'
import { Footer } from '../layouts/Footer'
import { DiscoveryModal } from '../components/modals/DiscoveryModal'
import { MONTHLY_SUBSCRIPTION_AMOUNT, formatFcfa } from '../lib/financeUtils'
import { getRoleLabel } from '../lib/permissions'

export const SubscriptionPage: React.FC = () => {
  const {
    activeRole,
    userSubscription,
    subscriptions,
    subscribeToMonthlyPlan,
    cancelSubscription,
    trucks,
    payments,
  } = useTransport()

  const [selectedTruck, setSelectedTruck] = useState<string>(
    trucks.length > 0 ? trucks[0].matricule : 'DK-2024-TR [Fictif]'
  )
  const [paymentProvider, setPaymentProvider] = useState<'mock' | 'wave' | 'orange_money'>('mock')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDiscoveryOpen, setIsDiscoveryOpen] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  )

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    setFeedback(null)

    try {
      const res = await subscribeToMonthlyPlan({
        truckMatricule: selectedTruck,
        paymentProvider,
      })

      if (res.success) {
        setFeedback({
          type: 'success',
          message: res.message,
        })
      } else {
        setFeedback({
          type: 'error',
          message: res.message,
        })
      }
    } catch {
      setFeedback({
        type: 'error',
        message: 'Une erreur imprévue est survenue lors de la souscription.',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Filtrer l'historique des paiements d'abonnement
  const subscriptionPayments = payments.filter((p) => p.type === 'subscription')

  const backLink =
    activeRole === 'truck_owner'
      ? '/proprietaire'
      : activeRole === 'driver'
      ? '/chauffeur'
      : activeRole === 'shipper'
      ? '/chargeur'
      : '/admin'

  return (
    <div className="min-h-screen flex flex-col bg-[#070d1e] text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      <Header onOpenJoinModal={() => setIsDiscoveryOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation & Fil d'Ariane */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="space-y-1">
            <Link
              to={backLink}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retour à mon espace ({getRoleLabel(activeRole)})</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Abonnement Matériel & Services
            </h1>
            <p className="text-sm text-slate-400">
              Formule professionnelle à 30 000 FCFA / mois par camion pour transporteurs et chauffeurs
            </p>
          </div>
        </div>
        {/* Avertissement environnement de démonstration */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-200/90 leading-relaxed">
            <span className="font-semibold text-amber-300">
              Paiement simulé — environnement de démonstration :
            </span>{' '}
            L’abonnement à 30 000 FCFA/mois est une exigence centrale du cahier des charges
            Teranga Connect. Dans ce prototype, le paiement est simulé par notre passerelle de
            démonstration. Les passerelles Wave et Orange Money officielles seront activées dès
            finalisation des agréments marchands.
          </div>
        </div>

        {/* Message de confirmation ou erreur */}
        {feedback && (
          <div
            className={`rounded-2xl p-4 flex items-center gap-3 border ${
              feedback.type === 'success'
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200'
                : 'bg-rose-500/15 border-rose-500/30 text-rose-200'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <p className="text-sm font-medium">{feedback.message}</p>
          </div>
        )}

        {/* Grille principale : Offre vs Statut Actuel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Carte Offre 30 000 FCFA / mois (7 colonnes) */}
          <div className="lg:col-span-7 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                Cahier des charges Teranga Connect
              </span>
              <span className="text-xs text-slate-400 font-mono">Plan Unique Transporteur</span>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Abonnement Matériel & Flotte
              </h2>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                  {formatFcfa(MONTHLY_SUBSCRIPTION_AMOUNT)}
                </span>
                <span className="text-slate-400 text-sm font-medium">/ mois / camion</span>
              </div>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                Formule forfaitaire destinée aux propriétaires de camions et chauffeurs
                indépendants pour accéder aux flux de fret réguliers et aux services financiers
                intégrés.
              </p>
            </div>

            {/* Avantages contractuels */}
            <div className="space-y-3.5 pt-4 border-t border-slate-800/80 mb-8">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Avantages inclus dans le forfait :
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Accès illimité au fret :</strong> Offres régulières Dakar ↔ Régions et
                    corridors maliens.
                  </span>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <Fuel className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Avance carburant 10–15 % :</strong> Déblocage sous forme de bon numérique
                    (Total, Elton, Shell).
                  </span>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <RefreshCw className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Retours à vide rentabilisés :</strong> Fret retour optimisé avec
                    commission à 40 %.
                  </span>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Séquestre garanti :</strong> Paiement sécurisé et solde garanti après
                    émargement POD.
                  </span>
                </div>
              </div>
            </div>

            {/* Formulaire de souscription */}
            <form onSubmit={handleSubscribe} className="space-y-4 pt-4 border-t border-slate-800/80">
              <h3 className="text-sm font-semibold text-white">Souscrire ou renouveler :</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <TruckIcon className="w-3.5 h-3.5 text-blue-400" />
                    Véhicule bénéficiaire :
                  </label>
                  <select
                    value={selectedTruck}
                    onChange={(e) => setSelectedTruck(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    {trucks.map((t) => (
                      <option key={t.id} value={t.matricule}>
                        {t.brandModel} — {t.matricule}
                      </option>
                    ))}
                    <option value="DK-NOUVEAU-01 [Fictif]">Autre véhicule de la flotte</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                    Passerelle de règlement :
                  </label>
                  <select
                    value={paymentProvider}
                    onChange={(e) =>
                      setPaymentProvider(e.target.value as 'mock' | 'wave' | 'orange_money')
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="mock">Paiement Démonstration (Simulation instantanée)</option>
                    <option value="wave">Wave Mobile Money (En attente API)</option>
                    <option value="orange_money">Orange Money (En attente API)</option>
                  </select>
                </div>
              </div>

              {paymentProvider !== 'mock' && (
                <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 text-xs text-rose-300 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>
                    La passerelle {paymentProvider === 'wave' ? 'Wave' : 'Orange Money'} officielle
                    est en cours d’intégration marchande. Pour tester le parcours immédiatement,
                    sélectionnez le mode « Paiement Démonstration ».
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Traitement de la souscription...
                  </>
                ) : (
                  <>
                    <span>Souscrire l’abonnement — {formatFcfa(MONTHLY_SUBSCRIPTION_AMOUNT)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Statut actuel de l'utilisateur (5 colonnes) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                Mon Statut d’Abonnement
              </h3>

              {userSubscription ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-xs text-slate-400">Statut actuel :</span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                        userSubscription.status === 'active'
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : userSubscription.status === 'expired'
                          ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                          : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {userSubscription.status === 'active'
                        ? 'Actif & En règle'
                        : userSubscription.status === 'expired'
                        ? 'Expiré'
                        : userSubscription.status === 'pending'
                        ? 'En attente'
                        : 'Résilié'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                    <span className="text-slate-400">Montant forfaitaire :</span>
                    <span className="font-bold text-white">
                      {formatFcfa(userSubscription.amount)} / mois
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                    <span className="text-slate-400">Véhicule assigné :</span>
                    <span className="font-mono text-blue-300 font-semibold">
                      {userSubscription.truckMatricule || 'Flotte principale'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                    <span className="text-slate-400">Date d’activation :</span>
                    <span className="text-slate-300">{userSubscription.startedAt || 'N/A'}</span>
                  </div>

                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                    <span className="text-slate-400">Date d’expiration :</span>
                    <span className="font-semibold text-amber-300">
                      {userSubscription.expiresAt || 'N/A'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                    <span className="text-slate-400">Passerelle de règlement :</span>
                    <span className="text-slate-300">{userSubscription.paymentProvider}</span>
                  </div>

                  {userSubscription.status === 'active' && (
                    <button
                      onClick={() => cancelSubscription(userSubscription.id)}
                      className="w-full mt-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-800/50 text-xs font-semibold transition-all"
                    >
                      Résilier pour le mois prochain
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-500">
                    <Clock className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-white">Aucun abonnement actif</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                    Vous n’avez pas encore activé d’abonnement matériel pour votre compte{' '}
                    <span className="text-blue-300 font-medium">({getRoleLabel(activeRole)})</span>.
                  </p>
                </div>
              )}
            </div>

            {/* Fiche d'information réglementaire */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 text-xs text-slate-400 space-y-2">
              <h4 className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-blue-400" />
                Règles de facturation Teranga Connect :
              </h4>
              <p>
                L’abonnement mensuel de 30 000 FCFA est dû par camion en circulation sur la
                plateforme. Il donne accès aux frets garantis, au carburant numérique et à
                l’assurance marchandise partenaire.
              </p>
            </div>
          </div>
        </div>

        {/* Historique des abonnements du réseau (pour superviseur / admin ou vue complète) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <History className="w-5 h-5 text-blue-400" />
                Historique des souscriptions et règlements
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Suivi des facturations forfaitaires de 30 000 FCFA/mois enregistrées dans le système
              </p>
            </div>

            <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 self-start sm:self-auto">
              Total souscriptions : {subscriptions.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Bénéficiaire</th>
                  <th className="px-4 py-3">Rôle</th>
                  <th className="px-4 py-3">Véhicule</th>
                  <th className="px-4 py-3">Montant</th>
                  <th className="px-4 py-3">Période</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3">Règlement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {subscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 font-semibold text-white">{sub.userName}</td>
                    <td className="px-4 py-3 text-slate-400">{getRoleLabel(sub.userRole)}</td>
                    <td className="px-4 py-3 font-mono text-blue-300">
                      {sub.truckMatricule || 'DK-****-TR'}
                    </td>
                    <td className="px-4 py-3 font-bold text-emerald-400">
                      {formatFcfa(sub.amount)}
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {sub.startedAt ? `${sub.startedAt} → ${sub.expiresAt}` : 'En attente'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
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
                    <td className="px-4 py-3 text-slate-400">{sub.paymentProvider}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {subscriptionPayments.length > 0 && (
            <div className="pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                <span>Transactions & Quittances d’abonnement</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {subscriptionPayments.map((pay) => (
                  <div key={pay.id} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1">
                    <div className="flex justify-between font-mono text-[11px]">
                      <span className="text-slate-400">{pay.reference}</span>
                      <span className="text-emerald-400 font-bold">{formatFcfa(pay.amount)}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Passerelle : {pay.provider}</span>
                      <span className="capitalize">{pay.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <DiscoveryModal isOpen={isDiscoveryOpen} onClose={() => setIsDiscoveryOpen(false)} />
    </div>
  )
}
