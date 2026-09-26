import type { ApplicationStatus, MissionStatus, MissionTimelineStep } from '../types'

/**
 * Libellés et styles visuels pour les statuts de candidature
 */
export const APPLICATION_STATUS_CONFIG: Record<
  ApplicationStatus,
  {
    label: string
    variant: 'amber' | 'success' | 'danger' | 'default' | 'outline'
    badgeClass: string
    dotColor: string
    description: string
  }
> = {
  pending: {
    label: 'En attente',
    variant: 'amber',
    badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    dotColor: 'bg-amber-400',
    description: 'Candidature soumise, en cours d’examen par le propriétaire',
  },
  accepted: {
    label: 'Acceptée',
    variant: 'success',
    badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    dotColor: 'bg-emerald-400',
    description: 'Candidature retenue, en attente de confirmation de mission',
  },
  confirmed: {
    label: 'Mission confirmée',
    variant: 'success',
    badgeClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    dotColor: 'bg-blue-400',
    description: 'Mission fermement confirmée entre les deux parties',
  },
  completed: {
    label: 'Terminée',
    variant: 'default',
    badgeClass: 'bg-slate-700/50 text-slate-300 border-slate-600/30',
    dotColor: 'bg-slate-400',
    description: 'Trajet achevé et clôturé dans le prototype',
  },
  rejected: {
    label: 'Refusée',
    variant: 'danger',
    badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    dotColor: 'bg-rose-400',
    description: 'Candidature non retenue pour ce trajet',
  },
  cancelled: {
    label: 'Annulée',
    variant: 'danger',
    badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    dotColor: 'bg-rose-400',
    description: 'Candidature retirée ou annulée',
  },
}

/**
 * Libellés et styles visuels pour les statuts de mission
 */
/**
 * Libellés et styles visuels pour les statuts de mission
 * Cycle canonique Phase 6 : PENDING -> ACCEPTED -> IN_PROGRESS -> COMPLETED (+ CANCELLED)
 */
export const MISSION_STATUS_CONFIG: Record<
  MissionStatus,
  {
    label: string
    variant: 'amber' | 'success' | 'danger' | 'default' | 'outline'
    badgeClass: string
    dotColor: string
    stepIndex: number
    description: string
  }
> = {
  interest: {
    label: 'Intérêt manifesté',
    variant: 'amber',
    badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    dotColor: 'bg-amber-400',
    stepIndex: 0,
    description: 'Manifestation d’intérêt enregistrée, en attente de formalisation',
  },
  pending: {
    label: 'En attente',
    variant: 'amber',
    badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    dotColor: 'bg-amber-400',
    stepIndex: 0,
    description: 'Mission créée, en attente d’acceptation formelle',
  },
  accepted: {
    label: 'Acceptée',
    variant: 'success',
    badgeClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    dotColor: 'bg-blue-400',
    stepIndex: 1,
    description: 'Mission acceptée, prête pour le départ',
  },
  confirmed: {
    label: 'Acceptée',
    variant: 'success',
    badgeClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    dotColor: 'bg-blue-400',
    stepIndex: 1,
    description: 'Mission validée et prête pour le départ',
  },
  in_progress: {
    label: 'En cours',
    variant: 'success',
    badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    dotColor: 'bg-emerald-400 animate-pulse',
    stepIndex: 2,
    description: 'Camion en route et acheminement du fret en cours',
  },
  completed: {
    label: 'Terminée',
    variant: 'default',
    badgeClass: 'bg-slate-700/50 text-slate-300 border-slate-600/30',
    dotColor: 'bg-slate-400',
    stepIndex: 3,
    description: 'Livraison réceptionnée, déchargement et émargement achevés',
  },
  cancelled: {
    label: 'Annulée',
    variant: 'danger',
    badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    dotColor: 'bg-rose-400',
    stepIndex: -1,
    description: 'Mission annulée',
  },
}

/**
 * Formatage de montants en FCFA
 */
export function formatFcfa(amount: number): string {
  return new Intl.NumberFormat('fr-FR').format(Math.round(amount)) + ' FCFA'
}

/**
 * Parse un montant textuel (ex: "180 000 FCFA") en nombre
 */
export function parseFcfaAmount(text?: string, fallback = 200000): number {
  if (!text) return fallback
  const numericStr = text.replace(/[^0-9]/g, '')
  const parsed = parseInt(numericStr, 10)
  return isNaN(parsed) || parsed === 0 ? fallback : parsed
}

/**
 * Calcul du modèle économique indicatif
 * Hypothèses de démonstration :
 * - Aller : 30%
 * - Retour optimisé : 40%
 * - Avance carburant/péage estimée : 12% (10-15%)
 */
export function calculateMissionEconomics(
  estimatedPrice: string | number,
  isReturnTrip = false
) {
  const baseAmount =
    typeof estimatedPrice === 'number'
      ? estimatedPrice
      : parseFcfaAmount(estimatedPrice)

  const commissionRate = isReturnTrip ? 0.4 : 0.3
  const commissionAmount = Math.round(baseAmount * commissionRate)
  const driverNetEstimated = baseAmount - commissionAmount
  const fuelAdvanceEstimated = Math.round(baseAmount * 0.12) // 12% d'avance estimée

  return {
    totalEstimatedAmount: baseAmount,
    totalFormatted: formatFcfa(baseAmount),
    commissionRate,
    commissionPercentLabel: isReturnTrip ? '40 % (Fret Retour)' : '30 % (Fret Aller)',
    commissionAmount,
    commissionFormatted: formatFcfa(commissionAmount),
    driverNetEstimated,
    driverNetFormatted: formatFcfa(driverNetEstimated),
    fuelAdvanceEstimated,
    fuelAdvanceFormatted: formatFcfa(fuelAdvanceEstimated),
    subscriptionNote: 'Abonnement matériel : 30 000 FCFA/mois (Modèle envisagé)',
    disclaimer:
      'Hypothèses de démonstration — modèle économique envisagé, non contractuel.',
  }
}

/**
 * Génère la timeline de la mission pour l'affichage visuel
 * Respecte le cycle 4 étapes explicite :
 * Mission créée -> Mission acceptée -> Mission en cours -> Mission terminée
 */
export function buildMissionTimeline(
  status: MissionStatus,
  dates: {
    createdAt?: string
    acceptedAt?: string
    confirmedAt?: string
    startedAt?: string
    completedAt?: string
  } = {}
): MissionTimelineStep[] {
  const currentStep = MISSION_STATUS_CONFIG[status]?.stepIndex ?? 0
  const isCancelled = status === 'cancelled'

  return [
    {
      id: 'created',
      label: 'Mission créée',
      description: 'Création et enregistrement de l’ordre de transport',
      timestamp: dates.createdAt || 'Jour J',
      status: isCancelled
        ? 'completed'
        : currentStep > 0
        ? 'completed'
        : 'current',
    },
    {
      id: 'accepted',
      label: 'Mission acceptée',
      description: 'Validation par les parties et attribution opérationnelle',
      timestamp: dates.acceptedAt || (currentStep >= 1 ? dates.createdAt || 'Jour J + 2h' : undefined),
      status: isCancelled
        ? 'upcoming'
        : currentStep > 1
        ? 'completed'
        : currentStep === 1
        ? 'current'
        : 'upcoming',
    },
    {
      id: 'in_progress',
      label: 'Mission en cours',
      description: 'Chargement effectué et fret en acheminement sur corridor',
      timestamp: dates.startedAt || (currentStep >= 2 ? 'En transit' : undefined),
      status: isCancelled
        ? 'upcoming'
        : currentStep > 2
        ? 'completed'
        : currentStep === 2
        ? 'current'
        : 'upcoming',
    },
    {
      id: 'completed',
      label: 'Mission terminée',
      description: 'Livraison réceptionnée, déchargement et émargement achevés',
      timestamp: dates.completedAt || (currentStep === 3 ? 'Livrée' : undefined),
      status: isCancelled
        ? 'upcoming'
        : currentStep === 3
        ? 'completed'
        : 'upcoming',
    },
  ]
}

/**
 * Type d'action de transition autorisée sur une mission
 */
export type MissionTransitionAction = 'accept' | 'start' | 'complete' | 'cancel'

/**
 * Détermine l'action principale autorisée selon le statut
 * Règle senior : workflow strictement déterministe
 */
export function getAvailableMissionAction(status: MissionStatus): {
  primaryAction: MissionTransitionAction | null
  primaryLabel: string | null
  canCancel: boolean
} {
  switch (status) {
    case 'pending':
    case 'interest':
      return {
        primaryAction: 'accept',
        primaryLabel: 'Accepter la mission',
        canCancel: true,
      }
    case 'accepted':
    case 'confirmed':
      return {
        primaryAction: 'start',
        primaryLabel: 'Démarrer la mission',
        canCancel: true,
      }
    case 'in_progress':
      return {
        primaryAction: 'complete',
        primaryLabel: 'Terminer la mission',
        canCancel: true,
      }
    case 'completed':
      return {
        primaryAction: null,
        primaryLabel: 'Mission terminée',
        canCancel: false,
      }
    case 'cancelled':
      return {
        primaryAction: null,
        primaryLabel: 'Mission annulée',
        canCancel: false,
      }
    default:
      return {
        primaryAction: null,
        primaryLabel: null,
        canCancel: false,
      }
  }
}

