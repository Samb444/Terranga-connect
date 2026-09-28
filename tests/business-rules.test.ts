import { test, describe } from 'node:test'
import assert from 'node:assert/strict'

import {
  calculateCommission,
  calculateAdvance,
  calculateFullMissionEconomics,
  MONTHLY_SUBSCRIPTION_AMOUNT,
  COMMISSION_RATE_ALLER,
  COMMISSION_RATE_RETOUR,
  DEFAULT_ADVANCE_PERCENT,
  ADVANCE_MIN_PERCENT,
  ADVANCE_MAX_PERCENT,
} from '../src/lib/financeUtils.ts'

import {
  canAccessRoute,
  getDefaultRouteForRole,
} from '../src/lib/permissions.ts'

import {
  canPerformOperationalStep,
  generateDeliveryReceiptCode,
} from '../src/lib/missionUtils.ts'

import type { Mission } from '../src/types/index.ts'

describe('ÉLÉMENT 2 & 3 — Commissions (30 % Aller / 40 % Retour) et Avances (10 % à 15 %)', () => {
  test('Commission Aller standard strictement à 30 %', () => {
    const result = calculateCommission(100_000, 'outbound')
    assert.equal(result.grossAmount, 100_000)
    assert.equal(result.rate, COMMISSION_RATE_ALLER)
    assert.equal(result.rate, 0.30)
    assert.equal(result.commissionAmount, 30_000)
    assert.equal(result.transporterAmount, 70_000)
  })

  test('Commission Retour optimisé strictement à 40 %', () => {
    const result = calculateCommission(100_000, 'return_cargo')
    assert.equal(result.grossAmount, 100_000)
    assert.equal(result.rate, COMMISSION_RATE_RETOUR)
    assert.equal(result.rate, 0.40)
    assert.equal(result.commissionAmount, 40_000)
    assert.equal(result.transporterAmount, 60_000)
  })

  test('Commission booléenne (false = aller, true = retour)', () => {
    const aller = calculateCommission(250_000, false)
    assert.equal(aller.commissionAmount, 75_000)
    assert.equal(aller.transporterAmount, 175_000)

    const retour = calculateCommission(250_000, true)
    assert.equal(retour.commissionAmount, 100_000)
    assert.equal(retour.transporterAmount, 150_000)
  })

  test('Avance paramétrable à 10 % par défaut', () => {
    const advance = calculateAdvance(100_000)
    assert.equal(advance.advancePercent, DEFAULT_ADVANCE_PERCENT)
    assert.equal(advance.advancePercent, 10)
    assert.equal(advance.advanceAmount, 10_000)
    assert.equal(advance.remainingBalance, 90_000)
  })

  test('Avance configurée à 15 %', () => {
    const advance = calculateAdvance(100_000, 15)
    assert.equal(advance.advancePercent, 15)
    assert.equal(advance.advanceAmount, 15_000)
    assert.equal(advance.remainingBalance, 85_000)
  })

  test('Borne stricte : une avance en dehors de 10-15 % est ramenée dans les bornes', () => {
    const tooLow = calculateAdvance(100_000, 5)
    assert.equal(tooLow.advancePercent, ADVANCE_MIN_PERCENT)
    assert.equal(tooLow.advanceAmount, 10_000)

    const tooHigh = calculateAdvance(100_000, 25)
    assert.equal(tooHigh.advancePercent, ADVANCE_MAX_PERCENT)
    assert.equal(tooHigh.advanceAmount, 15_000)
  })

  test('Décomposition financière complète — Trajet Aller (100 000 FCFA, 10 % avance)', () => {
    const full = calculateFullMissionEconomics(100_000, 'outbound', 10)
    assert.equal(full.grossAmount, 100_000)
    assert.equal(full.commissionAmount, 30_000)
    assert.equal(full.advanceAmount, 10_000)
    assert.equal(full.transporterGrossAmount, 70_000)
    // Solde final après déduction de l'avance déjà perçue : 70 000 - 10 000 = 60 000 FCFA
    assert.equal(full.transporterFinalSolde, 60_000)
  })

  test('Décomposition financière complète — Trajet Retour (100 000 FCFA, 10 % avance)', () => {
    const full = calculateFullMissionEconomics(100_000, 'return_cargo', 10)
    assert.equal(full.grossAmount, 100_000)
    assert.equal(full.commissionAmount, 40_000)
    assert.equal(full.advanceAmount, 10_000)
    assert.equal(full.transporterGrossAmount, 60_000)
    // Solde final après déduction de l'avance : 60 000 - 10 000 = 50 000 FCFA
    assert.equal(full.transporterFinalSolde, 50_000)
  })
})

describe('ÉLÉMENT 1 — Abonnement 30 000 FCFA / mois', () => {
  test('Le montant mensuel unitaire est exactement de 30 000 FCFA', () => {
    assert.equal(MONTHLY_SUBSCRIPTION_AMOUNT, 30_000)
  })
})

describe('ÉLÉMENT 8 — Permissions et Contrôle d’Accès Frontend', () => {
  test('Rôle Admin peut accéder à toutes les routes protégées', () => {
    assert.equal(canAccessRoute('admin', '/admin'), true)
    assert.equal(canAccessRoute('admin', '/chargeur'), true)
    assert.equal(canAccessRoute('admin', '/proprietaire'), true)
    assert.equal(canAccessRoute('admin', '/chauffeur'), true)
    assert.equal(canAccessRoute('admin', '/missions'), true)
    assert.equal(canAccessRoute('admin', '/abonnement'), true)
  })

  test('Rôle Propriétaire est restreint aux espaces autorisés', () => {
    assert.equal(canAccessRoute('truck_owner', '/proprietaire'), true)
    assert.equal(canAccessRoute('truck_owner', '/missions'), true)
    assert.equal(canAccessRoute('truck_owner', '/abonnement'), true)
    assert.equal(canAccessRoute('truck_owner', '/admin'), false)
    assert.equal(canAccessRoute('truck_owner', '/chargeur'), false)
    assert.equal(canAccessRoute('truck_owner', '/chauffeur'), false)
  })

  test('Rôle Chauffeur est restreint à son espace et aux missions', () => {
    assert.equal(canAccessRoute('driver', '/chauffeur'), true)
    assert.equal(canAccessRoute('driver', '/missions'), true)
    assert.equal(canAccessRoute('driver', '/admin'), false)
    assert.equal(canAccessRoute('driver', '/chargeur'), false)
    assert.equal(canAccessRoute('driver', '/proprietaire'), false)
  })

  test('Rôle Chargeur est restreint à son espace', () => {
    assert.equal(canAccessRoute('shipper', '/chargeur'), true)
    assert.equal(canAccessRoute('shipper', '/missions'), true)
    assert.equal(canAccessRoute('shipper', '/admin'), false)
    assert.equal(canAccessRoute('shipper', '/proprietaire'), false)
    assert.equal(canAccessRoute('shipper', '/chauffeur'), false)
  })

  test('Redirections par défaut par rôle', () => {
    assert.equal(getDefaultRouteForRole('truck_owner'), '/proprietaire')
    assert.equal(getDefaultRouteForRole('driver'), '/chauffeur')
    assert.equal(getDefaultRouteForRole('shipper'), '/chargeur')
    assert.equal(getDefaultRouteForRole('admin'), '/admin')
  })
})

describe('ÉLÉMENT 12 & 15 — Cycle Opérationnel Strict et Émargement POD Obligatoire', () => {
  const dummyMission: Mission = {
    id: 'test-mission-1',
    missionCode: 'TC-TEST-001',
    opportunityId: 'opp-1',
    truckId: 'truck-1',
    truckMatricule: 'DK-2024-AA',
    truckType: 'Plateau 30T',
    driverId: 'driver-1',
    driverName: 'Ibrahima Fall',
    ownerId: 'owner-1',
    ownerName: 'Transport Teranga Express',
    origin: 'Dakar Port',
    destination: 'Touba Gare',
    cargo: 'Ciment en sacs',
    departureDate: '2026-10-01',
    estimatedPrice: '150 000 FCFA',
    estimatedAmountFcfa: 150_000,
    status: 'in_progress',
    createdAt: '2026-09-28',
    tripType: 'outbound',
    timeline: [],
    tracking: {
      currentStatus: 'not_started',
      steps: [
        { id: 'pickup', stepNumber: 1, label: 'Prise en charge', isCompleted: false },
        { id: 'in_transit', stepNumber: 2, label: 'En route', isCompleted: false },
        { id: 'arrival', stepNumber: 3, label: 'Arrivée', isCompleted: false },
        { id: 'delivery', stepNumber: 4, label: 'Livraison', isCompleted: false },
      ],
      history: [],
    },
  }

  test('Impossible de passer directement à la livraison sans prise en charge préalable', () => {
    const pickupCheck = canPerformOperationalStep(dummyMission, 'pickup')
    assert.equal(pickupCheck.allowed, true)

    const deliveryCheck = canPerformOperationalStep(dummyMission, 'delivery')
    assert.equal(deliveryCheck.allowed, false)
    assert.ok(deliveryCheck.reason)
  })

  test('Génération d’un code de récépissé / BL conforme pour POD', () => {
    const code = generateDeliveryReceiptCode('TC-DK-001')
    assert.match(code, /^BL-TCDK001-\d{4}$/)
  })
})
