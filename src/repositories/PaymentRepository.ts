import type { PaymentRecord } from '../types'
import { STORAGE_KEYS, loadFromStorage, saveToStorage } from '../lib/storage'

export const INITIAL_DEMO_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay-demo-1',
    reference: 'PAY-SUB-2026-001',
    amount: 30000,
    currency: 'FCFA',
    type: 'subscription',
    relatedEntityId: 'sub-demo-1',
    status: 'successful',
    provider: 'wave',
    providerTransactionId: 'WV-SIM-849204',
    payerName: 'Mamadou Diop',
    payerPhone: '+221 77 123 45 67',
    createdAt: '15 septembre 2026 — 10:15',
    completedAt: '15 septembre 2026 — 10:16',
    isSimulated: true,
  },
  {
    id: 'pay-demo-2',
    reference: 'PAY-FUND-MSN-01',
    amount: 350000,
    currency: 'FCFA',
    type: 'mission_funding',
    relatedEntityId: 'mission-demo-1',
    status: 'successful',
    provider: 'orange_money',
    providerTransactionId: 'OM-SIM-391823',
    payerName: 'SOCOCIM Industries',
    payerPhone: '+221 78 555 44 33',
    createdAt: '24 septembre 2026 — 08:30',
    completedAt: '24 septembre 2026 — 08:32',
    isSimulated: true,
  },
  {
    id: 'pay-demo-3',
    reference: 'PAY-ADV-MSN-03',
    amount: 57600,
    currency: 'FCFA',
    type: 'advance',
    relatedEntityId: 'mission-demo-3',
    status: 'successful',
    provider: 'mock',
    providerTransactionId: 'SIM-ADV-9021',
    payerName: 'Teranga Connect Trésorerie',
    createdAt: '26 septembre 2026 — 11:00',
    completedAt: '26 septembre 2026 — 11:01',
    isSimulated: true,
  },
  {
    id: 'pay-demo-4',
    reference: 'PAY-SETTLE-MSN-01',
    amount: 210000,
    currency: 'FCFA',
    type: 'settlement',
    relatedEntityId: 'stl-demo-1',
    status: 'successful',
    provider: 'wave',
    providerTransactionId: 'WV-SIM-119283',
    payerName: 'Teranga Connect Escrow',
    createdAt: '25 septembre 2026 — 18:00',
    completedAt: '25 septembre 2026 — 18:02',
    isSimulated: true,
  },
]

export class PaymentRepository {
  getPayments(): PaymentRecord[] {
    return loadFromStorage<PaymentRecord[]>(
      STORAGE_KEYS.PAYMENTS,
      INITIAL_DEMO_PAYMENTS
    )
  }

  savePayments(payments: PaymentRecord[]): boolean {
    return saveToStorage(STORAGE_KEYS.PAYMENTS, payments)
  }

  addPayment(record: PaymentRecord): PaymentRecord[] {
    const list = this.getPayments()
    const updated = [record, ...list]
    this.savePayments(updated)
    return updated
  }
}

export const paymentRepository = new PaymentRepository()
