import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

// PUT - Update transaction
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
      // Access denied - insufficient permissions
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { id } = await params;
    const transactionId = id;
    const body = await request.json();
    const { fromUser, amount, description, date, type } = body;

    // Validate required fields
    if (!fromUser || !fromUser.trim() || !amount || !description || !date) {
      return NextResponse.json({ error: 'Missing required fields: fromUser, amount, description, date' }, { status: 400 });
    }

    // Use description as is, no need to add from info since it's in a separate column

    // Update transaction
    const updateData = {
      type: type || 'deposit',
      amount: parseFloat(amount),
      description: description,
      payment_date: date,
      notes: fromUser && fromUser.trim() ? fromUser.trim() : null // Store from user in notes field
    };

    const { data: transaction, error: transactionError } = await supabaseAdmin
      .from('transactions')
      .update(updateData)
      .eq('id', transactionId)
      .select(`
        *
      `)
      .single();

    if (transactionError) {
      console.error('Error updating transaction:', transactionError);
      console.error('Update data that failed:', updateData);
      return NextResponse.json({ 
        error: 'Failed to update transaction', 
        details: transactionError.message || transactionError 
      }, { status: 500 });
    }

    // Transaction updated successfully

    return NextResponse.json({ transaction }, { status: 200 });
  } catch (error) {
    console.error('Transaction update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete transaction
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
      // Access denied - insufficient permissions
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { id } = await params;
    const transactionId = id;

    // Delete transaction
    const { error: deleteError } = await supabaseAdmin
      .from('transactions')
      .delete()
      .eq('id', transactionId);

    if (deleteError) {
      console.error('Error deleting transaction:', deleteError);
      return NextResponse.json({ 
        error: 'Failed to delete transaction', 
        details: deleteError.message || deleteError 
      }, { status: 500 });
    }

    // Transaction deleted successfully

    return NextResponse.json({ message: 'Transaction deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Transaction deletion error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 