export type PaymentFrequency = 'daily' | 'weekly';
export type MortgageStatus = 'active' | 'completed' | 'defaulted';

export interface MortgageData {
  id: string;
  propertyId: string;
  userId: string;
  amountTotal: number;
  amountPaid: number;
  startDate: string; // ISO date string
  paymentFrequency: PaymentFrequency;
  durationDays: number;
  nextPaymentDue: string; // ISO date string
  lastPaymentDate?: string; // ISO date string
  status: MortgageStatus;
  initialDeposit: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  
  // Related data
  property?: {
    id: string;
    code: string;
    municipality: string;
    neighbourhood: string;
    holderRobloxName: string;
  };
  user?: {
    id: string;
    roblox_name: string;
    roblox_id: string;
  };
  createdByUser?: {
    id: string;
    roblox_name: string;
  };
}

export interface MortgageFormData {
  propertyId: string;
  userId: string;
  amountTotal: number;
  startDate: string;
  paymentFrequency: PaymentFrequency;
  durationDays: number;
  initialDeposit: number;

}

export interface MortgagePaymentData {
  id: string;
  mortgageId: string;
  amount: number;
  paymentDate: string; // ISO date string
  paymentMethod?: string;
  notes?: string;
  created_at: string;
  created_by: string;
  
  // Related data
  createdByUser?: {
    id: string;
    roblox_name: string;
  };
}

export interface MortgageCalculations {
  totalScheduledPayments: number;
  amountPerPayment: number;
  remainingBalance: number;
  totalPayments: number;
  remainingPayments: number;
  daysOverdue: number;
  isOverdue: boolean;
  nextPaymentAmount: number;
  progressPercentage: number;
} 