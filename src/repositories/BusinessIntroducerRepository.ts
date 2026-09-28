import type { BusinessIntroducer } from '../types'
import { STORAGE_KEYS, loadFromStorage, saveToStorage } from '../lib/storage'

export const INITIAL_DEMO_INTRODUCERS: BusinessIntroducer[] = [
  {
    id: 'intro-demo-1',
    name: 'El Hadji Malick Fall (Gare Routière Beaux Maraîchers)',
    phone: '+221 77 641 23 89',
    city: 'Pikine / Dakar',
    status: 'active',
    introducedMissions: 14,
    commissionStatus: 'Règles de commission à définir',
    notes: 'Intermédiaire historique gare routière. Apporteur de flux réguliers sur l’axe Dakar-Saint-Louis.',
    createdAt: '01 septembre 2026',
  },
  {
    id: 'intro-demo-2',
    name: 'Moussa Sarr (Syndicat Transporteurs Diamniadio)',
    phone: '+221 78 412 90 12',
    city: 'Diamniadio',
    status: 'active',
    introducedMissions: 8,
    commissionStatus: 'Règles de commission à définir',
    notes: 'Relais terrain auprès des chauffeurs de bennes et plateaux.',
    createdAt: '08 septembre 2026',
  },
  {
    id: 'intro-demo-3',
    name: 'Cheikh Tidiane Ba (Port Autonome de Dakar)',
    phone: '+221 76 991 34 50',
    city: 'Dakar Port',
    status: 'pending',
    introducedMissions: 2,
    commissionStatus: 'Règles de commission à définir',
    notes: 'En cours d’enrôlement et vérification d’identité.',
    createdAt: '22 septembre 2026',
  },
]

export class BusinessIntroducerRepository {
  getIntroducers(): BusinessIntroducer[] {
    return loadFromStorage<BusinessIntroducer[]>(
      STORAGE_KEYS.BUSINESS_INTRODUCERS,
      INITIAL_DEMO_INTRODUCERS
    )
  }

  saveIntroducers(introducers: BusinessIntroducer[]): boolean {
    return saveToStorage(STORAGE_KEYS.BUSINESS_INTRODUCERS, introducers)
  }

  addIntroducer(introducer: BusinessIntroducer): BusinessIntroducer[] {
    const list = this.getIntroducers()
    const updated = [introducer, ...list]
    this.saveIntroducers(updated)
    return updated
  }

  updateIntroducer(
    id: string,
    updates: Partial<BusinessIntroducer>
  ): BusinessIntroducer | null {
    const list = this.getIntroducers()
    const index = list.findIndex((i) => i.id === id)
    if (index === -1) return null

    const updated = { ...list[index], ...updates }
    list[index] = updated
    this.saveIntroducers(list)
    return updated
  }
}

export const businessIntroducerRepository = new BusinessIntroducerRepository()
