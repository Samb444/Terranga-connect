/**
 * Types et interfaces pour Teranga Connect - Phase 3
 * Plateforme de fret routier et mise en relation camions - chauffeurs - opportunités
 */

export type UserRole = 'truck_owner' | 'driver' | 'dispatcher' | 'admin'

/**
 * Types de véhicules de fret courants au Sénégal et dans la sous-région
 */
export type TruckCategory =
  | 'plateau' // Plateau (conteneurs, fers, sacs, matériaux)
  | 'benne' // Benne (sable, basalte, agrégats miniers)
  | 'citerne' // Citerne (hydrocarbures, eau)
  | 'fourgon' // Fourgon fermé / caisse tôlée
  | 'frigorifique' // Transport sous température dirigée (poisson, fruits)
  | 'porte_engins' // Transport exceptionnel / engins TP

/**
 * Statut opérationnel d'un camion
 */
export type VehicleStatus = 'available' | 'in_transit' | 'maintenance' | 'offline'

/**
 * Structure d'un camion de démonstration
 */
export interface Truck {
  id: string
  matricule: string // Exemple : "DK-****-AB [Fictif]"
  category: TruckCategory
  categoryLabel: string
  tonnageCapacity: number
  ownerId: string
  status: VehicleStatus
  currentCity: string
  lastLocationUpdate: string
  brandModel: string
  isDemo: boolean
}

/**
 * Structure d'un chauffeur professionnel
 */
export interface Driver {
  id: string
  fullName: string
  phone: string
  licenseType: string
  experienceYears: number
  isVerified: boolean
  rating: number
  status: 'available' | 'unavailable'
  currentCity: string
  preferredCorridors: string[]
  tripsCompleted: number
  isDemo: boolean
}

/**
 * Structure d'un propriétaire de camion
 */
export interface Owner {
  id: string
  fullName: string
  companyName: string
  phone: string
  city: string
  truckCount: number
  activeMissionsCount: number
  isDemo: boolean
}

/**
 * Statut d'une opportunité de fret
 */
export type OpportunityStatus = 'available' | 'in_progress' | 'completed'

/**
 * Structure représentative d'une opportunité de transport
 */
export interface Opportunity {
  id: string
  title: string
  origin: string
  destination: string
  distanceKm: number
  departureDate: string
  cargoType: string
  weightTons: number
  truckCategoryRequired: TruckCategory
  truckCategoryLabel: string
  status: OpportunityStatus
  isReturnTrip: boolean // true si c'est une opportunité pour rentabiliser le retour à vide
  estimatedPrice?: string
  description: string
  indicativeConditions: string[]
  badgeNotice: string // Toujours "Démonstration"
  createdAt: string
  publishedBy?: string
}

/**
 * Structure représentative d'un trajet ou d'une mission en cours
 */
export interface Trip {
  id: string
  tripCode: string
  origin: string
  destination: string
  truckId: string
  truckMatricule: string
  truckCategoryLabel: string
  driverName: string
  cargo: string
  weightTons: number
  status: 'scheduled' | 'in_transit' | 'completed'
  departureDate: string
  estimatedArrival: string
  isReturnTrip: boolean
  isDemo: boolean
}

/**
 * Statut d'intégrité technique du système
 */
export interface SystemHealth {
  projectName: string
  status: 'operational' | 'degraded' | 'maintenance'
  version: string
  phase: string
  environment: 'development' | 'production'
  checkedAt: string
}
