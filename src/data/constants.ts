import type { SystemHealth } from '../types'

export const APP_CONFIG = {
  name: 'Teranga Connect',
  tagline: 'Réseau intelligent de fret et de transport logistique',
  description:
    'Plateforme destinée à faciliter la mise en relation entre propriétaires de camions et chauffeurs et à réduire les retours à vide.',
  phase: 'Phase 1 — Initialisation du socle technique',
  version: '1.0.0-phase1',
} as const

export const SYSTEM_HEALTH_DEFAULT: SystemHealth = {
  projectName: APP_CONFIG.name,
  status: 'operational',
  version: APP_CONFIG.version,
  phase: APP_CONFIG.phase,
  environment: 'development',
  checkedAt: new Date().toISOString(),
}

/**
 * Pôles logistiques clés du Sénégal pour les futures phases de routage.
 */
export const SENEGAL_LOGISTICS_HUBS = [
  { city: 'Dakar', role: 'Port Autonome & Principal centre de chargement' },
  { city: 'Thiès', role: 'Carrefour ferroviaire et routier national' },
  { city: 'Kaolack', role: 'Hub de transit sous-régional (Mali, Gambie)' },
  { city: 'Touba', role: 'Grand centre de distribution intérieure' },
  { city: 'Saint-Louis', role: 'Pôle agro-industriel & liaison nord' },
  { city: 'Tambacounda', role: 'Corridor stratégique Dakar - Bamako' },
  { city: 'Kidira', role: 'Poste frontière et transit transfrontalier' },
] as const

export const TECH_STACK_MODULES = [
  {
    name: 'Vite 8 & React 19',
    description: 'Compilation ultra-rapide et moteur d’interface réactif de dernière génération',
    status: 'Validé',
  },
  {
    name: 'TypeScript Strict',
    description: 'Typage statique rigoureux pour une maintenabilité et une sécurité sans compromis',
    status: 'Actif',
  },
  {
    name: 'Tailwind CSS v4',
    description: 'Système de design haute performance avec palette adaptée et responsive',
    status: 'Configuré',
  },
  {
    name: 'Lucide React',
    description: 'Iconographie vectorielle cohérente et professionnelle sans emojis',
    status: 'Opérationnel',
  },
] as const
