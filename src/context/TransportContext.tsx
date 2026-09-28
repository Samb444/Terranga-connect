import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react'
import type {
  Truck,
  Driver,
  Owner,
  Shipper,
  Opportunity,
  Trip,
  Application,
  Mission,
  AppNotification,
  UserRole,
  Subscription,
  Settlement,
  FuelVoucher,
  BusinessIntroducer,
  PaymentRecord,
} from '../types'
import {
  MOCK_OWNER,
  MOCK_DRIVER,
  MOCK_SHIPPER,
  MOCK_TRUCKS,
  MOCK_OPPORTUNITIES,
  MOCK_TRIPS,
  MOCK_APPLICATIONS,
  MOCK_MISSIONS,
  MOCK_NOTIFICATIONS,
} from '../data/mockData'
import {
  buildMissionTimeline,
  getMissionTracking,
  canPerformOperationalStep,
  formatCurrentDateTimeFr,
  generateDeliveryReceiptCode,
} from '../lib/missionUtils'
import {
  calculateFullMissionEconomics,
  DEFAULT_ADVANCE_PERCENT,
  MONTHLY_SUBSCRIPTION_AMOUNT,
  formatFcfa,
} from '../lib/financeUtils'
import {
  subscriptionRepository,
  settlementRepository,
  paymentRepository,
  fuelVoucherRepository,
  businessIntroducerRepository,
} from '../repositories'
import { getPaymentProvider } from '../services/payment'
import { MockFuelVoucherProvider } from '../services/fuel'
import type { DeliveryConfirmation, OperationalEvent } from '../types'
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
  shipper: Shipper
  activeRole: UserRole
  setActiveRole: (role: UserRole) => void
  updateOwnerProfile: (updatedData: Partial<Owner>) => void
  updateDriverProfile: (updatedData: Partial<Driver>) => void
  updateShipperProfile: (updatedData: Partial<Shipper>) => void

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
    estimatedPrice?: string
    isReturnTrip?: boolean
    publishedBy?: string
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

  // Suivi opérationnel & Livraison - Phase 7 & 8
  confirmPickup: (missionId: string, details?: { location?: string; notes?: string }) => boolean
  startTransit: (missionId: string, details?: { notes?: string }) => boolean
  signalArrival: (missionId: string, details?: { location?: string; notes?: string }) => boolean
  confirmDelivery: (
    missionId: string,
    confirmation: {
      signerName: string
      signerRole: string
      notes?: string
      receiptCode?: string
    }
  ) => boolean

  // --- EXTENSIONS PHASE 9 : CAHIER DES CHARGES ---
  // Abonnements (30 000 FCFA/mois)
  subscriptions: Subscription[]
  userSubscription?: Subscription
  subscribeToMonthlyPlan: (details?: {
    truckMatricule?: string
    paymentProvider?: 'wave' | 'orange_money' | 'mock'
  }) => Promise<{ success: boolean; subscription?: Subscription; message: string }>
  cancelSubscription: (subscriptionId: string) => boolean

  // Règlements & Escrow
  settlements: Settlement[]
  getSettlementByMissionId: (missionId: string) => Settlement | undefined
  fundMissionByShipper: (
    missionId: string,
    paymentProvider?: 'wave' | 'orange_money' | 'mock'
  ) => Promise<{ success: boolean; message: string }>
  releaseTransporterSettlement: (
    missionId: string
  ) => Promise<{ success: boolean; message: string }>

  // Bons carburant numériques (Avance 10-15%)
  fuelVouchers: FuelVoucher[]
  getVoucherForMission: (missionId: string) => FuelVoucher | undefined
  issueFuelVoucherForMission: (
    missionId: string,
    preferredNetwork?: 'Total' | 'Elton' | 'Shell' | 'Oryx'
  ) => Promise<FuelVoucher | null>
  redeemFuelVoucher: (voucherId: string) => Promise<boolean>

  // Coxeurs / Apporteurs d'affaires
  businessIntroducers: BusinessIntroducer[]
  addBusinessIntroducer: (data: {
    name: string
    phone: string
    city: string
    notes?: string
  }) => BusinessIntroducer
  toggleIntroducerStatus: (
    id: string,
    newStatus: 'pending' | 'active' | 'suspended'
  ) => boolean

  // Journal des flux financiers
  payments: PaymentRecord[]

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

  const [shipper, setShipper] = useState<Shipper>(() =>
    loadFromStorage<Shipper>(STORAGE_KEYS.SHIPPER, MOCK_SHIPPER)
  )

  const [activeRole, setActiveRoleState] = useState<UserRole>(() =>
    loadFromStorage<UserRole>(STORAGE_KEYS.ACTIVE_ROLE, 'truck_owner')
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

  // --- NOUVEAUX ÉTATS PHASE 9 ---
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() =>
    subscriptionRepository.getSubscriptions()
  )

  const [settlements, setSettlements] = useState<Settlement[]>(() =>
    settlementRepository.getSettlements()
  )

  const [fuelVouchers, setFuelVouchers] = useState<FuelVoucher[]>(() =>
    fuelVoucherRepository.getVouchers()
  )

  const [businessIntroducers, setBusinessIntroducers] = useState<BusinessIntroducer[]>(() =>
    businessIntroducerRepository.getIntroducers()
  )

  const [payments, setPayments] = useState<PaymentRecord[]>(() =>
    paymentRepository.getPayments()
  )

  // Persistance automatique dans le localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.OWNER, owner)
  }, [owner])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.DRIVER, driver)
  }, [driver])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SHIPPER, shipper)
  }, [shipper])

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

  useEffect(() => {
    subscriptionRepository.saveSubscriptions(subscriptions)
  }, [subscriptions])

  useEffect(() => {
    settlementRepository.saveSettlements(settlements)
  }, [settlements])

  useEffect(() => {
    fuelVoucherRepository.saveVouchers(fuelVouchers)
  }, [fuelVouchers])

  useEffect(() => {
    businessIntroducerRepository.saveIntroducers(businessIntroducers)
  }, [businessIntroducers])

  useEffect(() => {
    paymentRepository.savePayments(payments)
  }, [payments])

  // Rôle actif
  const setActiveRole = (role: UserRole) => {
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

  const updateShipperProfile = (updatedData: Partial<Shipper>) => {
    setShipper((prev) => ({
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

  // Gestion des notifications (Phase 8 — Filtrage strict selon le rôle actif)
  const roleNotifications = useMemo(() => {
    return notifications.filter(
      (n) => !n.targetRole || n.targetRole === 'all' || n.targetRole === activeRole
    )
  }, [notifications, activeRole])

  const unreadNotificationsCount = useMemo(() => {
    return roleNotifications.filter((n) => !n.read).length
  }, [roleNotifications])

  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }, [])

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((n) =>
        !n.targetRole || n.targetRole === 'all' || n.targetRole === activeRole
          ? { ...n, read: true }
          : n
      )
    )
  }, [activeRole])

  const clearNotifications = useCallback(() => {
    // Efface uniquement les notifications du rôle actif, préservant celles de l'autre rôle
    setNotifications((prev) =>
      prev.filter(
        (n) => n.targetRole && n.targetRole !== 'all' && n.targetRole !== activeRole
      )
    )
  }, [activeRole])

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

  // Publication Opportunité (par un Chargeur ou un Propriétaire)
  const publishOpportunity = (newOppData: {
    origin: string
    destination: string
    cargoType: string
    weightTons: number
    truckCategoryRequired: Opportunity['truckCategoryRequired']
    truckCategoryLabel: string
    departureDate: string
    description: string
    estimatedPrice?: string
    isReturnTrip?: boolean
    publishedBy?: string
  }): Opportunity => {
    const isReturn =
      newOppData.isReturnTrip ??
      (newOppData.destination.toLowerCase() === 'dakar' &&
        newOppData.origin.toLowerCase() !== 'dakar')

    const publisher =
      newOppData.publishedBy ||
      (activeRole === 'shipper' ? shipper.companyName : owner.companyName)

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
      estimatedPrice: newOppData.estimatedPrice || 'Tarif indicatif à convenir',
      description: newOppData.description,
      indicativeConditions: [
        'Contrat type de fret Teranga Connect (Simulation)',
        'Assurance marchandise requise',
      ],
      badgeNotice: 'Démonstration',
      createdAt: new Date().toISOString().split('T')[0],
      publishedBy: publisher,
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
    const economics = calculateFullMissionEconomics(priceText, isReturn, DEFAULT_ADVANCE_PERCENT)

    const missionId = `mission-demo-${Date.now()}`
    const originShort = (opp?.origin || 'DKR').substring(0, 3).toUpperCase()
    const destShort = (opp?.destination || 'REG').substring(0, 3).toUpperCase()
    const codeSuffix = Math.floor(10 + Math.random() * 90)
    const settlementId = `stl-${missionId}`

    const newMission: Mission = {
      id: missionId,
      missionCode: `MSN-${originShort}-${destShort}-${codeSuffix}`,
      title: opp ? opp.title : `Transport de fret ${app.cargo} (${app.origin} → ${app.destination})`,
      description: opp ? opp.description : `Mission de transport routier entre ${app.origin} et ${app.destination}.`,
      opportunityId: app.opportunityId,
      opportunityTitle: opp?.title,
      applicationId: app.id,
      shipperId: opp?.publishedBy ? 'shipper-demo-1' : undefined,
      shipperName: opp?.publishedBy || 'Donneur d’ordre (Chargeur)',
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
      estimatedAmountFcfa: economics.grossAmount,
      commissionRate: economics.commissionRate,
      commissionAmountFcfa: economics.commissionAmount,
      commissionLabel: economics.commissionLabel,
      advancePercent: economics.advancePercent,
      advanceAmountFcfa: economics.advanceAmount,
      settlementId,
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

    // Création du settlement financier initial (Phase 9)
    const newSettlement: Settlement = {
      id: settlementId,
      missionId,
      missionCode: newMission.missionCode,
      grossAmount: economics.grossAmount,
      advancePercent: economics.advancePercent,
      advanceAmount: economics.advanceAmount,
      commissionRate: economics.commissionRate,
      commissionAmount: economics.commissionAmount,
      transporterAmount: economics.transporterGrossAmount,
      remainingBalance: economics.transporterFinalSolde,
      status: 'funded', // Fonds consignés en amont par le chargeur
      paymentProvider: 'Wave / Escrow Teranga (Simulé)',
      fundedAt: formatCurrentDateTimeFr(),
      createdAt: formatCurrentDateTimeFr(),
      notes: 'Provisionné en amont par le chargeur sous séquestre Teranga Connect.',
    }
    setSettlements((prev) => [newSettlement, ...prev])

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

    // Notification côté Chargeur
    addNotification({
      type: 'mission',
      title: 'Transporteur affecté à votre expédition',
      message: `Votre demande de fret (${newMission.origin} → ${newMission.destination}) a été prise en charge par ${newMission.ownerName} avec le véhicule ${newMission.truckMatricule}.`,
      relatedId: newMission.id,
      link: `/missions/${newMission.id}`,
      targetRole: 'shipper',
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

    const nowStr = formatCurrentDateTimeFr()
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === missionId) {
          const currentTracking = getMissionTracking(m)
          const startEvt: OperationalEvent = {
            id: `evt-start-${Date.now()}`,
            step: 'started',
            label: 'Mission démarrée',
            timestamp: nowStr,
            location: m.origin,
            authorName: driver.fullName,
            authorRole: 'driver',
          }
          return {
            ...m,
            status: 'in_progress',
            startedAt: nowStr,
            tracking: {
              ...currentTracking,
              currentStatus: 'pending_pickup',
              history: [...currentTracking.history, startEvt],
            },
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

    // Mise à jour financière : avance versée (Phase 9)
    const advAmount =
      targetMission.advanceAmountFcfa || Math.round(targetMission.estimatedAmountFcfa * 0.10)

    setSettlements((prev) =>
      prev.map((s) =>
        s.missionId === missionId
          ? {
              ...s,
              status: s.status === 'funded' ? 'advance_paid' : s.status,
              advancePaidAt: nowStr,
              notes: 'Avance carburant et péages émise sous forme de bon numérique.',
            }
          : s
      )
    )

    // Émission automatique du bon carburant numérique si pas encore créé
    const existingVoucher = fuelVouchers.find((v) => v.missionId === missionId)
    if (!existingVoucher) {
      const provider = new MockFuelVoucherProvider()
      provider
        .issueVoucher({
          missionId,
          missionCode: targetMission.missionCode,
          amount: advAmount,
          beneficiaryId: targetMission.driverId,
          beneficiaryName: targetMission.driverName,
          preferredStationNetwork: 'Total',
        })
        .then((voucher) => {
          setFuelVouchers((prev) => [voucher, ...prev])
        })
    }

    addNotification({
      type: 'mission',
      title: 'Mission démarrée',
      message: `Le chauffeur ${targetMission.driverName} a démarré la mission ${targetMission.missionCode} (${targetMission.origin} → ${targetMission.destination}). Le véhicule ${targetMission.truckMatricule} est en transit.`,
      relatedId: targetMission.id,
      link: `/missions/${targetMission.id}`,
      targetRole: 'all',
    })

    addNotification({
      type: 'payment',
      title: 'Avance carburant disponible',
      message: `Votre bon de carburant numérique de ${formatFcfa(advAmount)} a été émis pour le départ de la mission ${targetMission.missionCode}.`,
      relatedId: targetMission.id,
      link: `/missions/${targetMission.id}`,
      targetRole: 'driver',
    })

    return true
  }

  // Clôture Mission (passage de IN_PROGRESS à COMPLETED)
  const completeMission = (missionId: string): boolean => {
    const targetMission = missions.find((m) => m.id === missionId)
    // Règle senior Phase 8 : transition autorisée uniquement depuis IN_PROGRESS et statut opérationnel DELIVERED
    if (!targetMission || targetMission.status !== 'in_progress') {
      return false
    }

    const currentTracking = getMissionTracking(targetMission)
    if (currentTracking.currentStatus !== 'delivered') {
      console.warn(
        `[TransportContext] Transition rejetée : la mission ${targetMission.missionCode} doit franchir l’étape opérationnelle de livraison (delivered) avant complétion.`
      )
      return false
    }

    const nowStr = formatCurrentDateTimeFr()
    const receiptCode = generateDeliveryReceiptCode(targetMission.missionCode)
    const deliveryDoc: DeliveryConfirmation = {
      confirmedAt: nowStr,
      confirmedBy: activeRole === 'driver' ? driver.fullName : owner.fullName,
      signerName: 'Réceptionnaire sur site',
      signerRole: 'Responsable Déchargement',
      receiptCode,
      notes: 'Clôture de mission et déchargement validés.',
    }

    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === missionId) {
          const currentTracking = getMissionTracking(m)
          const newEvt: OperationalEvent = {
            id: `evt-delivery-${Date.now()}`,
            step: 'delivery',
            label: 'Livraison confirmée',
            timestamp: nowStr,
            location: m.destination,
            authorName: targetMission.driverName,
            authorRole: 'system',
            notes: `Livraison enregistrée sous la référence ${receiptCode}.`,
          }
          return {
            ...m,
            status: 'completed',
            completedAt: nowStr,
            deliveredAt: nowStr,
            timeline: buildMissionTimeline('completed', {
              createdAt: m.createdAt,
              acceptedAt: m.acceptedAt || m.createdAt,
              startedAt: m.startedAt || m.createdAt,
              completedAt: nowStr,
            }),
            tracking: {
              ...currentTracking,
              currentStatus: 'delivered',
              deliveredAt: nowStr,
              deliveryConfirmation: currentTracking.deliveryConfirmation || deliveryDoc,
              history: [...currentTracking.history, newEvt],
            },
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

    const nowStr = formatCurrentDateTimeFr()
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === missionId) {
          const currentTracking = getMissionTracking(m)
          const cancelEvt: OperationalEvent = {
            id: `evt-cancel-${Date.now()}`,
            step: 'cancelled',
            label: 'Mission annulée',
            timestamp: nowStr,
            location: m.origin,
            authorName: activeRole === 'driver' ? driver.fullName : owner.fullName,
            authorRole: activeRole,
            notes: reason || 'Mission annulée dans la démonstration.',
          }
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
            tracking: {
              ...currentTracking,
              history: [...currentTracking.history, cancelEvt],
            },
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

  // --- SUIVI OPÉRATIONNEL & GESTION DE LA LIVRAISON (PHASE 7) ---

  // 1. Confirmer la prise en charge (Chargement sur site)
  const confirmPickup = (missionId: string, details?: { location?: string; notes?: string }): boolean => {
    const targetMission = missions.find((m) => m.id === missionId)
    if (!targetMission) return false
    const guard = canPerformOperationalStep(targetMission, 'pickup')
    if (!guard.allowed) return false

    const nowStr = formatCurrentDateTimeFr()
    const location = details?.location || targetMission.origin
    const authorName = activeRole === 'driver' ? driver.fullName : `${owner.fullName} (Superviseur)`

    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === missionId) {
          const currentTracking = getMissionTracking(m)
          const newEvt: OperationalEvent = {
            id: `evt-pickup-${Date.now()}`,
            step: 'pickup',
            label: 'Prise en charge confirmée',
            timestamp: nowStr,
            location,
            authorName,
            authorRole: activeRole,
            notes: details?.notes || 'Marchandise prise en charge et sécurisée à bord.',
          }
          return {
            ...m,
            pickedUpAt: nowStr,
            tracking: {
              ...currentTracking,
              currentStatus: 'picked_up',
              pickedUpAt: nowStr,
              history: [...currentTracking.history, newEvt],
            },
          }
        }
        return m
      })
    )

    addNotification({
      type: 'mission',
      title: 'Prise en charge confirmée',
      message: `La marchandise de la mission ${targetMission.missionCode} a été chargée à ${location} par ${targetMission.driverName}.`,
      relatedId: targetMission.id,
      link: `/missions/${targetMission.id}`,
      targetRole: 'all',
    })

    return true
  }

  // 2. Prendre la route (Mise en route sur le corridor)
  const startTransit = (missionId: string, details?: { notes?: string }): boolean => {
    const targetMission = missions.find((m) => m.id === missionId)
    if (!targetMission) return false
    const guard = canPerformOperationalStep(targetMission, 'in_transit')
    if (!guard.allowed) return false

    const nowStr = formatCurrentDateTimeFr()
    const location = `Corridor ${targetMission.origin} → ${targetMission.destination}`
    const authorName = activeRole === 'driver' ? driver.fullName : `${owner.fullName} (Superviseur)`

    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === missionId) {
          const currentTracking = getMissionTracking(m)
          const newEvt: OperationalEvent = {
            id: `evt-transit-${Date.now()}`,
            step: 'in_transit',
            label: 'Mission en route',
            timestamp: nowStr,
            location,
            authorName,
            authorRole: activeRole,
            notes: details?.notes || 'Départ validé. Véhicule en acheminement sur corridor routier.',
          }
          return {
            ...m,
            tracking: {
              ...currentTracking,
              currentStatus: 'in_transit',
              inTransitAt: nowStr,
              history: [...currentTracking.history, newEvt],
            },
          }
        }
        return m
      })
    )

    addNotification({
      type: 'mission',
      title: 'Mission en route',
      message: `Le camion ${targetMission.truckMatricule} a pris la route vers ${targetMission.destination}. Acheminement en cours.`,
      relatedId: targetMission.id,
      link: `/missions/${targetMission.id}`,
      targetRole: 'all',
    })

    return true
  }

  // 3. Signaler l'arrivée à destination
  const signalArrival = (missionId: string, details?: { location?: string; notes?: string }): boolean => {
    const targetMission = missions.find((m) => m.id === missionId)
    if (!targetMission) return false
    const guard = canPerformOperationalStep(targetMission, 'arrival')
    if (!guard.allowed) return false

    const nowStr = formatCurrentDateTimeFr()
    const location = details?.location || targetMission.destination
    const authorName = activeRole === 'driver' ? driver.fullName : `${owner.fullName} (Superviseur)`

    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === missionId) {
          const currentTracking = getMissionTracking(m)
          const newEvt: OperationalEvent = {
            id: `evt-arrival-${Date.now()}`,
            step: 'arrival',
            label: 'Arrivé à destination',
            timestamp: nowStr,
            location,
            authorName,
            authorRole: activeRole,
            notes: details?.notes || 'Camion stationné au point de livraison. Prêt pour déchargement.',
          }
          return {
            ...m,
            arrivedAt: nowStr,
            tracking: {
              ...currentTracking,
              currentStatus: 'arrived',
              arrivedAt: nowStr,
              history: [...currentTracking.history, newEvt],
            },
          }
        }
        return m
      })
    )

    addNotification({
      type: 'mission',
      title: 'Arrivée signalée',
      message: `Le camion ${targetMission.truckMatricule} est arrivé à destination (${location}). Prêt pour déchargement.`,
      relatedId: targetMission.id,
      link: `/missions/${targetMission.id}`,
      targetRole: 'all',
    })

    return true
  }

  // 4. Confirmer la livraison avec émargement (Exigence Section 9)
  const confirmDelivery = (
    missionId: string,
    confirmation: {
      signerName: string
      signerRole: string
      notes?: string
      receiptCode?: string
    }
  ): boolean => {
    const targetMission = missions.find((m) => m.id === missionId)
    if (!targetMission) return false
    const guard = canPerformOperationalStep(targetMission, 'delivery')
    if (!guard.allowed) return false

    const nowStr = formatCurrentDateTimeFr()
    const receiptCode =
      confirmation.receiptCode || generateDeliveryReceiptCode(targetMission.missionCode)

    const deliveryDoc: DeliveryConfirmation = {
      confirmedAt: nowStr,
      confirmedBy: activeRole === 'driver' ? driver.fullName : owner.fullName,
      signerName: confirmation.signerName,
      signerRole: confirmation.signerRole,
      receiptCode,
      notes: confirmation.notes || 'Cargaison réceptionnée et déchargée sans réserve.',
    }

    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === missionId) {
          const currentTracking = getMissionTracking(m)
          const newEvt: OperationalEvent = {
            id: `evt-delivery-${Date.now()}`,
            step: 'delivery',
            label: 'Livraison confirmée',
            timestamp: nowStr,
            location: m.destination,
            authorName: confirmation.signerName,
            authorRole: 'system',
            notes: `Émargement enregistré sous la référence ${receiptCode}.`,
          }
          return {
            ...m,
            status: 'completed',
            completedAt: nowStr,
            deliveredAt: nowStr,
            timeline: buildMissionTimeline('completed', {
              createdAt: m.createdAt,
              acceptedAt: m.acceptedAt || m.createdAt,
              startedAt: m.startedAt || m.createdAt,
              completedAt: nowStr,
            }),
            tracking: {
              ...currentTracking,
              currentStatus: 'delivered',
              deliveredAt: nowStr,
              deliveryConfirmation: deliveryDoc,
              history: [...currentTracking.history, newEvt],
            },
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

    // Mise à jour financière : passage en attente de déblocage solde (Phase 9)
    setSettlements((prev) =>
      prev.map((s) => {
        if (s.missionId === missionId) {
          return {
            ...s,
            status: 'settlement_pending',
            deliveryConfirmedAt: nowStr,
            notes: `Livraison confirmée avec émargement (${receiptCode}). En attente de validation du règlement final.`,
          }
        }
        return s
      })
    )

    addNotification({
      type: 'mission',
      title: 'Livraison confirmée',
      message: `La livraison de la mission ${targetMission.missionCode} (${targetMission.origin} → ${targetMission.destination}) a été confirmée et émargée par ${confirmation.signerName} (Réf: ${receiptCode}).`,
      relatedId: targetMission.id,
      link: `/missions/${targetMission.id}`,
      targetRole: 'all',
    })

    // Notifications financières dédiées
    addNotification({
      type: 'payment',
      title: 'Mission livrée — Règlement en attente',
      message: `La livraison de la mission ${targetMission.missionCode} est validée. Votre solde restant sera versé dès validation administrative.`,
      relatedId: targetMission.id,
      link: `/missions/${targetMission.id}`,
      targetRole: 'truck_owner',
    })

    addNotification({
      type: 'payment',
      title: 'Règlement en attente de validation',
      message: `La mission ${targetMission.missionCode} a été livrée avec récépissé conforme (${receiptCode}). Dossier financier prêt pour déblocage.`,
      relatedId: targetMission.id,
      link: '/admin',
      targetRole: 'admin',
    })

    return true
  }

  // --- CALCULS ET ACTIONS PHASE 9 : CAHIER DES CHARGES ---
  const userSubscription = useMemo(() => {
    const currentUserId = activeRole === 'driver' ? driver.id : owner.id
    return subscriptions.find((s) => s.userId === currentUserId)
  }, [subscriptions, activeRole, driver.id, owner.id])

  const subscribeToMonthlyPlan = async (details?: {
    truckMatricule?: string
    paymentProvider?: 'wave' | 'orange_money' | 'mock'
  }): Promise<{ success: boolean; subscription?: Subscription; message: string }> => {
    const providerId = details?.paymentProvider || 'mock'
    const provider = getPaymentProvider(providerId)
    const payerName = activeRole === 'driver' ? driver.fullName : owner.fullName
    const payerPhone = activeRole === 'driver' ? driver.phone : owner.phone
    const currentUserId = activeRole === 'driver' ? driver.id : owner.id
    const matricule =
      details?.truckMatricule ||
      (trucks.length > 0 ? trucks[0].matricule : 'DK-2024-TR [Fictif]')

    const payResult = await provider.createPayment({
      amount: MONTHLY_SUBSCRIPTION_AMOUNT,
      currency: 'FCFA',
      reference: `SUB-${Date.now()}`,
      description: 'Abonnement mensuel transporteur Teranga Connect (30 000 FCFA/mois)',
      payerName,
      payerPhone,
    })

    if (!payResult.success) {
      return { success: false, message: payResult.message }
    }

    const now = new Date()
    const expiry = new Date(now)
    expiry.setDate(expiry.getDate() + 30)

    const nowFormatted = formatCurrentDateTimeFr(now)
    const expiryFormatted = formatCurrentDateTimeFr(expiry)

    const newSub: Subscription = {
      id: `sub-${Date.now()}`,
      userId: currentUserId,
      userRole: activeRole,
      userName: payerName,
      truckMatricule: matricule,
      plan: 'monthly_truck',
      amount: MONTHLY_SUBSCRIPTION_AMOUNT,
      currency: 'FCFA',
      status: 'active',
      startedAt: nowFormatted,
      expiresAt: expiryFormatted,
      paymentStatus: 'paid',
      paymentProvider:
        providerId === 'wave'
          ? 'Wave (Simulé)'
          : providerId === 'orange_money'
          ? 'Orange Money (Simulé)'
          : 'Démonstration simulée',
      createdAt: nowFormatted,
      renewalCount: 1,
    }

    setSubscriptions((prev) => {
      const filtered = prev.filter((s) => s.userId !== currentUserId)
      return [newSub, ...filtered]
    })

    const newPay: PaymentRecord = {
      id: `pay-sub-${Date.now()}`,
      reference: payResult.reference,
      amount: MONTHLY_SUBSCRIPTION_AMOUNT,
      currency: 'FCFA',
      type: 'subscription',
      relatedEntityId: newSub.id,
      status: 'successful',
      provider: providerId,
      providerTransactionId: payResult.transactionId,
      payerName,
      payerPhone,
      createdAt: nowFormatted,
      completedAt: nowFormatted,
      isSimulated: payResult.isSimulated,
    }

    setPayments((prev) => [newPay, ...prev])

    addNotification({
      type: 'payment',
      title: 'Abonnement activé (30 000 FCFA/mois)',
      message: `Votre abonnement mensuel matériel pour le véhicule ${matricule} a été activé avec succès. Échéance : ${expiryFormatted}.`,
      targetRole: activeRole,
      link: '/abonnement',
    })

    return {
      success: true,
      subscription: newSub,
      message: `Abonnement souscrit avec succès (${payResult.message}).`,
    }
  }

  const cancelSubscription = (subscriptionId: string): boolean => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === subscriptionId ? { ...s, status: 'cancelled' } : s))
    )
    addNotification({
      type: 'system',
      title: 'Abonnement résilié',
      message: 'Votre abonnement a été marqué comme résilié.',
      targetRole: activeRole,
      link: '/abonnement',
    })
    return true
  }

  const getSettlementByMissionId = (missionId: string): Settlement | undefined => {
    return settlements.find((s) => s.missionId === missionId)
  }

  const fundMissionByShipper = async (
    missionId: string,
    providerId: 'wave' | 'orange_money' | 'mock' = 'mock'
  ): Promise<{ success: boolean; message: string }> => {
    const targetMission = missions.find((m) => m.id === missionId)
    if (!targetMission) return { success: false, message: 'Mission introuvable.' }

    const stl = settlements.find((s) => s.missionId === missionId)
    const amount = stl ? stl.grossAmount : targetMission.estimatedAmountFcfa

    const provider = getPaymentProvider(providerId)
    const payResult = await provider.createPayment({
      amount,
      currency: 'FCFA',
      reference: `FUND-${targetMission.missionCode}-${Date.now()}`,
      description: `Financement séquestre mission ${targetMission.missionCode}`,
      payerName: shipper.fullName,
      payerPhone: shipper.phone,
    })

    if (!payResult.success) {
      addNotification({
        type: 'payment',
        title: 'Échec de paiement',
        message: payResult.message,
        targetRole: 'admin',
      })
      return { success: false, message: payResult.message }
    }

    const nowStr = formatCurrentDateTimeFr()
    const paymentRecord: PaymentRecord = {
      id: `pay-fund-${Date.now()}`,
      reference: payResult.reference,
      amount,
      currency: 'FCFA',
      type: 'mission_funding',
      relatedEntityId: missionId,
      status: 'successful',
      provider: providerId,
      providerTransactionId: payResult.transactionId,
      payerName: shipper.fullName,
      payerPhone: shipper.phone,
      createdAt: nowStr,
      completedAt: nowStr,
      isSimulated: payResult.isSimulated,
    }

    setPayments((prev) => [paymentRecord, ...prev])

    setSettlements((prev) =>
      prev.map((s) =>
        s.missionId === missionId
          ? {
              ...s,
              status: 'funded',
              fundedAt: nowStr,
              paymentProvider: `${providerId === 'wave' ? 'Wave' : providerId === 'orange_money' ? 'Orange Money' : 'Simulé'}`,
            }
          : s
      )
    )

    addNotification({
      type: 'payment',
      title: 'Mission financée avec succès',
      message: `Le paiement de ${formatFcfa(amount)} pour la mission ${targetMission.missionCode} est consigné sous séquestre Teranga Connect.`,
      relatedId: missionId,
      link: `/missions/${missionId}`,
      targetRole: 'shipper',
    })

    addNotification({
      type: 'payment',
      title: 'Fonds sécurisés pour votre trajet',
      message: `Le chargeur a consigné les fonds pour la mission ${targetMission.missionCode}. Votre avance de trésorerie est garantie.`,
      relatedId: missionId,
      link: `/missions/${missionId}`,
      targetRole: 'truck_owner',
    })

    return {
      success: true,
      message: `Fonds sécurisés avec succès (${payResult.message}).`,
    }
  }

  const releaseTransporterSettlement = async (
    missionId: string
  ): Promise<{ success: boolean; message: string }> => {
    const stl = settlements.find((s) => s.missionId === missionId)
    if (!stl) {
      return { success: false, message: 'Dossier de règlement introuvable.' }
    }

    if (stl.status !== 'settlement_pending' && stl.status !== 'delivery_confirmed') {
      return {
        success: false,
        message: 'Le règlement ne peut être soldé qu’après confirmation de livraison (POD).',
      }
    }

    const nowStr = formatCurrentDateTimeFr()
    const paymentProvider = getPaymentProvider('mock')
    const payResult = await paymentProvider.createPayment({
      amount: stl.remainingBalance,
      currency: 'FCFA',
      reference: `SETTLE-${stl.missionCode}-${Date.now()}`,
      description: `Règlement solde transporteur mission ${stl.missionCode}`,
      payerName: 'Teranga Connect Escrow',
    })

    const newPayment: PaymentRecord = {
      id: `pay-stl-${Date.now()}`,
      reference: payResult.reference,
      amount: stl.remainingBalance,
      currency: 'FCFA',
      type: 'settlement',
      relatedEntityId: stl.id,
      status: 'successful',
      provider: 'mock',
      providerTransactionId: payResult.transactionId,
      payerName: 'Teranga Connect Escrow',
      createdAt: nowStr,
      completedAt: nowStr,
      isSimulated: true,
    }

    setPayments((prev) => [newPayment, ...prev])

    setSettlements((prev) =>
      prev.map((s) =>
        s.id === stl.id
          ? {
              ...s,
              status: 'settled',
              settledAt: nowStr,
              notes: 'Règlement solde final versé avec succès au transporteur (Démonstration).',
            }
          : s
      )
    )

    addNotification({
      type: 'payment',
      title: 'Règlement solde effectué',
      message: `Le solde final de ${formatFcfa(stl.remainingBalance)} pour la mission ${stl.missionCode} a été versé sur votre compte (Démonstration).`,
      relatedId: missionId,
      link: `/missions/${missionId}`,
      targetRole: 'truck_owner',
    })

    addNotification({
      type: 'payment',
      title: 'Clôture financière de mission',
      message: `Le dossier financier de la mission ${stl.missionCode} a été entièrement soldé et archivé.`,
      relatedId: missionId,
      link: `/missions/${missionId}`,
      targetRole: 'shipper',
    })

    return {
      success: true,
      message: `Règlement de ${formatFcfa(stl.remainingBalance)} validé et versé (Simulation démo).`,
    }
  }

  const getVoucherForMission = (missionId: string): FuelVoucher | undefined => {
    return fuelVouchers.find((v) => v.missionId === missionId)
  }

  const issueFuelVoucherForMission = async (
    missionId: string,
    preferredNetwork: 'Total' | 'Elton' | 'Shell' | 'Oryx' = 'Total'
  ): Promise<FuelVoucher | null> => {
    const targetMission = missions.find((m) => m.id === missionId)
    if (!targetMission) return null

    const existing = fuelVouchers.find((v) => v.missionId === missionId)
    if (existing) return existing

    const amount =
      targetMission.advanceAmountFcfa ||
      Math.round(targetMission.estimatedAmountFcfa * 0.10)

    const provider = new MockFuelVoucherProvider()
    const voucher = await provider.issueVoucher({
      missionId,
      missionCode: targetMission.missionCode,
      amount,
      beneficiaryId: targetMission.driverId,
      beneficiaryName: targetMission.driverName,
      preferredStationNetwork: preferredNetwork,
    })

    setFuelVouchers((prev) => [voucher, ...prev])
    return voucher
  }

  const redeemFuelVoucher = async (voucherId: string): Promise<boolean> => {
    const voucher = fuelVouchers.find((v) => v.id === voucherId)
    if (!voucher) return false

    const provider = new MockFuelVoucherProvider()
    const updated = await provider.redeemVoucher(voucher)

    setFuelVouchers((prev) => prev.map((v) => (v.id === voucherId ? updated : v)))

    addNotification({
      type: 'payment',
      title: 'Bon carburant consommé',
      message: `Le bon carburant ${voucher.reference} de ${formatFcfa(voucher.amount)} a été émargé en station partenaire.`,
      targetRole: 'driver',
    })

    return true
  }

  const addBusinessIntroducer = (data: {
    name: string
    phone: string
    city: string
    notes?: string
  }): BusinessIntroducer => {
    const newIntro: BusinessIntroducer = {
      id: `intro-${Date.now()}`,
      name: data.name,
      phone: data.phone,
      city: data.city,
      status: 'active',
      introducedMissions: 0,
      commissionStatus: 'Règles de commission à définir',
      notes: data.notes || 'Nouvel apporteur d’affaires enregistré.',
      createdAt: formatCurrentDateTimeFr(),
    }

    setBusinessIntroducers((prev) => [newIntro, ...prev])

    addNotification({
      type: 'system',
      title: 'Nouvel apporteur d’affaires enregistré',
      message: `${newIntro.name} a été référencé comme intermédiaire partenaire.`,
      targetRole: 'admin',
      link: '/admin',
    })

    return newIntro
  }

  const toggleIntroducerStatus = (
    id: string,
    newStatus: 'pending' | 'active' | 'suspended'
  ): boolean => {
    setBusinessIntroducers((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
    )
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
    setShipper(MOCK_SHIPPER)
    setActiveRoleState('truck_owner')
    setTrucks(MOCK_TRUCKS)
    setOpportunities(MOCK_OPPORTUNITIES)
    setApplications(MOCK_APPLICATIONS)
    setMissions(MOCK_MISSIONS)
    setDriverStatusState('available')
    setInterestedOpportunityIds(Array.from(new Set(MOCK_APPLICATIONS.map((a) => a.opportunityId))))
    setNotifications(MOCK_NOTIFICATIONS)
    setSubscriptions(subscriptionRepository.getSubscriptions())
    setSettlements(settlementRepository.getSettlements())
    setFuelVouchers(fuelVoucherRepository.getVouchers())
    setBusinessIntroducers(businessIntroducerRepository.getIntroducers())
    setPayments(paymentRepository.getPayments())
  }

  return (
    <TransportContext.Provider
      value={{
        owner,
        driver,
        shipper,
        activeRole,
        setActiveRole,
        updateOwnerProfile,
        updateDriverProfile,
        updateShipperProfile,
        trucks,
        opportunities,
        trips,
        applications,
        missions,
        driverStatus,
        interestedOpportunityIds,
        notifications: roleNotifications,
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
        confirmPickup,
        startTransit,
        signalArrival,
        confirmDelivery,
        subscriptions,
        userSubscription,
        subscribeToMonthlyPlan,
        cancelSubscription,
        settlements,
        getSettlementByMissionId,
        fundMissionByShipper,
        releaseTransporterSettlement,
        fuelVouchers,
        getVoucherForMission,
        issueFuelVoucherForMission,
        redeemFuelVoucher,
        businessIntroducers,
        addBusinessIntroducer,
        toggleIntroducerStatus,
        payments,
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
