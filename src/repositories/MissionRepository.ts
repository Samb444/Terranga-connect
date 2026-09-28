import type { Mission, Opportunity, Application } from '../types'
import { STORAGE_KEYS, loadFromStorage, saveToStorage } from '../lib/storage'
import { MOCK_MISSIONS, MOCK_OPPORTUNITIES, MOCK_APPLICATIONS } from '../data/mockData'

/**
 * Repository abstrayant les missions, opportunités et candidatures
 */
export class MissionRepository {
  getMissions(): Mission[] {
    return loadFromStorage<Mission[]>(STORAGE_KEYS.MISSIONS, MOCK_MISSIONS)
  }

  saveMissions(missions: Mission[]): boolean {
    return saveToStorage(STORAGE_KEYS.MISSIONS, missions)
  }

  getMissionById(id: string): Mission | undefined {
    return this.getMissions().find((m) => m.id === id)
  }

  updateMission(id: string, updates: Partial<Mission>): Mission | null {
    const list = this.getMissions()
    const index = list.findIndex((m) => m.id === id)
    if (index === -1) return null

    const updated = { ...list[index], ...updates }
    list[index] = updated
    this.saveMissions(list)
    return updated
  }

  // --- Opportunités ---
  getOpportunities(): Opportunity[] {
    return loadFromStorage<Opportunity[]>(STORAGE_KEYS.OPPORTUNITIES, MOCK_OPPORTUNITIES)
  }

  saveOpportunities(opps: Opportunity[]): boolean {
    return saveToStorage(STORAGE_KEYS.OPPORTUNITIES, opps)
  }

  // --- Candidatures ---
  getApplications(): Application[] {
    return loadFromStorage<Application[]>(STORAGE_KEYS.APPLICATIONS, MOCK_APPLICATIONS)
  }

  saveApplications(apps: Application[]): boolean {
    return saveToStorage(STORAGE_KEYS.APPLICATIONS, apps)
  }
}

export const missionRepository = new MissionRepository()
