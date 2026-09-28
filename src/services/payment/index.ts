import type { PaymentProvider } from './PaymentProvider'
import { MockPaymentProvider } from './MockPaymentProvider'
import { WavePaymentProvider } from './WavePaymentProvider'
import { OrangeMoneyPaymentProvider } from './OrangeMoneyPaymentProvider'

export * from './PaymentProvider'
export * from './MockPaymentProvider'
export * from './WavePaymentProvider'
export * from './OrangeMoneyPaymentProvider'

export type SupportedPaymentProviderId = 'mock' | 'wave' | 'orange_money'

const providers: Record<SupportedPaymentProviderId, PaymentProvider> = {
  mock: new MockPaymentProvider(),
  wave: new WavePaymentProvider(),
  orange_money: new OrangeMoneyPaymentProvider(),
}

export function getPaymentProvider(id: SupportedPaymentProviderId = 'mock'): PaymentProvider {
  return providers[id] || providers.mock
}
