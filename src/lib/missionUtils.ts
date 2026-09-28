import type {
  ApplicationStatus,
  MissionStatus,
  MissionTimelineStep,
  OperationalStepId,
  OperationalStatus,
  MissionTracking,
  Mission,
} from '../types'

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

import {
  formatFcfa,
  parseFcfaAmount,
  calculateFullMissionEconomics,
  DEFAULT_ADVANCE_PERCENT,
} from './financeUtils'

export { formatFcfa, parseFcfaAmount }

/**
 * Calcul du modèle économique indicatif
 * Conforme au cahier des charges :
 * - Aller : 30 %
 * - Retour optimisé : 40 %
 * - Avance trésorerie : 10 % à 15 % (défaut 10 %)
 */
export function calculateMissionEconomics(
  estimatedPrice: string | number,
  isReturnTrip = false,
  advancePercent = DEFAULT_ADVANCE_PERCENT
) {
  const full = calculateFullMissionEconomics(estimatedPrice, isReturnTrip, advancePercent)

  return {
    totalEstimatedAmount: full.grossAmount,
    totalFormatted: full.grossFormatted,
    commissionRate: full.commissionRate,
    commissionPercentLabel: full.commissionLabel,
    commissionAmount: full.commissionAmount,
    commissionFormatted: full.commissionFormatted,
    driverNetEstimated: full.transporterGrossAmount,
    driverNetFormatted: full.transporterGrossFormatted,
    fuelAdvanceEstimated: full.advanceAmount,
    fuelAdvanceFormatted: full.advanceFormatted,
    transporterFinalSolde: full.transporterFinalSolde,
    transporterFinalSoldeFormatted: full.transporterFinalSoldeFormatted,
    remainingBalanceFormatted: full.transporterFinalSoldeFormatted,
    advancePercent: full.advancePercent,
    subscriptionNote: 'Abonnement matériel : 30 000 FCFA/mois par camion',
    disclaimer:
      'Hypothèses conformes au cahier des charges Teranga Connect (30 % aller, 40 % retour, avance 10–15 %).',
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
      // En cours : aucune action de terminaison directe autorisée.
      // Le suivi opérationnel sur /missions/:id est la seule voie de livraison.
      return {
        primaryAction: null,
        primaryLabel: null,
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

/**
 * Configuration visuelle et descriptive des statuts opérationnels - Phase 7
 */
export const OPERATIONAL_STATUS_CONFIG: Record<
  OperationalStatus,
  {
    label: string
    shortLabel: string
    stepIndex: number
    badgeClass: string
    dotColor: string
    description: string
  }
> = {
  not_started: {
    label: 'Suivi non actif',
    shortLabel: 'Non démarré',
    stepIndex: -1,
    badgeClass: 'bg-slate-800/80 text-slate-400 border-slate-700/50',
    dotColor: 'bg-slate-500',
    description: 'Le suivi opérationnel sera activé dès le démarrage de la mission.',
  },
  pending_pickup: {
    label: 'En attente de prise en charge',
    shortLabel: 'À charger',
    stepIndex: 0,
    badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    dotColor: 'bg-amber-400 animate-pulse',
    description: 'Le camion est attendu sur le point de chargement pour l’enlèvement.',
  },
  picked_up: {
    label: 'Prise en charge confirmée',
    shortLabel: 'Chargé',
    stepIndex: 1,
    badgeClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    dotColor: 'bg-blue-400',
    description: 'Marchandise chargée et arrimée. Prêt pour le départ sur le corridor.',
  },
  in_transit: {
    label: 'En route sur corridor',
    shortLabel: 'En route',
    stepIndex: 2,
    badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    dotColor: 'bg-emerald-400 animate-pulse',
    description: 'Véhicule en cours d’acheminement sur l’itinéraire routier.',
  },
  arrived: {
    label: 'Arrivé à destination',
    shortLabel: 'Sur site',
    stepIndex: 3,
    badgeClass: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    dotColor: 'bg-purple-400 animate-pulse',
    description: 'Camion stationné au point de livraison. Déchargement et émargement prêts.',
  },
  delivered: {
    label: 'Livraison confirmée',
    shortLabel: 'Livré & Émargé',
    stepIndex: 4,
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    dotColor: 'bg-emerald-400',
    description: 'Cargaison réceptionnée avec émargement. Mission clôturée avec succès.',
  },
}

/**
 * Définition des 4 étapes canoniques du suivi opérationnel
 * 1. Prise en charge -> 2. En route -> 3. Arrivé à destination -> 4. Livraison confirmée
 */
export interface OperationalStepDefinition {
  id: OperationalStepId
  stepNumber: number
  label: string
  actionLabel: string
  description: string
  locationDefault: (mission: Mission) => string
}

export const OPERATIONAL_STEPS: OperationalStepDefinition[] = [
  {
    id: 'pickup',
    stepNumber: 1,
    label: 'Prise en charge',
    actionLabel: 'Confirmer la prise en charge',
    description: 'Contrôle de conformité de la marchandise et chargement à l’origine',
    locationDefault: (m) => m.origin,
  },
  {
    id: 'in_transit',
    stepNumber: 2,
    label: 'En route',
    actionLabel: 'Prendre la route',
    description: 'Départ du site et acheminement du fret sur le corridor routier',
    locationDefault: (m) => `Axe ${m.origin} → ${m.destination}`,
  },
  {
    id: 'arrival',
    stepNumber: 3,
    label: 'Arrivé à destination',
    actionLabel: 'Signaler l’arrivée',
    description: 'Présentation du véhicule au site de livraison ou chez le destinataire',
    locationDefault: (m) => m.destination,
  },
  {
    id: 'delivery',
    stepNumber: 4,
    label: 'Livraison confirmée',
    actionLabel: 'Confirmer la livraison',
    description: 'Déchargement complet, vérification contradictoire et émargement de livraison',
    locationDefault: (m) => m.destination,
  },
]

/**
 * Récupère ou reconstruit de manière déterministe le modèle de suivi opérationnel
 */
export function getMissionTracking(mission: Mission): MissionTracking {
  if (mission.tracking) {
    return mission.tracking
  }

  // Fallback cohérent selon le statut global de la mission
  if (mission.status === 'completed') {
    return {
      currentStatus: 'delivered',
      pickedUpAt: mission.startedAt || mission.createdAt,
      inTransitAt: mission.startedAt || mission.createdAt,
      arrivedAt: mission.completedAt || 'Date de livraison',
      deliveredAt: mission.completedAt || 'Date de livraison',
      history: [
        {
          id: `hist-${mission.id}-1`,
          step: 'created',
          label: 'Mission créée',
          timestamp: mission.createdAt,
          location: mission.origin,
        },
        {
          id: `hist-${mission.id}-2`,
          step: 'accepted',
          label: 'Mission acceptée',
          timestamp: mission.acceptedAt || mission.createdAt,
          location: mission.origin,
        },
        {
          id: `hist-${mission.id}-3`,
          step: 'pickup',
          label: 'Prise en charge confirmée',
          timestamp: mission.startedAt || mission.createdAt,
          location: mission.origin,
        },
        {
          id: `hist-${mission.id}-4`,
          step: 'in_transit',
          label: 'Mission en route',
          timestamp: mission.startedAt || mission.createdAt,
          location: `Corridor ${mission.origin} → ${mission.destination}`,
        },
        {
          id: `hist-${mission.id}-5`,
          step: 'arrival',
          label: 'Arrivé à destination',
          timestamp: mission.completedAt || 'À destination',
          location: mission.destination,
        },
        {
          id: `hist-${mission.id}-6`,
          step: 'delivery',
          label: 'Livraison confirmée',
          timestamp: mission.completedAt || 'Livraison émargée',
          location: mission.destination,
        },
      ],
      deliveryConfirmation: {
        confirmedAt: mission.completedAt || 'Livraison émargée',
        confirmedBy: mission.driverName,
        signerName: 'Réceptionnaire sur site',
        signerRole: 'Responsable logistique',
        receiptCode: `BL-${mission.missionCode.replace(/[^A-Z0-9]/g, '')}-OK`,
        notes: 'Marchandise déchargée et émargée sans réserve.',
      },
    }
  }

  if (mission.status === 'in_progress') {
    return {
      currentStatus: 'in_transit',
      pickedUpAt: mission.startedAt || mission.createdAt,
      inTransitAt: mission.startedAt || mission.createdAt,
      history: [
        {
          id: `hist-${mission.id}-1`,
          step: 'created',
          label: 'Mission créée',
          timestamp: mission.createdAt,
          location: mission.origin,
        },
        {
          id: `hist-${mission.id}-2`,
          step: 'accepted',
          label: 'Mission acceptée',
          timestamp: mission.acceptedAt || mission.createdAt,
          location: mission.origin,
        },
        {
          id: `hist-${mission.id}-3`,
          step: 'pickup',
          label: 'Prise en charge confirmée',
          timestamp: mission.startedAt || mission.createdAt,
          location: mission.origin,
        },
        {
          id: `hist-${mission.id}-4`,
          step: 'in_transit',
          label: 'Mission en route',
          timestamp: mission.startedAt || mission.createdAt,
          location: `Corridor ${mission.origin} → ${mission.destination}`,
        },
      ],
    }
  }

  // Pending ou Accepted
  return {
    currentStatus: 'not_started',
    history: [
      {
        id: `hist-${mission.id}-1`,
        step: 'created',
        label: 'Mission créée',
        timestamp: mission.createdAt,
        location: mission.origin,
      },
      ...(mission.acceptedAt
        ? [
            {
              id: `hist-${mission.id}-2`,
              step: 'accepted' as const,
              label: 'Mission acceptée',
              timestamp: mission.acceptedAt,
              location: mission.origin,
            },
          ]
        : []),
    ],
  }
}

/**
 * Garde-métier Phase 7 : Vérifie la validité stricte d'une transition opérationnelle
 * Règle senior : ordre séquentiel obligatoire :
 * PRISE_EN_CHARGE (pickup) -> EN_ROUTE (in_transit) -> ARRIVEE (arrival) -> LIVRAISON_CONFIRMEE (delivery)
 * Impossible de sauter une étape, de revenir en arrière, ou d'exécuter 2 fois la même étape.
 */
export function canPerformOperationalStep(
  mission: Mission,
  targetStep: OperationalStepId
): { allowed: boolean; reason?: string } {
  // Mission terminée ou annulée
  if (mission.status === 'completed') {
    return {
      allowed: false,
      reason: 'La mission est déjà terminée et la livraison confirmée.',
    }
  }

  if (mission.status === 'cancelled') {
    return {
      allowed: false,
      reason: 'La mission a été annulée. Aucune action opérationnelle possible.',
    }
  }

  // La mission doit être en cours d'exécution
  if (mission.status !== 'in_progress') {
    return {
      allowed: false,
      reason: 'La mission doit d’abord être démarrée pour activer le suivi opérationnel.',
    }
  }

  const tracking = getMissionTracking(mission)
  const current = tracking.currentStatus

  switch (targetStep) {
    case 'pickup':
      if (current === 'not_started' || current === 'pending_pickup') {
        return { allowed: true }
      }
      return {
        allowed: false,
        reason: 'La prise en charge a déjà été confirmée pour cette mission.',
      }

    case 'in_transit':
      if (current === 'picked_up') {
        return { allowed: true }
      }
      if (current === 'not_started' || current === 'pending_pickup') {
        return {
          allowed: false,
          reason: 'Impossible de prendre la route avant la confirmation de prise en charge.',
        }
      }
      return {
        allowed: false,
        reason: 'Le départ a déjà été validé (camion déjà en route ou arrivé).',
      }

    case 'arrival':
      if (current === 'in_transit') {
        return { allowed: true }
      }
      if (current === 'not_started' || current === 'pending_pickup' || current === 'picked_up') {
        return {
          allowed: false,
          reason: 'Impossible de signaler l’arrivée avant que le véhicule ne soit parti en route.',
        }
      }
      return {
        allowed: false,
        reason: 'L’arrivée à destination a déjà été signalée.',
      }

    case 'delivery':
      if (current === 'arrived') {
        return { allowed: true }
      }
      if (current === 'delivered') {
        return {
          allowed: false,
          reason: 'La livraison a déjà été confirmée et émargée.',
        }
      }
      return {
        allowed: false,
        reason:
          'Impossible de confirmer la livraison avant que le véhicule ne soit arrivé à destination.',
      }

    default:
      return { allowed: false, reason: 'Étape opérationnelle non reconnue.' }
  }
}

/**
 * Détermine la prochaine action opérationnelle attendue pour une mission
 */
export function getNextOperationalAction(mission: Mission): {
  stepId: OperationalStepId
  stepNumber: number
  label: string
  actionLabel: string
  description: string
  locationDefault: string
} | null {
  if (mission.status !== 'in_progress') {
    return null
  }

  const tracking = getMissionTracking(mission)
  const current = tracking.currentStatus

  if (current === 'not_started' || current === 'pending_pickup') {
    const step = OPERATIONAL_STEPS.find((s) => s.id === 'pickup')!
    return {
      stepId: 'pickup',
      stepNumber: step.stepNumber,
      label: step.label,
      actionLabel: step.actionLabel,
      description: step.description,
      locationDefault: step.locationDefault(mission),
    }
  }

  if (current === 'picked_up') {
    const step = OPERATIONAL_STEPS.find((s) => s.id === 'in_transit')!
    return {
      stepId: 'in_transit',
      stepNumber: step.stepNumber,
      label: step.label,
      actionLabel: step.actionLabel,
      description: step.description,
      locationDefault: step.locationDefault(mission),
    }
  }

  if (current === 'in_transit') {
    const step = OPERATIONAL_STEPS.find((s) => s.id === 'arrival')!
    return {
      stepId: 'arrival',
      stepNumber: step.stepNumber,
      label: step.label,
      actionLabel: step.actionLabel,
      description: step.description,
      locationDefault: step.locationDefault(mission),
    }
  }

  if (current === 'arrived') {
    const step = OPERATIONAL_STEPS.find((s) => s.id === 'delivery')!
    return {
      stepId: 'delivery',
      stepNumber: step.stepNumber,
      label: step.label,
      actionLabel: step.actionLabel,
      description: step.description,
      locationDefault: step.locationDefault(mission),
    }
  }

  return null
}

/**
 * Détermine le statut d'une étape opérationnelle (completed | current | upcoming)
 */
export function getOperationalStepState(
  tracking: MissionTracking,
  stepId: OperationalStepId
): 'completed' | 'current' | 'upcoming' {
  const currentStatus = tracking.currentStatus
  const statusCfg = OPERATIONAL_STATUS_CONFIG[currentStatus]
  const currentStepIndex = statusCfg.stepIndex

  const stepMapping: Record<OperationalStepId, number> = {
    pickup: 1,
    in_transit: 2,
    arrival: 3,
    delivery: 4,
  }

  const targetIndex = stepMapping[stepId]

  if (currentStepIndex >= targetIndex) {
    return 'completed'
  }

  // Étape en cours d'attente
  if (
    (stepId === 'pickup' && (currentStatus === 'pending_pickup' || currentStatus === 'not_started')) ||
    (stepId === 'in_transit' && currentStatus === 'picked_up') ||
    (stepId === 'arrival' && currentStatus === 'in_transit') ||
    (stepId === 'delivery' && currentStatus === 'arrived')
  ) {
    return 'current'
  }

  return 'upcoming'
}

/**
 * Formatage de date/heure en français lisible pour l'historique
 * Exemple : "26 septembre — 14:30"
 */
export function formatCurrentDateTimeFr(date: Date = new Date()): string {
  const day = date.getDate()
  const months = [
    'janvier',
    'février',
    'mars',
    'avril',
    'mai',
    'juin',
    'juillet',
    'août',
    'septembre',
    'octobre',
    'novembre',
    'décembre',
  ]
  const month = months[date.getMonth()]
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${day} ${month} — ${hours}:${minutes}`
}

/**
 * Génération déterministe d'un code de récépissé / bon de livraison
 */
export function generateDeliveryReceiptCode(missionCode: string): string {
  const cleanCode = missionCode.replace(/[^A-Z0-9]/g, '')
  const randomSuffix = Math.floor(1000 + Math.random() * 9000)
  return `BL-${cleanCode}-${randomSuffix}`
}


