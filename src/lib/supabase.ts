import { createClient } from '@supabase/supabase-js';
import { User, Property, Transaction } from '@/types/user';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database type definitions for Supabase
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>;
      };
      properties: {
        Row: Property;
        Insert: Omit<Property, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Property, 'id' | 'created_at' | 'updated_at'>>;
      };
      transactions: {
        Row: Transaction;
        Insert: Omit<Transaction, 'id' | 'created_at'>;
        Update: Partial<Omit<Transaction, 'id' | 'created_at'>>;
      };
    };
  };
}

// Typed Supabase client
export const typedSupabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper functions for common database operations
export const userOperations = {
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    const { data, error } = await typedSupabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createUser(userData: Database['public']['Tables']['users']['Insert']) {
    const { data, error } = await typedSupabase
      .from('users')
      .insert(userData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateUserRole(userId: string, role: User['role']) {
    const { data, error } = await typedSupabase
      .from('users')
      .update({ role })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateUserBalance(userId: string, balance: number) {
    const { data, error } = await typedSupabase
      .from('users')
      .update({ balance })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getAllUsers() {
    const { data, error } = await typedSupabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};

export const propertyOperations = {
  async getUserProperties(userId: string) {
    const { data, error } = await typedSupabase
      .from('properties')
      .select(`
        *,
        assigned_by_user:assigned_by(roblox_name)
      `)
      .eq('owner_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getAllProperties() {
    const { data, error } = await typedSupabase
      .from('properties')
      .select(`
        *,
        owner:owner_id(roblox_name),
        assigned_by_user:assigned_by(roblox_name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createProperty(propertyData: Database['public']['Tables']['properties']['Insert']) {
    const { data, error } = await typedSupabase
      .from('properties')
      .insert(propertyData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async assignProperty(propertyId: string, ownerId: string) {
    const { data, error } = await typedSupabase
      .from('properties')
      .update({ owner_id: ownerId })
      .eq('id', propertyId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

export const transactionOperations = {
  async getUserTransactions(userId: string) {
    const { data, error } = await typedSupabase
      .from('transactions')
      .select(`
        *,
        property:property_id(address),
        created_by_user:created_by(roblox_name)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createTransaction(transactionData: Database['public']['Tables']['transactions']['Insert']) {
    const { data, error } = await typedSupabase
      .from('transactions')
      .insert(transactionData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getAllTransactions() {
    const { data, error } = await typedSupabase
      .from('transactions')
      .select(`
        *,
        user:user_id(roblox_name),
        property:property_id(address),
        created_by_user:created_by(roblox_name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
}; 