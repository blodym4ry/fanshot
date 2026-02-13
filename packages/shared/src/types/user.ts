export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  freeCredits: number;
  paidCredits: number;
  totalGenerations: number;
  referredBy: string | null;
  referralCode: string;
  createdAt: string;
  updatedAt: string;
}
