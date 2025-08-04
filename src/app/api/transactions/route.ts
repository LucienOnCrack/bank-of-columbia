import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const sessionData = getCurrentUserFromRequest(request);
    
    if (!sessionData) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Create admin client to fetch transactions
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    console.log('API: Fetching transactions for user ID:', sessionData.userId);
    console.log('API: User data:', sessionData);

    // First, let's get all transactions to see what we have (simplified query)
    const { data: allTransactions, error: allError } = await supabaseAdmin
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    console.log('API: All transactions in DB:', allTransactions);

    // Now fetch user's specific transactions with simplified query
    const { data: transactions, error } = await supabaseAdmin
      .from('transactions')
      .select('*')
      .eq('user_id', sessionData.userId)
      .order('created_at', { ascending: false })
      .limit(50);

    console.log('API: User specific transactions:', transactions);

    if (error) {
      console.error('Error fetching transactions:', error);
      return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
    }

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error('Transaction API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}