import type { FuelVoucher } from '../../types'
import type { FuelVoucherProvider, IssueVoucherRequest } from './FuelVoucherProvider'

/**
 * Fournisseur simulé de bons de carburant numériques
 * ⚠️ AVIS OBLIGATOIRE :
 * "Bon carburant simulé — intégration fournisseur à venir"
 * Partenaires ciblés par Teranga Connect : Total, Elton, Shell, Oryx.
 */
export class MockFuelVoucherProvider implements FuelVoucherProvider {
  readonly providerName = 'MockFuelVoucherProvider'
  readonly isConfigured = true

  async issueVoucher(req: IssueVoucherRequest): Promise<FuelVoucher> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const providerNetwork = req.preferredStationNetwork || 'Total'
    const randomCode = Math.floor(100000 + Math.random() * 900000)
    const reference = `BC-${providerNetwork.toUpperCase()}-${randomCode}`

    const voucher: FuelVoucher = {
      id: `voucher-${Date.now()}-${Math.floor(10 + Math.random() * 90)}`,
      missionId: req.missionId,
      missionCode: req.missionCode,
      amount: req.amount,
      beneficiaryId: req.beneficiaryId,
      beneficiaryName: req.beneficiaryName,
      status: 'issued',
      provider: providerNetwork,
      reference,
      stationPartner: `Station ${providerNetwork} Autoroute Diamniadio / Thiès`,
      issuedAt: new Date().toISOString(),
      notes: 'Bon carburant simulé — intégration fournisseur à venir (Total, Elton, Shell, Oryx)',
    }

    return voucher
  }

  async redeemVoucher(voucher: FuelVoucher, stationCode?: string): Promise<FuelVoucher> {
    await new Promise((resolve) => setTimeout(resolve, 200))

    return {
      ...voucher,
      status: 'used',
      usedAt: new Date().toISOString(),
      notes: `Utilisé à ${stationCode || voucher.stationPartner || 'Station partenaire'} (Simulé)`,
    }
  }

  async cancelVoucher(voucher: FuelVoucher, reason?: string): Promise<FuelVoucher> {
    return {
      ...voucher,
      status: 'cancelled',
      notes: reason || 'Bon carburant annulé.',
    }
  }
}
