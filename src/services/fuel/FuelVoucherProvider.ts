import type { FuelVoucher } from '../../types'

export interface IssueVoucherRequest {
  missionId: string
  missionCode: string
  amount: number
  beneficiaryId: string
  beneficiaryName: string
  preferredStationNetwork?: 'Total' | 'Elton' | 'Shell' | 'Oryx'
}

export interface FuelVoucherProvider {
  readonly providerName: string
  readonly isConfigured: boolean
  issueVoucher(req: IssueVoucherRequest): Promise<FuelVoucher>
  redeemVoucher(voucher: FuelVoucher, stationCode?: string): Promise<FuelVoucher>
  cancelVoucher(voucher: FuelVoucher, reason?: string): Promise<FuelVoucher>
}
