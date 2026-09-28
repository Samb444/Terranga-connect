import type { Subscription } from '../types'
import { STORAGE_KEYS, loadFromStorage, saveToStorage } from '../lib/storage'

export const INITIAL_DEMO_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub-demo-1',
    userId: 'owner-demo-1',
    userRole: 'truck_owner',
    userName: 'Mamadou Diop Transport SARL',
    truckMatricule: 'DK-2024-TR [Fictif]',
    plan: 'monthly_truck',
    amount: 30000,
    currency: 'FCFA',
    status: 'active',
    startedAt: '15 septembre 2026',
    expiresAt: '15 octobre 2026',
    paymentStatus: 'paid',
    paymentProvider: 'Wave (Simulé)',
    createdAt: '15 septembre 2026',
    renewalCount: 3,
  },
  {
    id: 'sub-demo-2',
    userId: 'driver-demo-1',
    userRole: 'driver',
    userName: 'Ibrahima Ndiaye',
    truckMatricule: 'TH-5412-B [Fictif]',
    plan: 'monthly_truck',
    amount: 30000,
    currency: 'FCFA',
    status: 'pending',
    startedAt: undefined,
    expiresAt: undefined,
    paymentStatus: 'pending',
    paymentProvider: 'Orange Money (Simulé)',
    createdAt: '26 septembre 2026',
    renewalCount: 0,
  },
  {
    id: 'sub-demo-3',
    userId: 'owner-demo-2',
    userRole: 'truck_owner',
    userName: 'Transport Express Baol',
    truckMatricule: 'KL-3390-C [Fictif]',
    plan: 'monthly_truck',
    amount: 30000,
    currency: 'FCFA',
    status: 'expired',
    startedAt: '10 août 2026',
    expiresAt: '10 septembre 2026',
    paymentStatus: 'paid',
    paymentProvider: 'Wave (Simulé)',
    createdAt: '10 août 2026',
    renewalCount: 1,
  },
]

export class SubscriptionRepository {
  getSubscriptions(): Subscription[] {
    return loadFromStorage<Subscription[]>(
      STORAGE_KEYS.SUBSCRIPTIONS,
      INITIAL_DEMO_SUBSCRIPTIONS
    )
  }

  saveSubscriptions(subs: Subscription[]): boolean {
    return saveToStorage(STORAGE_KEYS.SUBSCRIPTIONS, subs)
  }

  getUserSubscription(userId: string): Subscription | undefined {
    return this.getSubscriptions().find((s) => s.userId === userId)
  }

  upsertSubscription(sub: Subscription): Subscription[] {
    const list = this.getSubscriptions()
    const index = list.findIndex((s) => s.id === sub.id || s.userId === sub.userId)

    let updated: Subscription[]
    if (index >= 0) {
      updated = [...list]
      updated[index] = sub
    } else {
      updated = [sub, ...list]
    }

    this.saveSubscriptions(updated)
    return updated
  }
}

export const subscriptionRepository = new SubscriptionRepository()
