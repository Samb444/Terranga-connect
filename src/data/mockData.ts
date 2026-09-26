import type { Truck, Driver, Owner, Opportunity, Trip, TruckCategory } from '../types'

/**
 * Libellés d'affichage pour les catégories de camions
 */
export const TRUCK_CATEGORIES: { value: TruckCategory; label: string }[] = [
  { value: 'plateau', label: 'Plateau / Porte-conteneur' },
  { value: 'benne', label: 'Benne (agrégats, minerais)' },
  { value: 'citerne', label: 'Citerne (liquides, carburant)' },
  { value: 'fourgon', label: 'Fourgon fermé / Caisse' },
  { value: 'frigorifique', label: 'Frigorifique (température dirigée)' },
  { value: 'porte_engins', label: 'Porte-engins (convoi lourd)' },
]

/**
 * Principales villes et hubs logistiques sénégalais pour les filtres et formulaires
 */
export const SENEGAL_CITIES = [
  'Dakar',
  'Thiès',
  'Kaolack',
  'Touba',
  'Saint-Louis',
  'Tambacounda',
  'Mbour',
  'Ziguinchor',
  'Fatick',
  'Diourbel',
  'Kédougou',
  'Matam',
  'Kidira',
] as const

/**
 * Profil propriétaire pour la démonstration
 */
export const MOCK_OWNER: Owner = {
  id: 'owner-demo-1',
  fullName: 'Mamadou Diop',
  companyName: 'Transports Teranga Fret SARL',
  phone: '+221 77 *** ** 89',
  city: 'Dakar (Zone Industrielle)',
  truckCount: 3,
  activeMissionsCount: 1,
  isDemo: true,
}

/**
 * Profil chauffeur pour la démonstration
 */
export const MOCK_DRIVER: Driver = {
  id: 'driver-demo-1',
  fullName: 'Ibrahima Ndiaye',
  phone: '+221 77 *** ** 42',
  licenseType: 'Permis C/E (Poids Lourd + Remorque)',
  experienceYears: 8,
  isVerified: true,
  rating: 4.9,
  status: 'available',
  currentCity: 'Dakar',
  preferredCorridors: ['Dakar - Thiès', 'Dakar - Kaolack', 'Dakar - Touba'],
  tripsCompleted: 142,
  isDemo: true,
}

/**
 * Liste des camions de démonstration du propriétaire
 * NB : Les immatriculations sont fictives et masquées pour préserver l'anonymat.
 */
export const MOCK_TRUCKS: Truck[] = [
  {
    id: 'truck-demo-1',
    matricule: 'DK-****-A1 [Fictif]',
    category: 'plateau',
    categoryLabel: 'Porteur Plateau',
    tonnageCapacity: 15,
    ownerId: 'owner-demo-1',
    status: 'available',
    currentCity: 'Dakar (Zone Portuaire)',
    lastLocationUpdate: 'Aujourd’hui à 08:30 (Simulation)',
    brandModel: 'Renault Trucks D-Wide 280',
    isDemo: true,
  },
  {
    id: 'truck-demo-2',
    matricule: 'DK-****-B2 [Fictif]',
    category: 'benne',
    categoryLabel: 'Semi-remorque Benne',
    tonnageCapacity: 30,
    ownerId: 'owner-demo-1',
    status: 'in_transit',
    currentCity: 'Thiès (Axe Carrières)',
    lastLocationUpdate: 'Aujourd’hui à 10:15 (Simulation)',
    brandModel: 'Mercedes-Benz Actros 3340',
    isDemo: true,
  },
  {
    id: 'truck-demo-3',
    matricule: 'DK-****-C3 [Fictif]',
    category: 'fourgon',
    categoryLabel: 'Fourgon Caisse Tôlée',
    tonnageCapacity: 10,
    ownerId: 'owner-demo-1',
    status: 'available',
    currentCity: 'Kaolack (Hub Transit)',
    lastLocationUpdate: 'Hier à 17:45 (Simulation)',
    brandModel: 'Volvo FL 250',
    isDemo: true,
  },
]

/**
 * Liste des opportunités de transport de fret de démonstration
 */
export const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-demo-1',
    title: 'Acheminement produits conditionnés & quincaillerie',
    origin: 'Dakar',
    destination: 'Thiès',
    distanceKm: 70,
    departureDate: 'Départ dans 24h (Indicatif)',
    cargoType: 'Produits manufacturés conditionnés',
    weightTons: 10,
    truckCategoryRequired: 'plateau',
    truckCategoryLabel: 'Porteur Plateau',
    status: 'available',
    isReturnTrip: false,
    estimatedPrice: '180 000 FCFA (Indicatif)',
    description:
      'Chargement au Port Autonome de Dakar, livraison zone commerciale de Thiès. Manutention par transpalette sur quai.',
    indicativeConditions: [
      'Bâchage complet obligatoire',
      'Assurance fret en règle',
      'Horaires de livraison stricts : 08h00 - 16h00',
    ],
    badgeNotice: 'Démonstration',
    createdAt: '2026-09-26',
    publishedBy: 'Grossiste Agro-Industriel',
  },
  {
    id: 'opp-demo-2',
    title: 'Transport matériaux de construction & ciment',
    origin: 'Dakar',
    destination: 'Kaolack',
    distanceKm: 192,
    departureDate: 'Sous 48h (Indicatif)',
    cargoType: 'Sacs de ciment et armatures métalliques',
    weightTons: 28,
    truckCategoryRequired: 'plateau',
    truckCategoryLabel: 'Semi-remorque Plateau',
    status: 'available',
    isReturnTrip: false,
    estimatedPrice: '380 000 FCFA (Indicatif)',
    description:
      'Mission directe vers dépôt logistique à Kaolack. Poids lourd avec sangles d’arrimage certifiées requis.',
    indicativeConditions: [
      'Certificat d’arrimage conforme',
      'Protocole d’accès aux carrières/usines',
      'Péages à la charge de la mission',
    ],
    badgeNotice: 'Démonstration',
    createdAt: '2026-09-25',
    publishedBy: 'Centrale Matériaux Ouest',
  },
  {
    id: 'opp-demo-3',
    title: 'Retour à vide optimisé : Basalte & agrégats concassés',
    origin: 'Thiès',
    destination: 'Dakar',
    distanceKm: 70,
    departureDate: 'Flexible sous 24-48h',
    cargoType: 'Agrégats de carrière & gravier',
    weightTons: 25,
    truckCategoryRequired: 'benne',
    truckCategoryLabel: 'Benne basculante',
    status: 'available',
    isReturnTrip: true, // Opportunité de retour
    estimatedPrice: '160 000 FCFA (Tarif Retour)',
    description:
      'Opportunité idéale pour rentabiliser le retour vers Dakar après une livraison vers Thiès ou Diass. Chargement rapide en carrière.',
    indicativeConditions: [
      'Benne étanche avec bâche anti-poussière',
      'Pesée électronique sur pont-bascule départ et arrivée',
    ],
    badgeNotice: 'Démonstration',
    createdAt: '2026-09-26',
    publishedBy: 'Carrières du Rail Thiès',
  },
  {
    id: 'opp-demo-4',
    title: 'Distribution denrées alimentaires et épicerie',
    origin: 'Dakar',
    destination: 'Touba',
    distanceKm: 194,
    departureDate: 'Départ prévu mardi matin',
    cargoType: 'Cartons alimentaires et boissons',
    weightTons: 10,
    truckCategoryRequired: 'fourgon',
    truckCategoryLabel: 'Fourgon Caisse Tôlée',
    status: 'available',
    isReturnTrip: false,
    estimatedPrice: '260 000 FCFA (Indicatif)',
    description:
      'Approvisionnement hebdomadaire de grossistes au marché Ocass de Touba. Véhicule sécurisé et fermé indispensable.',
    indicativeConditions: [
      'Caisse propre et exempte d’humidité',
      'Plombage au départ de Dakar',
    ],
    badgeNotice: 'Démonstration',
    createdAt: '2026-09-25',
    publishedBy: 'DistriTouba Fret',
  },
  {
    id: 'opp-demo-5',
    title: 'Retour à vide optimisé : Arachides en sacs et graines',
    origin: 'Kaolack',
    destination: 'Dakar',
    distanceKm: 192,
    departureDate: 'Fin de semaine (Indicatif)',
    cargoType: 'Sacs d’arachides sélectionnées',
    weightTons: 20,
    truckCategoryRequired: 'plateau',
    truckCategoryLabel: 'Porteur ou Semi Plateau',
    status: 'available',
    isReturnTrip: true, // Opportunité de retour
    estimatedPrice: '290 000 FCFA (Tarif Retour)',
    description:
      'Chargement coopérative bassin arachidier vers les unités de transformation à Dakar-Pikine. Évite le retour à vide.',
    indicativeConditions: [
      'Bâche propre indispensable (denrée sensible)',
      'Déchargement direct en usine',
    ],
    badgeNotice: 'Démonstration',
    createdAt: '2026-09-24',
    publishedBy: 'Union Bassin Kaolack',
  },
  {
    id: 'opp-demo-6',
    title: 'Liaison Nord : Matériel de télécom & tuyaux',
    origin: 'Dakar',
    destination: 'Saint-Louis',
    distanceKm: 260,
    departureDate: 'Jeudi (Indicatif)',
    cargoType: 'Bobines de fibre et tuyaux PVC',
    weightTons: 14,
    truckCategoryRequired: 'plateau',
    truckCategoryLabel: 'Plateau avec ranchers',
    status: 'available',
    isReturnTrip: false,
    estimatedPrice: '390 000 FCFA (Indicatif)',
    description:
      'Transport technique vers le chantier régional de Saint-Louis. Ranchers latéraux indispensables pour stabiliser les fardeaux.',
    indicativeConditions: [
      'Équipement EPI chauffeur obligatoire sur site',
      'Contrôle géométrique de la charge',
    ],
    badgeNotice: 'Démonstration',
    createdAt: '2026-09-24',
    publishedBy: 'InfraNord Sénégal',
  },
  {
    id: 'opp-demo-7',
    title: 'Retour à vide optimisé : Balles de coton & artisanat',
    origin: 'Tambacounda',
    destination: 'Dakar',
    distanceKm: 460,
    departureDate: 'Dans 3 jours (Flexible)',
    cargoType: 'Balles de coton compactées',
    weightTons: 22,
    truckCategoryRequired: 'fourgon',
    truckCategoryLabel: 'Fourgon ou Plateau bâché',
    status: 'available',
    isReturnTrip: true, // Opportunité de retour
    estimatedPrice: '520 000 FCFA (Tarif Retour Longue Distance)',
    description:
      'Long trajet corridor Est. Opportunité majeure pour compenser le retour vers la capitale après déchargement à Tamba.',
    indicativeConditions: [
      'Chauffeur expérimenté longue distance',
      'Camion contrôlé techniquement pour parcours sahélien',
    ],
    badgeNotice: 'Démonstration',
    createdAt: '2026-09-23',
    publishedBy: 'Cotonnière Orientale',
  },
]

/**
 * Liste des trajets et missions de démonstration
 */
export const MOCK_TRIPS: Trip[] = [
  {
    id: 'trip-demo-1',
    tripCode: 'TRIP-DK-KLK-01',
    origin: 'Dakar',
    destination: 'Kaolack',
    truckId: 'truck-demo-2',
    truckMatricule: 'DK-****-B2 [Fictif]',
    truckCategoryLabel: 'Semi-remorque Benne',
    driverName: 'Ibrahima Ndiaye',
    cargo: 'Ciment et agrégats',
    weightTons: 28,
    status: 'in_transit',
    departureDate: '2026-09-26 à 07:00',
    estimatedArrival: '2026-09-26 à 13:30',
    isReturnTrip: false,
    isDemo: true,
  },
  {
    id: 'trip-demo-2',
    tripCode: 'TRIP-THS-DK-02',
    origin: 'Thiès',
    destination: 'Dakar',
    truckId: 'truck-demo-1',
    truckMatricule: 'DK-****-A1 [Fictif]',
    truckCategoryLabel: 'Porteur Plateau',
    driverName: 'Moussa Sall',
    cargo: 'Basalte concassé (Retour optimisé)',
    weightTons: 15,
    status: 'scheduled',
    departureDate: '2026-09-27 à 08:00',
    estimatedArrival: '2026-09-27 à 10:30',
    isReturnTrip: true,
    isDemo: true,
  },
  {
    id: 'trip-demo-3',
    tripCode: 'TRIP-DK-TOU-03',
    origin: 'Dakar',
    destination: 'Touba',
    truckId: 'truck-demo-3',
    truckMatricule: 'DK-****-C3 [Fictif]',
    truckCategoryLabel: 'Fourgon Caisse Tôlée',
    driverName: 'Cheikh Diallo',
    cargo: 'Farine & sucre en sacs',
    weightTons: 10,
    status: 'completed',
    departureDate: '2026-09-24 à 06:00',
    estimatedArrival: '2026-09-24 à 12:00',
    isReturnTrip: false,
    isDemo: true,
  },
]
