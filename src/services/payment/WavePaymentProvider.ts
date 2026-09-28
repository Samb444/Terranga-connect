import type { PaymentProvider, PaymentRequest, PaymentResult } from './PaymentProvider'

/**
 * Adapter Wave Payment
 * ⚠️ STATUT : Mode non configuré (Attente des contrats marchands et clés API officielles)
 * Ne jamais inventer de credentials ou simuler une fausse transaction réussie sur cette classe.
 */
export class WavePaymentProvider implements PaymentProvider {
  readonly providerName = 'wave'

  get isConfigured(): boolean {
    const apiKey = import.meta.env.VITE_WAVE_API_KEY
    const merchantId = import.meta.env.VITE_WAVE_MERCHANT_ID
    return Boolean(apiKey && merchantId && apiKey.trim() !== '' && merchantId.trim() !== '')
  }

  async createPayment(req: PaymentRequest): Promise<PaymentResult> {
    if (!this.isConfigured) {
      return {
        success: false,
        reference: req.reference,
        status: 'failed',
        provider: 'wave',
        message:
          'Passerelle Wave non configurée : clés API marchandes (VITE_WAVE_API_KEY, VITE_WAVE_MERCHANT_ID) non renseignées dans l’environnement. Veuillez utiliser le mode démonstration.',
        isSimulated: false,
        timestamp: new Date().toISOString(),
      }
    }

    throw new Error('Intégration Wave API en cours d’homologation.')
  }

  async checkPaymentStatus(reference: string): Promise<PaymentResult> {
    return {
      success: false,
      reference,
      status: 'failed',
      provider: 'wave',
      message: 'Vérification Wave impossible : passerelle non configurée.',
      isSimulated: false,
      timestamp: new Date().toISOString(),
    }
  }

  async refundPayment(reference: string, _amount?: number): Promise<PaymentResult> {
    return {
      success: false,
      reference,
      status: 'failed',
      provider: 'wave',
      message: 'Remboursement Wave impossible : passerelle non configurée.',
      isSimulated: false,
      timestamp: new Date().toISOString(),
    }
  }
}
