/**
 * Types et interfaces pour Teranga Connect - Phase 3
 * Plateforme de fret routier et mise en relation camions - chauffeurs - opportunités
 */

export type UserRole = 'truck_owner' | 'driver' | 'shipper' | 'admin'

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
  memberSince?: string
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
  memberSince?: string
}

/**
 * Structure d'un donneur d'ordre / chargeur (Cimenteries, Import-Export, Coopératives Agricoles, BTP)
 */
export interface Shipper {
  id: string
  fullName: string
  companyName: string
  companyType: string
  phone: string
  city: string
  activeShipmentsCount: number
  totalShipmentsCount: number
  isDemo: boolean
  memberSince?: string
}

/**
 * Statut d'une opportunité de fret
 */
export type OpportunityStatus = 'available' | 'in_progress' | 'completed'

/**
 * Statut d'une candidature de chauffeur
 */
export type ApplicationStatus =
  | 'pending'
  | 'accepted'
  | 'confirmed'
  | 'rejected'
  | 'completed'
  | 'cancelled'

/**
 * Statut d'une mission de transport
 */
export type MissionStatus =
  | 'interest'
  | 'pending'
  | 'accepted'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'

/**
 * Type d'itinéraire
 */
export type TripType = 'one_way' | 'round_trip' | 'return_cargo'

/**
 * Candidature d'un chauffeur sur une opportunité
 */
export interface Application {
  id: string
  opportunityId: string
  opportunityTitle: string
  origin: string
  destination: string
  cargo: string
  truckType: string
  departureDate: string
  driverId: string
  driverName: string
  driverPhone: string
  driverExperience: string
  proposedTruck: string
  appliedAt: string
  status: ApplicationStatus
  notes?: string
  missionId?: string
  isDemo: boolean
}

/**
 * Étape dans la chronologie de la mission
 */
export interface MissionTimelineStep {
  id: string
  label: string
  description: string
  timestamp?: string
  status: 'completed' | 'current' | 'upcoming'
}

/**
 * Identifiant des étapes du suivi opérationnel - Phase 7
 */
export type OperationalStepId = 'pickup' | 'in_transit' | 'arrival' | 'delivery'

/**
 * Statut du suivi opérationnel d'une mission
 */
export type OperationalStatus =
  | 'not_started' // Suivi non actif (mission en attente ou acceptée non démarrée)
  | 'pending_pickup' // Mission démarrée, en attente de prise en charge
  | 'picked_up' // Prise en charge confirmée au départ
  | 'in_transit' // En route sur le corridor
  | 'arrived' // Arrivé au point de livraison
  | 'delivered' // Livraison confirmée et émargée

/**
 * Événement d'historique de suivi opérationnel
 */
export interface OperationalEvent {
  id: string
  step: OperationalStepId | 'created' | 'accepted' | 'started' | 'cancelled'
  label: string
  location?: string
  timestamp: string
  authorName?: string
  authorRole?: UserRole | 'system'
  notes?: string
}

/**
 * Attestation et confirmation de livraison
 */
export interface DeliveryConfirmation {
  confirmedAt: string
  confirmedBy: string
  signerName: string
  signerRole: string
  notes?: string
  receiptCode: string
}

/**
 * Modèle de suivi opérationnel complet pour une mission
 */
export interface MissionTracking {
  currentStatus: OperationalStatus
  pickedUpAt?: string
  inTransitAt?: string
  arrivedAt?: string
  deliveredAt?: string
  history: OperationalEvent[]
  deliveryConfirmation?: DeliveryConfirmation
}

/**
 * Structure complète d'une mission de transport
 */
export interface Mission {
  id: string
  missionCode: string
  opportunityId: string
  applicationId?: string
  shipperId?: string
  shipperName?: string
  ownerId: string
  ownerName: string
  driverId: string
  driverName: string
  driverPhone?: string
  truckId: string
  truckMatricule: string
  truckType: string
  title?: string
  description?: string
  opportunityTitle?: string
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  cargo: string
  tripType: TripType
  estimatedDistance: number
  estimatedPrice: string
  estimatedAmountFcfa: number
  commissionRate: number // ex: 0.30 pour 30%, 0.40 pour retour
  commissionAmountFcfa: number
  commissionLabel: string
  status: MissionStatus
  createdAt: string
  acceptedAt?: string
  startedAt?: string
  completedAt?: string
  cancelledAt?: string
  pickedUpAt?: string
  arrivedAt?: string
  deliveredAt?: string
  tracking?: MissionTracking
  timeline: MissionTimelineStep[]
  notes?: string
  isDemo: boolean
}

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

/**
 * Types de notifications applicatives
 */
export type NotificationType = 'application' | 'mission' | 'opportunity' | 'system'

/**
 * Structure d'une notification du centre de notifications
 */
export interface AppNotification {
  id: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  createdAt: string
  relatedId?: string
  link?: string
  targetRole?: 'truck_owner' | 'driver' | 'shipper' | 'admin' | 'all'
}

/**
 * Alias de compatibilité
 */
export type Notification = AppNotification

