import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react'
import type {
  Truck,
  Driver,
  Owner,
  Opportunity,
  Trip,
  Application,
  Mission,
  AppNotification,
} from '../types'
import {
  MOCK_OWNER,
  MOCK_DRIVER,
  MOCK_TRUCKS,
  MOCK_OPPORTUNITIES,
  MOCK_TRIPS,
  MOCK_APPLICATIONS,
  MOCK_MISSIONS,
  MOCK_NOTIFICATIONS,
} from '../data/mockData'
import {
  calculateMissionEconomics,
  buildMissionTimeline,
} from '../lib/missionUtils'
import {
  STORAGE_KEYS,
  loadFromStorage,
  saveToStorage,
  clearAllDemoStorage,
} from '../lib/storage'

export interface TransportContextType {
  // Profils & Rôles
  owner: Owner
  driver: Driver
  activeRole: 'truck_owner' | 'driver'
  setActiveRole: (role: 'truck_owner' | 'driver') => void
  updateOwnerProfile: (updatedData: Partial<Owner>) => void
  updateDriverProfile: (updatedData: Partial<Driver>) => void

  // Données métier
  trucks: Truck[]
  opportunities: Opportunity[]
  trips: Trip[]
  applications: Application[]
  missions: Mission[]
  driverStatus: 'available' | 'unavailable'
  interestedOpportunityIds: string[]

  // Notifications
  notifications: AppNotification[]
  unreadNotificationsCount: number
  markNotificationAsRead: (id: string) => void
  markAllNotificationsAsRead: () => void
  clearNotifications: () => void
  addNotification: (
    notification: Omit<AppNotification, 'id' | 'createdAt' | 'read'>
  ) => AppNotification

  // Actions Chauffeur
  toggleDriverStatus: () => void
  setDriverStatus: (status: 'available' | 'unavailable') => void
  submitApplication: (opportunityId: string, notes?: string) => Application
  recordInterest: (opportunityId: string) => boolean
  isInterested: (opportunityId: string) => boolean

  // Actions Propriétaire
  addTruck: (newTruckData: {
    matricule: string
    category: Truck['category']
    categoryLabel: string
    tonnageCapacity: number
    brandModel: string
    currentCity: string
  }) => void
  publishOpportunity: (newOppData: {
    origin: string
    destination: string
    cargoType: string
    weightTons: number
    truckCategoryRequired: Opportunity['truckCategoryRequired']
    truckCategoryLabel: string
    departureDate: string
    description: string
    isReturnTrip?: boolean
  }) => Opportunity
  acceptApplication: (
    applicationId: string,
    truckId?: string
  ) => { application: Application; mission: Mission } | null
  rejectApplication: (applicationId: string, reason?: string) => boolean

  // Cycle Mission
  acceptMission: (missionId: string) => boolean
  confirmMission: (missionId: string) => boolean
  startMission: (missionId: string) => boolean
  completeMission: (missionId: string) => boolean
  cancelMission: (missionId: string, reason?: string) => boolean

  // Requêtes
  getMissionById: (missionId: string) => Mission | undefined
  getApplicationById: (applicationId: string) => Application | undefined

  // Réinitialisation globale de la démo
  resetDemoData: () => void
}

const TransportContext = createContext<TransportContextType | undefined>(undefined)

export const TransportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Chargement initial depuis le localStorage avec fallback gracieux sur les mocks
  const [owner, setOwner] = useState<Owner>(() =>
    loadFromStorage<Owner>(STORAGE_KEYS.OWNER, MOCK_OWNER)
  )

  const [driver, setDriver] = useState<Driver>(() =>
    loadFromStorage<Driver>(STORAGE_KEYS.DRIVER, MOCK_DRIVER)
  )

  const [activeRole, setActiveRoleState] = useState<'truck_owner' | 'driver'>(() =>
    loadFromStorage<'truck_owner' | 'driver'>(STORAGE_KEYS.ACTIVE_ROLE, 'truck_owner')
  )

  const [trucks, setTrucks] = useState<Truck[]>(() =>
    loadFromStorage<Truck[]>(STORAGE_KEYS.TRUCKS, MOCK_TRUCKS)
  )

  const [opportunities, setOpportunities] = useState<Opportunity[]>(() =>
    loadFromStorage<Opportunity[]>(STORAGE_KEYS.OPPORTUNITIES, MOCK_OPPORTUNITIES)
  )

  const [trips] = useState<Trip[]>(MOCK_TRIPS)

  const [applications, setApplications] = useState<Application[]>(() =>
    loadFromStorage<Application[]>(STORAGE_KEYS.APPLICATIONS, MOCK_APPLICATIONS)
  )

  const [missions, setMissions] = useState<Mission[]>(() =>
    loadFromStorage<Mission[]>(STORAGE_KEYS.MISSIONS, MOCK_MISSIONS)
  )

  const [driverStatus, setDriverStatusState] = useState<'available' | 'unavailable'>(() =>
    loadFromStorage<'available' | 'unavailable'>(STORAGE_KEYS.DRIVER_STATUS, 'available')
  )

  const [interestedOpportunityIds, setInterestedOpportunityIds] = useState<string[]>(() => {
    const defaultIds = Array.from(new Set(MOCK_APPLICATIONS.map((a) => a.opportunityId)))
    return loadFromStorage<string[]>(STORAGE_KEYS.INTERESTED_IDS, defaultIds)
  })

  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    loadFromStorage<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, MOCK_NOTIFICATIONS)
  )

  // Persistance automatique dans le localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.OWNER, owner)
  }, [owner])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.DRIVER, driver)
  }, [driver])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ACTIVE_ROLE, activeRole)
  }, [activeRole])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.TRUCKS, trucks)
  }, [trucks])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.OPPORTUNITIES, opportunities)
  }, [opportunities])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.APPLICATIONS, applications)
  }, [applications])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.MISSIONS, missions)
  }, [missions])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.DRIVER_STATUS, driverStatus)
  }, [driverStatus])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.INTERESTED_IDS, interestedOpportunityIds)
  }, [interestedOpportunityIds])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications)
  }, [notifications])

  // Rôle actif
  const setActiveRole = (role: 'truck_owner' | 'driver') => {
    setActiveRoleState(role)
  }

  // Mises à jour des profils avec persistance
  const updateOwnerProfile = (updatedData: Partial<Owner>) => {
    setOwner((prev) => ({
      ...prev,
      ...updatedData,
    }))
  }

  const updateDriverProfile = (updatedData: Partial<Driver>) => {
    setDriver((prev) => ({
      ...prev,
      ...updatedData,
    }))
  }

  // Gestion des notifications
  const addNotification = useCallback(
    (notifData: Omit<AppNotification, 'id' | 'createdAt' | 'read'>): AppNotification => {
      const newNotif: AppNotification = {
        ...notifData,
        id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        createdAt: 'À l’instant',
        read: false,
      }
      setNotifications((prev) => [newNotif, ...prev])
      return newNotif
    },
    []
  )

  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }, [])

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const clearNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length
  }, [notifications])

  // Chauffeur Disponibilité
  const toggleDriverStatus = () => {
    setDriverStatusState((prev) => {
      const nextStatus = prev === 'available' ? 'unavailable' : 'available'
      setDriver((d) => ({ ...d, status: nextStatus }))
      return nextStatus
    })
  }

  const setDriverStatus = (status: 'available' | 'unavailable') => {
    setDriverStatusState(status)
    setDriver((d) => ({ ...d, status }))
  }

  // Propriétaire Ajout Camion
  const addTruck = (newTruckData: {
    matricule: string
    category: Truck['category']
    categoryLabel: string
    tonnageCapacity: number
    brandModel: string
    currentCity: string
  }) => {
    const cleanMatricule = newTruckData.matricule.includes('[Fictif]')
      ? newTruckData.matricule
      : `${newTruckData.matricule} [Fictif]`

    const newTruck: Truck = {
      id: `truck-demo-${Date.now()}`,
      matricule: cleanMatricule,
      category: newTruckData.category,
      categoryLabel: newTruckData.categoryLabel,
      tonnageCapacity: Number(newTruckData.tonnageCapacity),
      ownerId: owner.id,
      status: 'available',
      currentCity: newTruckData.currentCity,
      lastLocationUpdate: 'Déclaré à l’instant (Démonstration)',
      brandModel: newTruckData.brandModel || 'Camion Démonstration',
      isDemo: true,
    }

    setTrucks((prev) => [newTruck, ...prev])
    setOwner((prev) => ({ ...prev, truckCount: prev.truckCount + 1 }))

    addNotification({
      type: 'system',
      title: 'Nouveau camion ajouté',
      message: `Le véhicule ${cleanMatricule} (${newTruckData.categoryLabel}) a été ajouté à votre flotte.`,
      targetRole: 'truck_owner',
      link: '/proprietaire',
    })
  }

  // Propriétaire Publication Opportunité
  const publishOpportunity = (newOppData: {
    origin: string
    destination: string
    cargoType: string
    weightTons: number
    truckCategoryRequired: Opportunity['truckCategoryRequired']
    truckCategoryLabel: string
    departureDate: string
    description: string
    isReturnTrip?: boolean
  }): Opportunity => {
    const isReturn =
      newOppData.isReturnTrip ??
      (newOppData.destination.toLowerCase() === 'dakar' &&
        newOppData.origin.toLowerCase() !== 'dakar')

    const newOpp: Opportunity = {
      id: `opp-demo-${Date.now()}`,
      title: `Transport de fret ${newOppData.cargoType} (${newOppData.origin} → ${newOppData.destination})`,
      origin: newOppData.origin,
      destination: newOppData.destination,
      distanceKm: 120,
      departureDate: newOppData.departureDate || 'Date à convenir (Démonstration)',
      cargoType: newOppData.cargoType,
      weightTons: Number(newOppData.weightTons),
      truckCategoryRequired: newOppData.truckCategoryRequired,
      truckCategoryLabel: newOppData.truckCategoryLabel,
      status: 'available',
      isReturnTrip: isReturn,
      estimatedPrice: 'Tarif indicatif à convenir',
      description: newOppData.description,
      indicativeConditions: [
        'Contrat type de fret Teranga Connect (Simulation)',
        'Assurance marchandise requise',
      ],
      badgeNotice: 'Démonstration',
      createdAt: new Date().toISOString().split('T')[0],
      publishedBy: owner.companyName,
    }

    setOpportunities((prev) => [newOpp, ...prev])

    // Notification système / chauffeur
    addNotification({
      type: 'opportunity',
      title: 'Nouvelle opportunité publiée',
      message: `Une opportunité de fret (${newOppData.origin} → ${newOppData.destination}, ${newOppData.weightTons}T) est disponible.`,
      relatedId: newOpp.id,
      link: `/opportunites/${newOpp.id}`,
      targetRole: 'driver',
    })

    return newOpp
  }

  // Chauffeur Candidature / Intérêt
  const submitApplication = (opportunityId: string, notes?: string): Application => {
    const existing = applications.find(
      (a) => a.opportunityId === opportunityId && a.driverId === driver.id
    )
    if (existing) {
      return existing
    }

    const opp = opportunities.find((o) => o.id === opportunityId)
    const availableTruck = trucks.find((t) => t.status === 'available') || trucks[0]

    const newApp: Application = {
      id: `app-demo-${Date.now()}`,
      opportunityId,
      opportunityTitle: opp ? opp.title : 'Mission de fret Teranga Connect',
      origin: opp ? opp.origin : 'Dakar',
      destination: opp ? opp.destination : 'Région',
      cargo: opp ? opp.cargoType : 'Fret divers',
      truckType: opp ? opp.truckCategoryLabel : 'Porteur Plateau',
      departureDate: opp ? opp.departureDate : 'Sous 24h',
      driverId: driver.id,
      driverName: `${driver.fullName} [Chauffeur Démo]`,
      driverPhone: driver.phone,
      driverExperience: `${driver.experienceYears} ans d'expérience [Fictif - Démonstration]`,
      proposedTruck: availableTruck
        ? `${availableTruck.brandModel} (${availableTruck.matricule})`
        : 'Camion Proposé [Fictif]',
      appliedAt: 'À l’instant (Démonstration)',
      status: 'pending',
      notes: notes || 'Manifestation d’intérêt soumise via le portail Teranga Connect.',
      isDemo: true,
    }

    setApplications((prev) => [newApp, ...prev])
    setInterestedOpportunityIds((prev) =>
      prev.includes(opportunityId) ? prev : [...prev, opportunityId]
    )

    // Notification pour le Propriétaire
    addNotification({
      type: 'application',
      title: 'Nouvelle manifestation d’intérêt',
      message: `${driver.fullName} a manifesté son intérêt pour votre opportunité : ${newApp.origin} → ${newApp.destination}.`,
      relatedId: newApp.id,
      link: '/proprietaire',
      targetRole: 'truck_owner',
    })

    return newApp
  }

  const recordInterest = (opportunityId: string): boolean => {
    submitApplication(opportunityId)
    return true
  }

  const isInterested = (opportunityId: string): boolean => {
    return (
      interestedOpportunityIds.includes(opportunityId) ||
      applications.some((a) => a.opportunityId === opportunityId && a.driverId === driver.id)
    )
  }

  // Propriétaire Acceptation de candidature -> Création Mission
  const acceptApplication = (
    applicationId: string,
    truckId?: string
  ): { application: Application; mission: Mission } | null => {
    const app = applications.find((a) => a.id === applicationId)
    if (!app) return null

    const opp = opportunities.find((o) => o.id === app.opportunityId)
    const selectedTruck =
      trucks.find((t) => t.id === truckId) ||
      trucks.find((t) => t.status === 'available') ||
      trucks[0]

    const isReturn = opp?.isReturnTrip ?? false
    const priceText = opp?.estimatedPrice || '200 000 FCFA (Indicatif)'
    const economics = calculateMissionEconomics(priceText, isReturn)

    const missionId = `mission-demo-${Date.now()}`
    const originShort = (opp?.origin || 'DKR').substring(0, 3).toUpperCase()
    const destShort = (opp?.destination || 'REG').substring(0, 3).toUpperCase()
    const codeSuffix = Math.floor(10 + Math.random() * 90)

    const newMission: Mission = {
      id: missionId,
      missionCode: `MSN-${originShort}-${destShort}-${codeSuffix}`,
      title: opp ? opp.title : `Transport de fret ${app.cargo} (${app.origin} → ${app.destination})`,
      description: opp ? opp.description : `Mission de transport routier entre ${app.origin} et ${app.destination}.`,
      opportunityId: app.opportunityId,
      opportunityTitle: opp?.title,
      applicationId: app.id,
      ownerId: owner.id,
      ownerName: owner.companyName,
      driverId: app.driverId,
      driverName: app.driverName,
      driverPhone: app.driverPhone,
      truckId: selectedTruck ? selectedTruck.id : 'truck-demo-1',
      truckMatricule: selectedTruck ? selectedTruck.matricule : 'DK-****-A1 [Fictif]',
      truckType: opp ? opp.truckCategoryLabel : app.truckType,
      origin: app.origin,
      destination: app.destination,
      departureDate: app.departureDate,
      returnDate: isReturn ? 'Retour immédiat après déchargement (Démonstration)' : undefined,
      cargo: app.cargo,
      tripType: isReturn ? 'return_cargo' : 'one_way',
      estimatedDistance: opp ? opp.distanceKm : 100,
      estimatedPrice: priceText,
      estimatedAmountFcfa: economics.totalEstimatedAmount,
      commissionRate: economics.commissionRate,
      commissionAmountFcfa: economics.commissionAmount,
      commissionLabel: economics.commissionPercentLabel,
      status: 'accepted',
      createdAt: 'À l’instant (Démonstration)',
      acceptedAt: 'À l’instant (Démonstration)',
      timeline: buildMissionTimeline('accepted', {
        createdAt: 'À l’instant',
        acceptedAt: 'À l’instant',
      }),
      notes: `Mission créée suite à l'acceptation de la candidature de ${app.driverName}.`,
      isDemo: true,
    }

    const updatedApplication: Application = {
      ...app,
      status: 'accepted',
      missionId: newMission.id,
    }

    setApplications((prev) =>
      prev.map((a) => (a.id === applicationId ? updatedApplication : a))
    )

    setMissions((prev) => [newMission, ...prev])

    if (opp) {
      setOpportunities((prev) =>
        prev.map((o) => (o.id === opp.id ? { ...o, status: 'in_progress' } : o))
      )
    }

    // Notification côté Chauffeur
    addNotification({
      type: 'mission',
      title: 'Mission acceptée',
      message: `Votre candidature pour ${app.origin} → ${app.destination} a été acceptée. La mission ${newMission.missionCode} est créée et prête pour le départ.`,
      relatedId: newMission.id,
      link: `/missions/${newMission.id}`,
      targetRole: 'driver',
    })

    return { application: updatedApplication, mission: newMission }
  }

  // Propriétaire Refus Candidature
  const rejectApplication = (applicationId: string, reason?: string): boolean => {
    const app = applications.find((a) => a.id === applicationId)
    if (!app) return false

    setApplications((prev) =>
      prev.map((a) => {
        if (a.id === applicationId) {
          return {
            ...a,
            status: 'rejected',
            notes: reason ? `Refusée : ${reason}` : 'Candidature non retenue pour ce trajet.',
          }
        }
        return a
      })
    )

    // Notification côté Chauffeur
    addNotification({
      type: 'application',
      title: 'Candidature non retenue',
      message: `Votre candidature pour le trajet ${app.origin} → ${app.destination} n’a pas été retenue par le transporteur.`,
      relatedId: app.id,
      link: '/chauffeur',
      targetRole: 'driver',
    })

    return true
  }

  // Acceptation formelle de mission (passage de PENDING à ACCEPTED)
  const acceptMission = (missionId: string): boolean => {
    const targetMission = missions.find((m) => m.id === missionId)
    if (!targetMission || (targetMission.status !== 'pending' && targetMission.status !== 'interest')) {
      return false
    }

    const nowStr = 'À l’instant (Acceptée)'
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === missionId) {
          return {
            ...m,
            status: 'accepted',
            acceptedAt: nowStr,
            timeline: buildMissionTimeline('accepted', {
              createdAt: m.createdAt,
              acceptedAt: nowStr,
            }),
          }
        }
        return m
      })
    )

    if (targetMission.applicationId) {
      setApplications((prev) =>
        prev.map((a) =>
          a.id === targetMission.applicationId ? { ...a, status: 'accepted' } : a
        )
      )
    }

    addNotification({
      type: 'mission',
      title: 'Mission acceptée',
      message: `La mission ${targetMission.missionCode} (${targetMission.origin} → ${targetMission.destination}) a été acceptée. Le départ peut être préparé.`,
      relatedId: targetMission.id,
      link: `/missions/${targetMission.id}`,
      targetRole: 'all',
    })

    return true
  }

  // Confirmation Mission (conservée pour compatibilité ou transition équivalente)
  const confirmMission = (missionId: string): boolean => {
    const targetMission = missions.find((m) => m.id === missionId)
    if (!targetMission || (targetMission.status !== 'pending' && targetMission.status !== 'accepted')) {
      return false
    }

    const nowStr = 'À l’instant (Acceptée)'
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === missionId) {
          return {
            ...m,
            status: 'accepted',
            acceptedAt: nowStr,
            timeline: buildMissionTimeline('accepted', {
              createdAt: m.createdAt,
              acceptedAt: nowStr,
            }),
          }
        }
        return m
      })
    )

    setApplications((prev) =>
      prev.map((a) => {
        if (a.missionId === missionId) {
          return { ...a, status: 'accepted' }
        }
        return a
      })
    )

    addNotification({
      type: 'mission',
      title: 'Mission acceptée',
      message: `La mission ${targetMission.missionCode} (${targetMission.origin} → ${targetMission.destination}) est prête pour le départ.`,
      relatedId: targetMission.id,
      link: `/missions/${targetMission.id}`,
      targetRole: 'all',
    })

    return true
  }

  // Démarrage Mission (passage de ACCEPTED à IN_PROGRESS)
  const startMission = (missionId: string): boolean => {
    const targetMission = missions.find((m) => m.id === missionId)
    // Règle senior : transition autorisée uniquement depuis ACCEPTED (ou confirmed rétrocompat)
    if (!targetMission || (targetMission.status !== 'accepted' && targetMission.status !== 'confirmed')) {
      return false
    }

    const nowStr = 'À l’instant (En route)'
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === missionId) {
          return {
            ...m,
            status: 'in_progress',
            startedAt: nowStr,
            timeline: buildMissionTimeline('in_progress', {
              createdAt: m.createdAt,
              acceptedAt: m.acceptedAt || m.createdAt,
              startedAt: nowStr,
            }),
          }
        }
        return m
      })
    )

    addNotification({
      type: 'mission',
      title: 'Mission démarrée',
      message: `Le chauffeur ${targetMission.driverName} a démarré la mission ${targetMission.missionCode} (${targetMission.origin} → ${targetMission.destination}). Le véhicule ${targetMission.truckMatricule} est en transit.`,
      relatedId: targetMission.id,
      link: `/missions/${targetMission.id}`,
      targetRole: 'all',
    })

    return true
  }

  // Clôture Mission (passage de IN_PROGRESS à COMPLETED)
  const completeMission = (missionId: string): boolean => {
    const targetMission = missions.find((m) => m.id === missionId)
    // Règle senior : transition autorisée uniquement depuis IN_PROGRESS
    if (!targetMission || targetMission.status !== 'in_progress') {
      return false
    }

    const nowStr = 'À l’instant (Livré)'
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === missionId) {
          return {
            ...m,
            status: 'completed',
            completedAt: nowStr,
            timeline: buildMissionTimeline('completed', {
              createdAt: m.createdAt,
              acceptedAt: m.acceptedAt || m.createdAt,
              startedAt: m.startedAt || m.createdAt,
              completedAt: nowStr,
            }),
          }
        }
        return m
      })
    )

    if (targetMission.applicationId) {
      setApplications((prev) =>
        prev.map((a) => {
          if (a.missionId === missionId) {
            return { ...a, status: 'completed' }
          }
          return a
        })
      )
    }

    addNotification({
      type: 'mission',
      title: 'Mission terminée',
      message: `La mission ${targetMission.missionCode} est arrivée à destination (${targetMission.destination}) et a été clôturée avec succès.`,
      relatedId: targetMission.id,
      link: `/missions/${targetMission.id}`,
      targetRole: 'all',
    })

    return true
  }

  // Annulation Mission (autorisée avant complétion)
  const cancelMission = (missionId: string, reason?: string): boolean => {
    const targetMission = missions.find((m) => m.id === missionId)
    // Règle senior : impossible d'annuler une mission terminée ou déjà annulée
    if (!targetMission || targetMission.status === 'completed' || targetMission.status === 'cancelled') {
      return false
    }

    const nowStr = 'À l’instant (Annulée)'
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === missionId) {
          return {
            ...m,
            status: 'cancelled',
            cancelledAt: nowStr,
            notes: reason ? `Annulée : ${reason}` : 'Mission annulée dans la démonstration.',
            timeline: buildMissionTimeline('cancelled', {
              createdAt: m.createdAt,
              acceptedAt: m.acceptedAt,
              startedAt: m.startedAt,
            }),
          }
        }
        return m
      })
    )

    if (targetMission.applicationId) {
      setApplications((prev) =>
        prev.map((a) => {
          if (a.missionId === missionId) {
            return { ...a, status: 'cancelled' }
          }
          return a
        })
      )
    }

    addNotification({
      type: 'mission',
      title: 'Mission annulée',
      message: `La mission ${targetMission.missionCode} (${targetMission.origin} → ${targetMission.destination}) a été annulée.`,
      relatedId: targetMission.id,
      link: `/missions/${targetMission.id}`,
      targetRole: 'all',
    })

    return true
  }

  const getMissionById = (missionId: string): Mission | undefined => {
    return missions.find((m) => m.id === missionId)
  }

  const getApplicationById = (applicationId: string): Application | undefined => {
    return applications.find((a) => a.id === applicationId)
  }

  // Réinitialisation de la démonstration : efface le storage et restaure l'état par défaut
  const resetDemoData = () => {
    clearAllDemoStorage()
    setOwner(MOCK_OWNER)
    setDriver(MOCK_DRIVER)
    setActiveRoleState('truck_owner')
    setTrucks(MOCK_TRUCKS)
    setOpportunities(MOCK_OPPORTUNITIES)
    setApplications(MOCK_APPLICATIONS)
    setMissions(MOCK_MISSIONS)
    setDriverStatusState('available')
    setInterestedOpportunityIds(Array.from(new Set(MOCK_APPLICATIONS.map((a) => a.opportunityId))))
    setNotifications(MOCK_NOTIFICATIONS)
  }

  return (
    <TransportContext.Provider
      value={{
        owner,
        driver,
        activeRole,
        setActiveRole,
        updateOwnerProfile,
        updateDriverProfile,
        trucks,
        opportunities,
        trips,
        applications,
        missions,
        driverStatus,
        interestedOpportunityIds,
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotifications,
        addNotification,
        toggleDriverStatus,
        setDriverStatus,
        addTruck,
        publishOpportunity,
        submitApplication,
        recordInterest,
        isInterested,
        acceptApplication,
        rejectApplication,
        acceptMission,
        confirmMission,
        startMission,
        completeMission,
        cancelMission,
        getMissionById,
        getApplicationById,
        resetDemoData,
      }}
    >
      {children}
    </TransportContext.Provider>
  )
}

export { TransportContext }
