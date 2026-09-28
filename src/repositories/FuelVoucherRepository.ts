import type { FuelVoucher } from '../types'
import { STORAGE_KEYS, loadFromStorage, saveToStorage } from '../lib/storage'

export const INITIAL_DEMO_FUEL_VOUCHERS: FuelVoucher[] = [
  {
    id: 'voucher-demo-1',
    missionId: 'mission-demo-3',
    missionCode: 'MSN-DKR-KLK-03',
    amount: 57600,
    beneficiaryId: 'driver-demo-1',
    beneficiaryName: 'Ibrahima Ndiaye',
    status: 'issued',
    provider: 'Total',
    reference: 'BC-TOTAL-894102',
    stationPartner: 'Total Station Diamniadio Sortie Autoroute',
    issuedAt: '26 septembre 2026 — 11:00',
    notes: 'Bon carburant simulé — intégration fournisseur à venir (Total, Elton, Shell, Oryx)',
  },
  {
    id: 'voucher-demo-2',
    missionId: 'mission-demo-1',
    missionCode: 'MSN-DKR-TOU-01',
    amount: 35000,
    beneficiaryId: 'driver-demo-1',
    beneficiaryName: 'Ibrahima Ndiaye',
    status: 'used',
    provider: 'Shell',
    reference: 'BC-SHELL-441290',
    stationPartner: 'Shell Échangeur Thies Ouest',
    issuedAt: '24 septembre 2026 — 08:45',
    usedAt: '24 septembre 2026 — 12:15',
    notes: 'Bon carburant validé et consommé sur le corridor.',
  },
]

export class FuelVoucherRepository {
  getVouchers(): FuelVoucher[] {
    return loadFromStorage<FuelVoucher[]>(
      STORAGE_KEYS.FUEL_VOUCHERS,
      INITIAL_DEMO_FUEL_VOUCHERS
    )
  }

  saveVouchers(vouchers: FuelVoucher[]): boolean {
    return saveToStorage(STORAGE_KEYS.FUEL_VOUCHERS, vouchers)
  }

  getVouchersByBeneficiary(beneficiaryId: string): FuelVoucher[] {
    return this.getVouchers().filter((v) => v.beneficiaryId === beneficiaryId)
  }

  getVoucherByMissionId(missionId: string): FuelVoucher | undefined {
    return this.getVouchers().find((v) => v.missionId === missionId)
  }

  upsertVoucher(voucher: FuelVoucher): FuelVoucher[] {
    const list = this.getVouchers()
    const index = list.findIndex((v) => v.id === voucher.id)

    let updated: FuelVoucher[]
    if (index >= 0) {
      updated = [...list]
      updated[index] = voucher
    } else {
      updated = [voucher, ...list]
    }

    this.saveVouchers(updated)
    return updated
  }
}

export const fuelVoucherRepository = new FuelVoucherRepository()
