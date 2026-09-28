/**
 * Service d'abstraction pour la persistance locale (localStorage)
 * Assure la tolérance aux pannes, la validation et la réinitialisation
 */

export const STORAGE_KEYS = {
  OWNER: 'tc_demo_owner_v5',
  DRIVER: 'tc_demo_driver_v5',
  SHIPPER: 'tc_demo_shipper_v5',
  TRUCKS: 'tc_demo_trucks_v5',
  OPPORTUNITIES: 'tc_demo_opportunities_v5',
  APPLICATIONS: 'tc_demo_applications_v5',
  MISSIONS: 'tc_demo_missions_v5',
  DRIVER_STATUS: 'tc_demo_driver_status_v5',
  NOTIFICATIONS: 'tc_demo_notifications_v5',
  ACTIVE_ROLE: 'tc_demo_active_role_v5',
  INTERESTED_IDS: 'tc_demo_interested_ids_v5',
  SUBSCRIPTIONS: 'tc_demo_subscriptions_v9',
  SETTLEMENTS: 'tc_demo_settlements_v9',
  PAYMENTS: 'tc_demo_payments_v9',
  FUEL_VOUCHERS: 'tc_demo_fuel_vouchers_v9',
  BUSINESS_INTRODUCERS: 'tc_demo_business_introducers_v9',
} as const

/**
 * Vérifie si le localStorage est accessible
 */
export function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const testKey = '__tc_storage_test__'
    window.localStorage.setItem(testKey, testKey)
    window.localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

/**
 * Charge une valeur depuis le localStorage avec valeur de repli en cas d'absence ou d'erreur
 */
export function loadFromStorage<T>(key: string, fallback: T): T {
  if (!isStorageAvailable()) return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw) as unknown

    // Vérification basique de consistance
    if (parsed === null || parsed === undefined) {
      return fallback
    }

    // Si le fallback est un tableau, le parsed doit être un tableau
    if (Array.isArray(fallback) && !Array.isArray(parsed)) {
      console.warn(`[Teranga Storage] Données corrompues pour ${key} (attendu tableau), restauration mock.`)
      return fallback
    }

    // Si le fallback est un objet non tableau
    if (typeof fallback === 'object' && fallback !== null && !Array.isArray(fallback)) {
      if (typeof parsed !== 'object' || Array.isArray(parsed)) {
        console.warn(`[Teranga Storage] Données corrompues pour ${key} (attendu objet), restauration mock.`)
        return fallback
      }
    }

    return parsed as T
  } catch (error) {
    console.warn(`[Teranga Storage] Échec lecture localStorage pour ${key}:`, error)
    return fallback
  }
}

/**
 * Sauvegarde une valeur dans le localStorage de manière sécurisée
 */
export function saveToStorage<T>(key: string, value: T): boolean {
  if (!isStorageAvailable()) return false
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.warn(`[Teranga Storage] Échec écriture localStorage pour ${key}:`, error)
    return false
  }
}

/**
 * Supprime une clé spécifique du localStorage
 */
export function removeFromStorage(key: string): void {
  if (!isStorageAvailable()) return
  try {
    window.localStorage.removeItem(key)
  } catch (error) {
    console.warn(`[Teranga Storage] Échec suppression pour ${key}:`, error)
  }
}

/**
 * Réinitialise toutes les clés de démonstration de Teranga Connect
 */
export function clearAllDemoStorage(): void {
  if (!isStorageAvailable()) return
  try {
    Object.values(STORAGE_KEYS).forEach((k) => {
      window.localStorage.removeItem(k)
    })
  } catch (error) {
    console.warn('[Teranga Storage] Échec réinitialisation globale du stockage:', error)
  }
}
