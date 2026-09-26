/**
 * Roles autorisés sur la plateforme Teranga Connect.
 */
export type UserRole = 'truck_owner' | 'driver' | 'dispatcher' | 'admin'

/**
 * Types de véhicules de transport de fret au Sénégal et en Afrique de l'Ouest.
 */
export type TruckCategory =
  | 'plateau' // Plateau (conteneurs, fers, matériaux)
  | 'benne' // Benne (sable, gravier, agrégats)
  | 'citerne' // Citerne (hydrocarbures, eau)
  | 'fourgon' // Fourgon fermé / caisse
  | 'frigorifique' // Transport sous température dirigée
  | 'porte_engins' // Transport spécial lourd

/**
 * Statut d'un camion ou d'un trajet.
 */
export type VehicleStatus = 'available' | 'in_transit' | 'maintenance' | 'offline'

/**
 * Structure représentative d'un camion (base de typage).
 */
export interface Truck {
  id: string
  matricule: string
  category: TruckCategory
  tonnageCapacity: number
  ownerId: string
  status: VehicleStatus
  currentCity: string
}

/**
 * Structure représentative d'un chauffeur professionnel.
 */
export interface Driver {
  id: string
  fullName: string
  phone: string
  licenseType: string
  experienceYears: number
  isVerified: boolean
  rating: number
}

/**
 * Statut d'intégrité technique du système.
 */
export interface SystemHealth {
  projectName: string
  status: 'operational' | 'degraded' | 'maintenance'
  version: string
  phase: string
  environment: 'development' | 'production'
  checkedAt: string
}
