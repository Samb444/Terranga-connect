import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Truck,
  Calendar,
  PackageCheck,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Building2,
  Scale,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react'
import { useTransport } from '../hooks/useTransport'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Header } from '../layouts/Header'
import { Footer } from '../layouts/Footer'
import { DiscoveryModal } from '../components/modals/DiscoveryModal'

export const OpportunityDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { opportunities, recordInterest, isInterested } = useTransport()

  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isDiscoveryOpen, setIsDiscoveryOpen] = useState(false)

  const opportunity = opportunities.find((o) => o.id === id)
  const hasExpressedInterest = opportunity ? isInterested(opportunity.id) : false

  const handleManifestInterest = () => {
    if (opportunity) {
      recordInterest(opportunity.id)
      setShowConfirmation(true)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#070d1e] text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      <Header onOpenJoinModal={() => setIsDiscoveryOpen(true)} />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Fil d'Ariane */}
        <div className="flex items-center gap-2 text-xs">
          <Link
            to="/opportunites"
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Retour aux opportunités</span>
          </Link>
          <span className="text-slate-400">/</span>
          <span className="text-amber-400 font-semibold truncate">
            {opportunity ? opportunity.title : 'Fiche mission'}
          </span>
        </div>

        {!opportunity ? (
          /* État d'erreur / Opportunité introuvable */
          <div className="p-8 sm:p-12 text-center rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
            <h2 className="text-xl font-bold text-white">Opportunité non trouvée</h2>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              L'opportunité demandée n'existe pas ou la session a été rechargée.
            </p>
            <Link to="/opportunites">
              <Button variant="primary" size="md">
                Retourner aux opportunités
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Bannière de confirmation frontend mot pour mot selon spec */}
            {(showConfirmation || hasExpressedInterest) && (
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white text-sm sm:text-base font-bold">
                      Votre intérêt a été enregistré dans cette démonstration.
                    </strong>
                    <p className="text-xs text-emerald-300/80 mt-0.5">
                      Cette action est purement illustrative pour ce prototype frontend : aucun
                      contact réel ni transaction financière n'est engagé.
                    </p>
                  </div>
                </div>

                <Badge variant="success" className="text-xs py-1 px-3 shrink-0">
                  Simulation validée
                </Badge>
              </div>
            )}

            {/* En-tête de la fiche */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="amber" className="text-xs py-1 px-3">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{opportunity.badgeNotice}</span>
                    </Badge>

                    {opportunity.isReturnTrip && (
                      <Badge variant="success" className="text-xs py-1 px-3">
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Opportunité de retour optimisée</span>
                      </Badge>
                    )}
                  </div>

                  <span className="text-xs text-slate-400">
                    Référence : <span className="font-mono text-slate-300">{opportunity.id}</span>
                  </span>
                </div>

                {/* Titre de la page mot pour mot selon spec */}
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-amber-400 block mb-1">
                    Fiche mission fret
                  </span>
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                    Détails de l'opportunité
                  </h1>
                  <p className="text-base sm:text-lg text-slate-300 mt-2 font-medium">
                    {opportunity.title}
                  </p>
                </div>

                {/* Grand corridor visuel */}
                <div className="p-4 sm:p-6 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-medium">
                        Lieu de chargement
                      </span>
                      <div className="flex items-center gap-2 text-lg sm:text-2xl font-black text-amber-400">
                        <MapPin className="w-5 h-5 shrink-0" />
                        <span>{opportunity.origin}</span>
                      </div>
                    </div>

                    <ArrowRight className="w-6 h-6 text-slate-400 shrink-0 mx-2" />

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-medium">
                        Lieu de livraison
                      </span>
                      <div className="flex items-center gap-2 text-lg sm:text-2xl font-black text-emerald-400">
                        <MapPin className="w-5 h-5 shrink-0" />
                        <span>{opportunity.destination}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-left sm:text-right border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0 sm:pl-6">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-medium">
                      Tarif indicatif négocié
                    </span>
                    <span className="text-lg sm:text-xl font-bold text-white">
                      {opportunity.estimatedPrice || 'À convenir'}
                    </span>
                  </div>
                </div>

                {/* Grille des caractéristiques clés */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
                    <span className="text-slate-400 text-[10px] uppercase block font-medium">
                      Type de camion
                    </span>
                    <div className="flex items-center gap-1.5 mt-1 font-bold text-white">
                      <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="truncate">{opportunity.truckCategoryLabel}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
                    <span className="text-slate-400 text-[10px] uppercase block font-medium">
                      Capacité / Poids
                    </span>
                    <div className="flex items-center gap-1.5 mt-1 font-bold text-white">
                      <Scale className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{opportunity.weightTons} tonnes</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
                    <span className="text-slate-400 text-[10px] uppercase block font-medium">
                      Date de départ
                    </span>
                    <div className="flex items-center gap-1.5 mt-1 font-bold text-white">
                      <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="truncate">{opportunity.departureDate}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
                    <span className="text-slate-400 text-[10px] uppercase block font-medium">
                      Distance indicative
                    </span>
                    <div className="flex items-center gap-1.5 mt-1 font-bold text-white">
                      <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>~{opportunity.distanceKm} km</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sections détaillées : Informations de la mission, Description, Conditions indicatives */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Colonne gauche (2 colonnes) : Description & Conditions */}
              <div className="lg:col-span-2 space-y-6">
                {/* Description de la mission */}
                <Card className="bg-slate-900/80 border-slate-800 p-6 space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                    <PackageCheck className="w-4 h-4 text-amber-400" />
                    <h3 className="text-base font-bold text-white">
                      Description de la cargaison et du trajet
                    </h3>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {opportunity.description}
                  </p>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                    <span className="text-slate-400">Nature du fret :</span>
                    <span className="font-semibold text-white">{opportunity.cargoType}</span>
                  </div>
                </Card>

                {/* Conditions indicatives requises selon spec */}
                <Card className="bg-slate-900/80 border-slate-800 p-6 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-base font-bold text-white">Conditions indicatives</h3>
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    {opportunity.indicativeConditions.map((cond) => (
                      <li key={cond} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{cond}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1.5 border-t border-slate-800/80">
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      Les conditions définitives sont contractualisées directement entre le
                      propriétaire du véhicule et le donneur d'ordre.
                    </span>
                  </div>
                </Card>
              </div>

              {/* Colonne droite (1 colonne) : Panneau d'action CTA */}
              <div className="space-y-6">
                <Card className="bg-slate-900/90 border-slate-800 p-6 space-y-6 sticky top-24">
                  <div className="space-y-2">
                    <span className="text-xs uppercase font-semibold tracking-wider text-slate-400 block">
                      Prise de contact
                    </span>
                    <h3 className="text-lg font-bold text-white">Intéressé par ce trajet ?</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Manifestez votre intérêt pour être mis en relation avec le transporteur ou le
                      donneur d'ordre.
                    </p>
                  </div>

                  {/* Bouton CTA requis mot pour mot selon spec */}
                  <Button
                    variant={hasExpressedInterest ? 'secondary' : 'primary'}
                    size="lg"
                    onClick={handleManifestInterest}
                    className="w-full justify-center shadow-lg shadow-amber-950/30 text-sm font-bold"
                  >
                    {hasExpressedInterest ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-400" />
                        <span>Intérêt déjà manifesté</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-1.5" />
                        <span>Manifester mon intérêt</span>
                      </>
                    )}
                  </Button>

                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-400 space-y-1.5">
                    <p className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>{opportunity.publishedBy || 'Partenaire Réseau Fret'}</span>
                    </p>
                    <p>
                      Prototype Teranga Connect Phase 3 : aucun paiement ni contact téléphonique réel
                      n'est déclenché.
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <DiscoveryModal isOpen={isDiscoveryOpen} onClose={() => setIsDiscoveryOpen(false)} />
    </div>
  )
}
