export type UserRole = 'user' | 'employee' | 'admin';

export type TransactionType = 
  | 'deposit' 
  | 'withdrawal' 
  | 'property_purchase' 
  | 'property_sale' 
  | 'property_assignment'
  | 'mortgage_payment'
  | 'rent_payment'
  | 'fee_payment';

export interface User {
  id: string;
  roblox_id: string;
  roblox_name: string;
  profile_picture?: string; // Roblox avatar URL
  role: UserRole;
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  owner_id: string | null;
  address: string;
  description?: string;
  value: number;
  assigned_by: string;
  created_at: string;
  updated_at: string;
  // Relations
  owner?: User;
  assigned_by_user?: User;
}

export interface Transaction {
  id: string;
  user_id: string;
  property_id?: string;
  mortgage_id?: string;
  type: TransactionType;
  amount: number;
  description?: string;
  payment_method?: string;
  payment_date?: string;
  notes?: string;
  created_by: string;
  created_at: string;
  // Relations
  user?: User;
  property?: Property;
  created_by_user?: User;
}

export interface RobloxUser {
  id: string;
  username: string;
  displayName: string;
} 