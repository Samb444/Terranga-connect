import { useState } from 'react'
import type { SystemHealth } from '../types'
import { SYSTEM_HEALTH_DEFAULT } from '../data/constants'

/**
 * Hook retournant l'état technique de santé de l'application.
 */
export function useSystemStatus(): {
  health: SystemHealth
  isReady: boolean
  lastChecked: string
} {
  const [health] = useState<SystemHealth>(SYSTEM_HEALTH_DEFAULT)

  return {
    health,
    isReady: true,
    lastChecked: health.checkedAt,
  }
}
