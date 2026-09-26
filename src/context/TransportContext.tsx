import React, { createContext, useState } from 'react'
import type { Truck, Driver, Owner, Opportunity, Trip } from '../types'
import {
  MOCK_OWNER,
  MOCK_DRIVER,
  MOCK_TRUCKS,
  MOCK_OPPORTUNITIES,
  MOCK_TRIPS,
} from '../data/mockData'

interface TransportContextType {
  owner: Owner
  driver: Driver
  trucks: Truck[]
  opportunities: Opportunity[]
  trips: Trip[]
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
  recordInterest: (opportunityId: string) => boolean
  isInterested: (opportunityId: string) => boolean
}

const TransportContext = createContext<TransportContextType | undefined>(undefined)

export const TransportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [owner] = useState<Owner>(MOCK_OWNER)
  const [driver, setDriver] = useState<Driver>(MOCK_DRIVER)
  const [trucks, setTrucks] = useState<Truck[]>(MOCK_TRUCKS)
  const [opportunities, setOpportunities] = useState<Opportunity[]>(MOCK_OPPORTUNITIES)
  const [trips] = useState<Trip[]>(MOCK_TRIPS)
  const [driverStatus, setDriverStatusState] = useState<'available' | 'unavailable'>('available')
  const [interestedOpportunityIds, setInterestedOpportunityIds] = useState<string[]>([])

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
    // Nettoyer la plaque pour s'assurer qu'elle reste fictive
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
      distanceKm: 120, // Valeur indicative pour la démo
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

  const recordInterest = (opportunityId: string): boolean => {
    if (!interestedOpportunityIds.includes(opportunityId)) {
      setInterestedOpportunityIds((prev) => [...prev, opportunityId])
      return true
    }
    return false
  }

  const isInterested = (opportunityId: string): boolean => {
    return interestedOpportunityIds.includes(opportunityId)
  }

  return (
    <TransportContext.Provider
      value={{
        owner,
        driver,
        trucks,
        opportunities,
        trips,
        driverStatus,
        interestedOpportunityIds,
        toggleDriverStatus,
        setDriverStatus,
        addTruck,
        publishOpportunity,
        recordInterest,
        isInterested,
      }}
    >
      {children}
    </TransportContext.Provider>
  )
}

export { TransportContext }
