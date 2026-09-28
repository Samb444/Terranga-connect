import type { TripType } from '../types'

/**
 * ========================================================
 * PARAMÈTRES ET RÈGLES FINANCIÈRES CANONIQUES — PHASE 9
 * ========================================================
 * Conformément au cahier des charges Teranga Connect :
 * - Aller : 30 % de commission Teranga
 * - Retour optimisé : 40 % de commission Teranga
 * - Avance trésorerie : 10 % à 15 % (défaut 10 %) sous forme de bon carburant numérique
 * - Abonnement mensuel : 30 000 FCFA / mois par camion
 */

export const ADVANCE_MIN_PERCENT = 10
export const ADVANCE_MAX_PERCENT = 15
export const DEFAULT_ADVANCE_PERCENT = 10

export const COMMISSION_RATE_ALLER = 0.30 // 30 %
export const COMMISSION_RATE_RETOUR = 0.40 // 40 %

export const MONTHLY_SUBSCRIPTION_AMOUNT = 30000 // 30 000 FCFA

/**
 * Formatage d'un montant en FCFA avec séparateurs de milliers
 */
export function formatFcfa(amount: number): string {
  return new Intl.NumberFormat('fr-FR').format(Math.round(amount)) + ' FCFA'
}

/**
 * Parse un montant textuel (ex: "180 000 FCFA", "150000") en nombre
 */
export function parseFcfaAmount(text?: string | number, fallback = 200000): number {
  if (typeof text === 'number') {
    return isNaN(text) || text <= 0 ? fallback : text
  }
  if (!text) return fallback
  const numericStr = text.replace(/[^0-9]/g, '')
  const parsed = parseInt(numericStr, 10)
  return isNaN(parsed) || parsed === 0 ? fallback : parsed
}

export interface CommissionResult {
  grossAmount: number
  rate: number
  rateLabel: string
  commissionAmount: number
  transporterAmount: number
}

/**
 * Calcule la commission Teranga et la part transporteur
 * Respect strict du cahier des charges :
 * - Aller : 30 %
 * - Retour : 40 %
 */
export function calculateCommission(
  grossAmount: number,
  tripType: TripType | boolean,
  config?: { customAllerRate?: number; customRetourRate?: number }
): CommissionResult {
  const safeGross = Math.max(0, Math.round(grossAmount))
  const isReturn =
    tripType === true || tripType === 'return_cargo' || tripType === 'round_trip'

  const allerRate = config?.customAllerRate ?? COMMISSION_RATE_ALLER
  const retourRate = config?.customRetourRate ?? COMMISSION_RATE_RETOUR

  const rate = isReturn ? retourRate : allerRate
  const rateLabel = isReturn ? '40 % (Fret Retour optimisé)' : '30 % (Fret Aller)'

  const commissionAmount = Math.round(safeGross * rate)
  const transporterAmount = safeGross - commissionAmount

  return {
    grossAmount: safeGross,
    rate,
    rateLabel,
    commissionAmount,
    transporterAmount,
  }
}

export interface AdvanceResult {
  advancePercent: number
  advanceAmount: number
  remainingBalance: number
}

/**
 * Calcule l'avance trésorerie (10 % à 15 %)
 * Destinée au carburant et aux frais de péages
 */
export function calculateAdvance(
  grossAmount: number,
  percent: number = DEFAULT_ADVANCE_PERCENT
): AdvanceResult {
  const safeGross = Math.max(0, Math.round(grossAmount))
  // Borner strictement le pourcentage entre 10 % et 15 %
  const validPercent = Math.min(
    ADVANCE_MAX_PERCENT,
    Math.max(ADVANCE_MIN_PERCENT, Math.round(percent))
  )

  const advanceAmount = Math.round(safeGross * (validPercent / 100))
  const remainingBalance = safeGross - advanceAmount

  return {
    advancePercent: validPercent,
    advanceAmount,
    remainingBalance,
  }
}

export interface FullMissionEconomics {
  grossAmount: number
  grossFormatted: string
  isReturnTrip: boolean
  commissionRate: number
  commissionLabel: string
  commissionAmount: number
  commissionFormatted: string
  transporterGrossAmount: number
  transporterGrossFormatted: string
  advancePercent: number
  advanceAmount: number
  advanceFormatted: string
  soldeRemainingOnGross: number
  transporterFinalSolde: number // Solde final versé au transporteur après déduction de l'avance
  transporterFinalSoldeFormatted: string
  subscriptionNote: string
}

/**
 * Décompose l'ensemble du cycle financier de la mission :
 * 1. Montant brut payé par le chargeur
 * 2. Avance (10-15 %) versée au démarrage (bon carburant numérique)
 * 3. Commission Teranga (30 % aller ou 40 % retour)
 * 4. Régularisation de l'avance et solde final transporteur
 */
export function calculateFullMissionEconomics(
  grossAmountInput: number | string,
  tripType: TripType | boolean,
  advancePercentInput: number = DEFAULT_ADVANCE_PERCENT
): FullMissionEconomics {
  const grossAmount = parseFcfaAmount(grossAmountInput)
  const isReturn =
    tripType === true || tripType === 'return_cargo' || tripType === 'round_trip'

  const commission = calculateCommission(grossAmount, tripType)
  const advance = calculateAdvance(grossAmount, advancePercentInput)

  // Le transporteur a droit à (Montant brut - Commission Teranga).
  // Comme il a déjà perçu l'avance au départ, le solde final qui lui est versé est :
  // Solde final = part transporteur - avance déjà reçue
  const transporterFinalSolde = Math.max(
    0,
    commission.transporterAmount - advance.advanceAmount
  )

  return {
    grossAmount,
    grossFormatted: formatFcfa(grossAmount),
    isReturnTrip: isReturn,
    commissionRate: commission.rate,
    commissionLabel: commission.rateLabel,
    commissionAmount: commission.commissionAmount,
    commissionFormatted: formatFcfa(commission.commissionAmount),
    transporterGrossAmount: commission.transporterAmount,
    transporterGrossFormatted: formatFcfa(commission.transporterAmount),
    advancePercent: advance.advancePercent,
    advanceAmount: advance.advanceAmount,
    advanceFormatted: formatFcfa(advance.advanceAmount),
    soldeRemainingOnGross: advance.remainingBalance,
    transporterFinalSolde,
    transporterFinalSoldeFormatted: formatFcfa(transporterFinalSolde),
    subscriptionNote: 'Abonnement matériel : 30 000 FCFA/mois par camion',
  }
}
