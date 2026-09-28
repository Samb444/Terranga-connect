import type { Settlement } from '../types'
import { STORAGE_KEYS, loadFromStorage, saveToStorage } from '../lib/storage'

export const INITIAL_DEMO_SETTLEMENTS: Settlement[] = [
  {
    id: 'stl-demo-1',
    missionId: 'mission-demo-1',
    missionCode: 'MSN-DKR-TOU-01',
    grossAmount: 350000,
    advancePercent: 10,
    advanceAmount: 35000,
    commissionRate: 0.30,
    commissionAmount: 105000,
    transporterAmount: 245000,
    remainingBalance: 210000, // Part transporteur moins avance reçue
    status: 'settled',
    paymentProvider: 'Wave (Simulé)',
    fundedAt: '24 septembre 2026',
    advancePaidAt: '24 septembre 2026',
    deliveryConfirmedAt: '25 septembre 2026',
    settledAt: '25 septembre 2026',
    createdAt: '24 septembre 2026',
    notes: 'Règlement final transporteur soldé après émargement conforme.',
  },
  {
    id: 'stl-demo-2',
    missionId: 'mission-demo-2',
    missionCode: 'MSN-THI-DKR-02',
    grossAmount: 220000,
    advancePercent: 10,
    advanceAmount: 22000,
    commissionRate: 0.40, // Retour optimisé
    commissionAmount: 88000,
    transporterAmount: 132000,
    remainingBalance: 110000,
    status: 'settlement_pending',
    paymentProvider: 'Orange Money (Simulé)',
    fundedAt: '25 septembre 2026',
    advancePaidAt: '25 septembre 2026',
    deliveryConfirmedAt: '26 septembre 2026',
    createdAt: '25 septembre 2026',
    notes: 'Livraison réceptionnée avec émargement. En attente de déblocage du solde final par l’administration.',
  },
  {
    id: 'stl-demo-3',
    missionId: 'mission-demo-3',
    missionCode: 'MSN-DKR-KLK-03',
    grossAmount: 480000,
    advancePercent: 12,
    advanceAmount: 57600,
    commissionRate: 0.30,
    commissionAmount: 144000,
    transporterAmount: 336000,
    remainingBalance: 278400,
    status: 'advance_paid',
    paymentProvider: 'Wave (Simulé)',
    fundedAt: '26 septembre 2026',
    advancePaidAt: '26 septembre 2026',
    createdAt: '26 septembre 2026',
    notes: 'Mission financée par le chargeur. Avance carburant émise sous forme de bon numérique.',
  },
]

export class SettlementRepository {
  getSettlements(): Settlement[] {
    return loadFromStorage<Settlement[]>(
      STORAGE_KEYS.SETTLEMENTS,
      INITIAL_DEMO_SETTLEMENTS
    )
  }

  saveSettlements(settlements: Settlement[]): boolean {
    return saveToStorage(STORAGE_KEYS.SETTLEMENTS, settlements)
  }

  getSettlementByMissionId(missionId: string): Settlement | undefined {
    return this.getSettlements().find((s) => s.missionId === missionId)
  }

  upsertSettlement(settlement: Settlement): Settlement[] {
    const list = this.getSettlements()
    const index = list.findIndex(
      (s) => s.id === settlement.id || s.missionId === settlement.missionId
    )

    let updated: Settlement[]
    if (index >= 0) {
      updated = [...list]
      updated[index] = settlement
    } else {
      updated = [settlement, ...list]
    }

    this.saveSettlements(updated)
    return updated
  }
}

export const settlementRepository = new SettlementRepository()
