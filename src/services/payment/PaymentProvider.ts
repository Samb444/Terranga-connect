/**
 * Interface canonique pour les passerelles de paiement (Mobile Money & Démo)
 * Permet l'interchangeabilité propre entre Mock, Wave et Orange Money
 */

export interface PaymentRequest {
  amount: number
  currency: string
  reference: string
  description: string
  payerName: string
  payerPhone?: string
  metadata?: Record<string, unknown>
}

export interface PaymentResult {
  success: boolean
  transactionId?: string
  reference: string
  status: 'pending' | 'successful' | 'failed'
  provider: 'mock' | 'wave' | 'orange_money'
  message: string
  isSimulated: boolean
  timestamp: string
}

export interface PaymentProvider {
  readonly providerName: string
  readonly isConfigured: boolean
  createPayment(req: PaymentRequest): Promise<PaymentResult>
  checkPaymentStatus(reference: string): Promise<PaymentResult>
  refundPayment(reference: string, amount?: number): Promise<PaymentResult>
}
