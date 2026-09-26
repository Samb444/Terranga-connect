import type { SystemHealth } from '../types'

export const APP_CONFIG = {
  name: 'Teranga Connect',
  tagline: 'Connecter les camions aux opportunités',
  description:
    'Teranga Connect facilite la mise en relation entre propriétaires de camions et chauffeurs afin d’optimiser les trajets et de réduire les retours à vide.',
  statusNotice: 'Prototype frontend démonstratif & simulation métier',
  phase: 'Phase 8 — Finalisation & Durcissement du prototype',
  version: '8.0.0-phase8',
} as const

export const SYSTEM_HEALTH_DEFAULT: SystemHealth = {
  projectName: APP_CONFIG.name,
  status: 'operational',
  version: APP_CONFIG.version,
  phase: APP_CONFIG.phase,
  environment: 'development',
  checkedAt: new Date().toISOString(),
}

export const NAV_LINKS = [
  { label: 'Accueil', href: '#accueil' },
  { label: 'Fonctionnement', href: '#fonctionnement' },
  { label: 'Propriétaires', href: '#proprietaires' },
  { label: 'Chauffeurs', href: '#chauffeurs' },
  { label: 'À propos', href: '#a-propos' },
] as const

export const PROBLEM_POINTS = [
  {
    title: 'Missions difficiles à identifier',
    description:
      'Trouver une mission correspondant au trajet et à la disponibilité peut prendre du temps.',
  },
  {
    title: 'Retours à vide',
    description:
      'Lorsqu’aucune mission n’est trouvée pour le retour, une partie du potentiel du trajet reste inutilisée.',
  },
  {
    title: 'Mise en relation dispersée',
    description:
      'Les informations peuvent être réparties entre plusieurs contacts et canaux.',
  },
] as const

export const SOLUTION_STEPS = [
  {
    step: 1,
    role: 'Propriétaire / Chauffeur',
    description: 'Inscription des profils et expression des besoins ou disponibilités de camions.',
  },
  {
    step: 2,
    role: 'Recherche d’une mission',
    description: 'Consultation ciblée des trajets, des axes de transport et des cargaisons à acheminer.',
  },
  {
    step: 3,
    role: 'Mise en relation',
    description: 'Échange direct et structuré entre le propriétaire du camion et le chauffeur disponible.',
  },
  {
    step: 4,
    role: 'Trajet',
    description: 'Exécution du transport convenu sur les corridors logistiques.',
  },
  {
    step: 5,
    role: 'Opportunité de retour',
    description: 'Anticipation d’un chargement sur le trajet retour afin d’éviter de rouler à vide.',
  },
] as const

export const HOW_IT_WORKS_STEPS = [
  {
    number: '01',
    title: 'Décrivez votre besoin',
    description:
      'Indiquez les caractéristiques du camion, le trajet envisagé, les dates de disponibilité et la nature du fret recherché.',
  },
  {
    number: '02',
    title: 'Identifiez une opportunité',
    description:
      'Consultez les correspondances de trajets aller et découvrez les missions possibles pour le trajet de retour.',
  },
  {
    number: '03',
    title: 'Entrez en contact',
    description:
      'Échangez directement entre professionnels afin de valider les modalités pratiques et les spécifications de la mission.',
  },
  {
    number: '04',
    title: 'Organisez le trajet',
    description:
      'Coordonnez l’acheminement des marchandises avec une visibilité renforcée sur chaque étape de la rotation.',
  },
] as const

export const OWNER_ADVANTAGES = [
  {
    title: 'Recherche d’opportunités',
    description: 'Accédez à une vue consolidée des demandes de transport adaptées à vos camions.',
    status: 'À venir',
  },
  {
    title: 'Identification de missions',
    description: 'Repérez plus rapidement les chargements correspondant à vos disponibilités de véhicules.',
    status: 'À venir',
  },
  {
    title: 'Meilleure exploitation des trajets',
    description: 'Limitez les temps d’immobilisation et rentabilisez les kilomètres parcourus.',
    status: 'À venir',
  },
  {
    title: 'Centralisation des informations',
    description: 'Retrouvez les détails de vos véhicules, chauffeurs associés et trajets au même endroit.',
    status: 'À venir',
  },
  {
    title: 'Suivi des opportunités',
    description: 'Suivez le statut de vos propositions et anticipez les chargements sur le trajet retour.',
    status: 'À venir',
  },
] as const

export const DRIVER_ADVANTAGES = [
  {
    title: 'Recherche de missions',
    description: 'Découvrez des missions correspondant précisément à votre localisation et vos dates de disponibilité.',
    status: 'À venir',
  },
  {
    title: 'Visibilité sur les opportunités',
    description: 'Bénéficiez d’une visibilité claire sur les offres de transport sans multiplier les intermédiaires informels.',
    status: 'À venir',
  },
  {
    title: 'Mise en relation directe',
    description: 'Connectez-vous directement avec les propriétaires de camions pour convenir des missions.',
    status: 'À venir',
  },
  {
    title: 'Informations liées aux trajets',
    description: 'Consultez en amont les détails des itinéraires, des charges et des consignes associées.',
    status: 'À venir',
  },
  {
    title: 'Optimisation potentielle des retours',
    description: 'Augmentez vos opportunités d’effectuer des trajets rentables tant à l’aller qu’au retour.',
    status: 'À venir',
  },
] as const

export const BUSINESS_MODEL_ITEMS = [
  {
    title: 'Commission à l’aller',
    rate: '30 %',
    detail: 'Commission envisagée sur les missions réalisées sur le trajet aller.',
  },
  {
    title: 'Commission au retour',
    rate: '40 %',
    detail: 'Commission envisagée sur les opportunités de fret identifiées pour le trajet retour.',
  },
  {
    title: 'Abonnement par camion',
    rate: '30 000 FCFA',
    detail: 'Abonnement mensuel envisagé par camion pour l’accès à la plateforme et aux services associés.',
  },
  {
    title: 'Avance carburant & péages',
    rate: '10 à 15 %',
    detail: 'Possibilité d’une avance carburant et péages envisagée, selon les conditions prévues.',
  },
] as const

export interface TrustPoint {
  title: string
  description: string
  isFuture?: boolean
}

export const TRUST_POINTS: TrustPoint[] = [
  {
    title: 'Informations structurées',
    description:
      'Fiches de missions standardisées détaillant clairement les trajets, tonnages et types de remorques requis.',
    isFuture: false,
  },
  {
    title: 'Profils professionnels',
    description:
      'Espaces dédiés pour les propriétaires et les chauffeurs afin de clarifier les compétences et le parc disponible.',
    isFuture: false,
  },
  {
    title: 'Transparence des échanges',
    description:
      'Modalités et conditions de mission partagées de manière claire et compréhensible avant tout engagement.',
    isFuture: false,
  },
  {
    title: 'Échanges entre les parties',
    description:
      'Canal de mise en relation favorisant un dialogue direct, fluide et respectueux entre les acteurs.',
    isFuture: false,
  },
  {
    title: 'Futurs mécanismes de vérification',
    description:
      'Procédures de validation des documents et d’habilitation progressive en cours de conception pour le déploiement opérationnel.',
    isFuture: true,
  },
]

export interface LogisticsHub {
  city: string
  role: string
}

export const SENEGAL_LOGISTICS_HUBS: LogisticsHub[] = [
  { city: 'Dakar', role: 'Port Autonome & Principal centre de chargement' },
  { city: 'Thiès', role: 'Carrefour ferroviaire et routier national' },
  { city: 'Kaolack', role: 'Hub de transit sous-régional (Mali, Gambie)' },
  { city: 'Touba', role: 'Grand centre de distribution intérieure' },
  { city: 'Saint-Louis', role: 'Pôle agro-industriel & liaison nord' },
  { city: 'Tambacounda', role: 'Corridor stratégique Dakar - Bamako' },
  { city: 'Kidira', role: 'Poste frontière et transit transfrontalier' },
]
