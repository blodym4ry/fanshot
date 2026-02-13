export type CreditTransactionType =
  | 'purchase'
  | 'free_signup'
  | 'referral_bonus'
  | 'generation_spend';

export interface CreditTransaction {
  id: string;
  userId: string;
  amount: number;
  type: CreditTransactionType;
  stripePaymentId: string | null;
  packageName: string | null;
  createdAt: string;
}

export interface CreditPackage {
  id: string;
  name: string;
  displayName: string;
  credits: number;
  priceUsd: number;
  stripePriceId: string;
  isActive: boolean;
  createdAt: string;
}
