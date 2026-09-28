import type { UserRole } from '../types'

/**
 * ========================================================
 * SYSTÈME DE PERMISSIONS ET CONTRÔLE D'ACCÈS FRONTEND — PHASE 9
 * ========================================================
 * ⚠️ AVERTISSEMENT ARCHITECTURAL :
 * Authentification actuelle : mode prototype/local.
 * Authentification serveur avec JWT / sessions sécurisées et RBAC à implémenter avec le backend.
 */

export const AUTH_PROTOTYPE_DISCLAIMER =
  'Authentification actuelle : mode prototype/local. Authentification serveur à implémenter avec le backend.'

export interface RoutePermissionRule {
  pathPattern: RegExp
  allowedRoles: UserRole[]
  description: string
}

export const ROUTE_PERMISSIONS: RoutePermissionRule[] = [
  {
    pathPattern: /^\/admin(\/.*)?$/,
    allowedRoles: ['admin'],
    description: 'Console d’administration et supervision financière (Admin uniquement)',
  },
  {
    pathPattern: /^\/chargeur(\/.*)?$/,
    allowedRoles: ['shipper', 'admin'],
    description: 'Espace Donneur d’ordre / Chargeur',
  },
  {
    pathPattern: /^\/proprietaire(\/.*)?$/,
    allowedRoles: ['truck_owner', 'admin'],
    description: 'Espace Propriétaire de camions',
  },
  {
    pathPattern: /^\/chauffeur(\/.*)?$/,
    allowedRoles: ['driver', 'admin'],
    description: 'Espace Chauffeur indépendant',
  },
  {
    pathPattern: /^\/abonnement(\/.*)?$/,
    allowedRoles: ['truck_owner', 'driver', 'admin'],
    description: 'Souscription abonnement mensuel matériel (Transporteurs)',
  },
  {
    pathPattern: /^\/missions(\/.*)?$/,
    allowedRoles: ['truck_owner', 'driver', 'shipper', 'admin'],
    description: 'Suivi et exécution des missions de transport',
  },
  {
    pathPattern: /^\/profil(\/.*)?$/,
    allowedRoles: ['truck_owner', 'driver', 'shipper', 'admin'],
    description: 'Profil utilisateur',
  },
  {
    pathPattern: /^\/notifications(\/.*)?$/,
    allowedRoles: ['truck_owner', 'driver', 'shipper', 'admin'],
    description: 'Centre de notifications',
  },
  {
    pathPattern: /^\/opportunites(\/.*)?$/,
    allowedRoles: ['truck_owner', 'driver', 'shipper', 'admin'],
    description: 'Catalogue des offres de fret (Ouvert à tous les utilisateurs connectés)',
  },
  {
    pathPattern: /^\/$/,
    allowedRoles: ['truck_owner', 'driver', 'shipper', 'admin'],
    description: 'Page d’accueil publique',
  },
]

/**
 * Vérifie si le rôle actif peut accéder à un chemin donné
 */
export function canAccessRoute(role: UserRole, path: string): boolean {
  // L'administrateur a un accès superviseur complet
  if (role === 'admin') return true

  // Recherche de la première règle correspondant au chemin
  const matchingRule = ROUTE_PERMISSIONS.find((rule) => rule.pathPattern.test(path))

  // Si aucune règle spécifique ne restreint le chemin, accès accordé par défaut
  if (!matchingRule) {
    return true
  }

  return matchingRule.allowedRoles.includes(role)
}

/**
 * Retourne le libellé en français du rôle
 */
export function getRoleLabel(role: UserRole): string {
  switch (role) {
    case 'truck_owner':
      return 'Propriétaire de camions'
    case 'driver':
      return 'Chauffeur professionnel'
    case 'shipper':
      return 'Donneur d’ordre / Chargeur'
    case 'admin':
      return 'Administrateur système'
    default:
      return role
  }
}

/**
 * Retourne le dashboard par défaut pour un rôle donné
 */
export function getDefaultRouteForRole(role: UserRole): string {
  switch (role) {
    case 'truck_owner':
      return '/proprietaire'
    case 'driver':
      return '/chauffeur'
    case 'shipper':
      return '/chargeur'
    case 'admin':
      return '/admin'
    default:
      return '/'
  }
}
