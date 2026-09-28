import type { PaymentProvider, PaymentRequest, PaymentResult } from './PaymentProvider'

/**
 * Adapter Orange Money Payment
 * ⚠️ STATUT : Mode non configuré (Attente des contrats marchands et clés API officielles)
 * Ne jamais inventer de credentials ou simuler une fausse transaction réussie sur cette classe.
 */
export class OrangeMoneyPaymentProvider implements PaymentProvider {
  readonly providerName = 'orange_money'

  get isConfigured(): boolean {
    const clientId = import.meta.env.VITE_ORANGE_MONEY_CLIENT_ID
    const clientSecret = import.meta.env.VITE_ORANGE_MONEY_CLIENT_SECRET
    return Boolean(clientId && clientSecret && clientId.trim() !== '' && clientSecret.trim() !== '')
  }

  async createPayment(req: PaymentRequest): Promise<PaymentResult> {
    if (!this.isConfigured) {
      return {
        success: false,
        reference: req.reference,
        status: 'failed',
        provider: 'orange_money',
        message:
          'Passerelle Orange Money non configurée : identifiants marchands (VITE_ORANGE_MONEY_CLIENT_ID, VITE_ORANGE_MONEY_CLIENT_SECRET) non renseignés dans l’environnement. Veuillez utiliser le mode démonstration.',
        isSimulated: false,
        timestamp: new Date().toISOString(),
      }
    }

    throw new Error('Intégration Orange Money API en cours d’homologation.')
  }

  async checkPaymentStatus(reference: string): Promise<PaymentResult> {
    return {
      success: false,
      reference,
      status: 'failed',
      provider: 'orange_money',
      message: 'Vérification Orange Money impossible : passerelle non configurée.',
      isSimulated: false,
      timestamp: new Date().toISOString(),
    }
  }

  async refundPayment(reference: string, _amount?: number): Promise<PaymentResult> {
    return {
      success: false,
      reference,
      status: 'failed',
      provider: 'orange_money',
      message: 'Remboursement Orange Money impossible : passerelle non configurée.',
      isSimulated: false,
      timestamp: new Date().toISOString(),
    }
  }
}
