import type { Truck, Driver, Owner, Shipper } from '../types'
import { STORAGE_KEYS, loadFromStorage, saveToStorage } from '../lib/storage'
import { MOCK_TRUCKS, MOCK_DRIVER, MOCK_OWNER, MOCK_SHIPPER } from '../data/mockData'

/**
 * Repository abstrayant l'accès aux données des transporteurs, camions et profils
 * Permettra la bascule ultérieure vers PostgreSQL / API REST sans modifier les composants
 */
export class TransportRepository {
  // --- Camions ---
  getTrucks(): Truck[] {
    return loadFromStorage<Truck[]>(STORAGE_KEYS.TRUCKS, MOCK_TRUCKS)
  }

  saveTrucks(trucks: Truck[]): boolean {
    return saveToStorage(STORAGE_KEYS.TRUCKS, trucks)
  }

  addTruck(truck: Truck): Truck[] {
    const list = this.getTrucks()
    const updated = [truck, ...list]
    this.saveTrucks(updated)
    return updated
  }

  // --- Profils ---
  getOwner(): Owner {
    return loadFromStorage<Owner>(STORAGE_KEYS.OWNER, MOCK_OWNER)
  }

  saveOwner(owner: Owner): boolean {
    return saveToStorage(STORAGE_KEYS.OWNER, owner)
  }

  getDriver(): Driver {
    return loadFromStorage<Driver>(STORAGE_KEYS.DRIVER, MOCK_DRIVER)
  }

  saveDriver(driver: Driver): boolean {
    return saveToStorage(STORAGE_KEYS.DRIVER, driver)
  }

  getShipper(): Shipper {
    return loadFromStorage<Shipper>(STORAGE_KEYS.SHIPPER, MOCK_SHIPPER)
  }

  saveShipper(shipper: Shipper): boolean {
    return saveToStorage(STORAGE_KEYS.SHIPPER, shipper)
  }
}

export const transportRepository = new TransportRepository()
