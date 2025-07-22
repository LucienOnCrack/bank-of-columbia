import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const sessionData = getCurrentUserFromRequest(request);
    
    if (!sessionData) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Create admin client for server-side operations
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

    // Fetch fresh user data from database to check current role
    const { data: currentUser, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', sessionData.userId)
      .single();

    if (userError || !currentUser) {
      console.error('Error fetching current user:', userError);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has admin role (using fresh data from database)
    if (currentUser.role !== 'admin') {
      console.log(`Access denied for user ${currentUser.roblox_name} with role ${currentUser.role}`);
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    console.log(`User ${currentUser.roblox_name} (${currentUser.role}) accessing admin transactions endpoint`);

    // Fetch all transactions with related data
    const { data: transactions, error } = await supabaseAdmin
      .from('transactions')
      .select(`
        *
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
      return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
    }

    // Fetch related data separately to avoid join issues
    const transactionIds = transactions?.map(t => t.id) || [];
    
    // Get related users
    const { data: users } = await supabaseAdmin
      .from('users')
      .select('id, roblox_name, roblox_id');
    
    // Get related properties  
    const { data: properties } = await supabaseAdmin
      .from('properties')
      .select('id, code, municipality, neighbourhood');
      
    // Get related mortgages with borrower information
    const { data: mortgages } = await supabaseAdmin
      .from('mortgages')
      .select(`
        id, 
        amount_total,
        user_id,
        user:user_id(id, roblox_name, roblox_id)
      `);

    // Map the data together
    const enrichedTransactions = transactions?.map(transaction => ({
      ...transaction,
      user: users?.find(u => u.id === transaction.user_id),
      property: properties?.find(p => p.id === transaction.property_id),
      mortgage: mortgages?.find(m => m.id === transaction.mortgage_id),
      created_by_user: users?.find(u => u.id === transaction.created_by)
    })) || [];

    return NextResponse.json({ transactions: enrichedTransactions });
  } catch (error) {
    console.error('Admin transactions API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create manual transaction
export async function POST(request: NextRequest) {
  try {
    const sessionData = getCurrentUserFromRequest(request);
    
    if (!sessionData) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Create admin client for server-side operations
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

    // Fetch fresh user data from database to check current role
    const { data: currentUser, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', sessionData.userId)
      .single();

    if (userError || !currentUser) {
      console.error('Error fetching current user:', userError);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has admin role
    if (currentUser.role !== 'admin') {
      console.log(`Access denied for user ${currentUser.roblox_name} with role ${currentUser.role}`);
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const { fromUser, amount, description, date, type } = body;

    // Validate required fields
    if (!fromUser || !fromUser.trim() || !amount || !description || !date) {
      return NextResponse.json({ error: 'Missing required fields: fromUser, amount, description, date' }, { status: 400 });
    }

    // Use description as is, no need to add from info since it's in a separate column

    // Create transaction
    const transactionData = {
      user_id: currentUser.id, // All transactions are for the company, use current user as reference
      type: type || 'deposit',
      amount: parseFloat(amount),
      description: description,
      payment_date: date,
      notes: fromUser && fromUser.trim() ? fromUser.trim() : null, // Store from user in notes field
      created_by: currentUser.id
    };

    const { data: transaction, error: transactionError } = await supabaseAdmin
      .from('transactions')
      .insert([transactionData])
      .select(`
        *
      `)
      .single();

    if (transactionError) {
      console.error('Error creating transaction:', transactionError);
      console.error('Transaction data that failed:', transactionData);
      return NextResponse.json({ 
        error: 'Failed to create transaction', 
        details: transactionError.message || transactionError 
      }, { status: 500 });
    }

    // Fetch related data for response
    const { data: users } = await supabaseAdmin
      .from('users')
      .select('id, roblox_name, roblox_id');

    // Enrich the transaction with user data
    const enrichedTransaction = {
      ...transaction,
      user: users?.find(u => u.id === transaction.user_id),
      created_by_user: users?.find(u => u.id === transaction.created_by)
    };

    console.log(`User ${currentUser.roblox_name} created manual transaction: ${description}`);

    return NextResponse.json({ transaction: enrichedTransaction }, { status: 201 });
  } catch (error) {
    console.error('Transaction creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 