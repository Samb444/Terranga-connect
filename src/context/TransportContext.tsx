import React, { createContext, useState } from 'react'
import type {
  Truck,
  Driver,
  Owner,
  Opportunity,
  Trip,
  Application,
  Mission,
} from '../types'
import {
  MOCK_OWNER,
  MOCK_DRIVER,
  MOCK_TRUCKS,
  MOCK_OPPORTUNITIES,
  MOCK_TRIPS,
  MOCK_APPLICATIONS,
  MOCK_MISSIONS,
} from '../data/mockData'
import {
  calculateMissionEconomics,
  buildMissionTimeline,
} from '../lib/missionUtils'

export interface TransportContextType {
  owner: Owner
  driver: Driver
  trucks: Truck[]
  opportunities: Opportunity[]
  trips: Trip[]
  applications: Application[]
  missions: Mission[]
  driverStatus: 'available' | 'unavailable'
  interestedOpportunityIds: string[]
  toggleDriverStatus: () => void
  setDriverStatus: (status: 'available' | 'unavailable') => void
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
  submitApplication: (opportunityId: string, notes?: string) => Application
  recordInterest: (opportunityId: string) => boolean
  isInterested: (opportunityId: string) => boolean
  acceptApplication: (
    applicationId: string,
    truckId?: string
  ) => { application: Application; mission: Mission } | null
  rejectApplication: (applicationId: string, reason?: string) => boolean
  confirmMission: (missionId: string) => boolean
  startMission: (missionId: string) => boolean
  completeMission: (missionId: string) => boolean
  cancelMission: (missionId: string, reason?: string) => boolean
  getMissionById: (missionId: string) => Mission | undefined
  getApplicationById: (applicationId: string) => Application | undefined
}

const TransportContext = createContext<TransportContextType | undefined>(undefined)

export const TransportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [owner] = useState<Owner>(MOCK_OWNER)
  const [driver, setDriver] = useState<Driver>(MOCK_DRIVER)
  const [trucks, setTrucks] = useState<Truck[]>(MOCK_TRUCKS)
  const [opportunities, setOpportunities] = useState<Opportunity[]>(MOCK_OPPORTUNITIES)
  const [trips] = useState<Trip[]>(MOCK_TRIPS)
  const [applications, setApplications] = useState<Application[]>(MOCK_APPLICATIONS)
  const [missions, setMissions] = useState<Mission[]>(MOCK_MISSIONS)
  const [driverStatus, setDriverStatusState] = useState<'available' | 'unavailable'>('available')

  // Initialiser les opportunités déjà manifestées depuis MOCK_APPLICATIONS
  const [interestedOpportunityIds, setInterestedOpportunityIds] = useState<string[]>(() => {
    return Array.from(new Set(MOCK_APPLICATIONS.map((a) => a.opportunityId)))
  })

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
  }

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
    return newOpp
  }

  /**
   * Soumission d'une candidature / manifestation d'intérêt par le chauffeur
   */
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

  /**
   * Acceptation d'une candidature par le propriétaire
   * Crée automatiquement une mission correspondante et adapte le statut de l'opportunité
   */
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
      opportunityId: app.opportunityId,
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
      timeline: buildMissionTimeline('accepted', {
        createdAt: 'À l’instant',
        acceptedAt: 'À l’instant',
      }),
      notes: `Mission créée suite à l'acceptation de la candidature de ${app.driverName}.`,
      isDemo: true,
    }

    // Mettre à jour la candidature
    const updatedApplication: Application = {
      ...app,
      status: 'accepted',
      missionId: newMission.id,
    }

    setApplications((prev) =>
      prev.map((a) => (a.id === applicationId ? updatedApplication : a))
    )

    // Ajouter la mission
    setMissions((prev) => [newMission, ...prev])

    // Adapter le statut de l'opportunité
    if (opp) {
      setOpportunities((prev) =>
        prev.map((o) => (o.id === opp.id ? { ...o, status: 'in_progress' } : o))
      )
    }

    return { application: updatedApplication, mission: newMission }
  }

  /**
   * Refus d'une candidature par le propriétaire
   */
  const rejectApplication = (applicationId: string, reason?: string): boolean => {
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
    return true
  }

  /**
   * Confirmation de la mission par le propriétaire
   */
  const confirmMission = (missionId: string): boolean => {
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === missionId) {
          const nowStr = 'À l’instant (Confirmation)'
          return {
            ...m,
            status: 'confirmed',
            timeline: buildMissionTimeline('confirmed', {
              createdAt: m.createdAt,
              acceptedAt: m.createdAt,
              confirmedAt: nowStr,
            }),
          }
        }
        return m
      })
    )

    // Synchroniser la candidature associée si présente
    setApplications((prev) =>
      prev.map((a) => {
        if (a.missionId === missionId) {
          return { ...a, status: 'confirmed' }
        }
        return a
      })
    )

    return true
  }

  /**
   * Démarrage de la mission par le chauffeur
   */
  const startMission = (missionId: string): boolean => {
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === missionId) {
          const nowStr = 'À l’instant (En route)'
          return {
            ...m,
            status: 'in_progress',
            startedAt: nowStr,
            timeline: buildMissionTimeline('in_progress', {
              createdAt: m.createdAt,
              acceptedAt: m.createdAt,
              confirmedAt: m.createdAt,
              startedAt: nowStr,
            }),
          }
        }
        return m
      })
    )
    return true
  }

  /**
   * Clôture / Fin de la mission par le chauffeur
   */
  const completeMission = (missionId: string): boolean => {
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === missionId) {
          const nowStr = 'À l’instant (Livré)'
          return {
            ...m,
            status: 'completed',
            completedAt: nowStr,
            timeline: buildMissionTimeline('completed', {
              createdAt: m.createdAt,
              acceptedAt: m.createdAt,
              confirmedAt: m.createdAt,
              startedAt: m.startedAt || m.createdAt,
              completedAt: nowStr,
            }),
          }
        }
        return m
      })
    )

    // Mettre à jour l'opportunité et la candidature correspondantes
    setApplications((prev) =>
      prev.map((a) => {
        if (a.missionId === missionId) {
          return { ...a, status: 'completed' }
        }
        return a
      })
    )

    return true
  }

  /**
   * Annulation de la mission
   */
  const cancelMission = (missionId: string, reason?: string): boolean => {
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === missionId) {
          return {
            ...m,
            status: 'cancelled',
            notes: reason ? `Annulée : ${reason}` : 'Mission annulée dans la démonstration.',
            timeline: buildMissionTimeline('cancelled', {
              createdAt: m.createdAt,
            }),
          }
        }
        return m
      })
    )

    setApplications((prev) =>
      prev.map((a) => {
        if (a.missionId === missionId) {
          return { ...a, status: 'cancelled' }
        }
        return a
      })
    )

    return true
  }

  const getMissionById = (missionId: string): Mission | undefined => {
    return missions.find((m) => m.id === missionId)
  }

  const getApplicationById = (applicationId: string): Application | undefined => {
    return applications.find((a) => a.id === applicationId)
  }

  return (
    <TransportContext.Provider
      value={{
        owner,
        driver,
        trucks,
        opportunities,
        trips,
        applications,
        missions,
        driverStatus,
        interestedOpportunityIds,
        toggleDriverStatus,
        setDriverStatus,
        addTruck,
        publishOpportunity,
        submitApplication,
        recordInterest,
        isInterested,
        acceptApplication,
        rejectApplication,
        confirmMission,
        startMission,
        completeMission,
        cancelMission,
        getMissionById,
        getApplicationById,
      }}
    >
      {children}
    </TransportContext.Provider>
  )
}

export { TransportContext }
