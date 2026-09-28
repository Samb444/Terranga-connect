import type { PaymentProvider, PaymentRequest, PaymentResult } from './PaymentProvider'

/**
 * Fournisseur de paiement simulé pour l'environnement de démonstration
 * ⚠️ IMPORTANT : Ce service n'exécute aucune transaction financière réelle.
 * Il permet de tester les parcours applicatifs en toute sécurité.
 */
export class MockPaymentProvider implements PaymentProvider {
  readonly providerName = 'mock'
  readonly isConfigured = true

  async createPayment(req: PaymentRequest): Promise<PaymentResult> {
    // Simulation d'une latence réseau réaliste
    await new Promise((resolve) => setTimeout(resolve, 600))

    const txId = `SIM-TX-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`

    return {
      success: true,
      transactionId: txId,
      reference: req.reference,
      status: 'successful',
      provider: 'mock',
      message: 'Paiement simulé — environnement de démonstration',
      isSimulated: true,
      timestamp: new Date().toISOString(),
    }
  }

  async checkPaymentStatus(reference: string): Promise<PaymentResult> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    return {
      success: true,
      transactionId: `SIM-CHK-${Date.now()}`,
      reference,
      status: 'successful',
      provider: 'mock',
      message: 'Paiement simulé vérifié — environnement de démonstration',
      isSimulated: true,
      timestamp: new Date().toISOString(),
    }
  }

  async refundPayment(reference: string, _amount?: number): Promise<PaymentResult> {
    await new Promise((resolve) => setTimeout(resolve, 400))

    return {
      success: true,
      transactionId: `SIM-REF-${Date.now()}`,
      reference,
      status: 'successful',
      provider: 'mock',
      message: 'Remboursement simulé — environnement de démonstration',
      isSimulated: true,
      timestamp: new Date().toISOString(),
    }
  }
}
