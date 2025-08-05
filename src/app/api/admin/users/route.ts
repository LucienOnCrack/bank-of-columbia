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

    // Check if user has admin or employee role (using fresh data from database)
    if (currentUser.role !== 'admin' && currentUser.role !== 'employee') {
      // Access denied - insufficient permissions
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Admin accessing users endpoint

    // Fetch all users
    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Admin users API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
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

    // Only admins can update user roles
    if (currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const { userId, role, balance, transactionType, transactionAmount } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Handle role update
    if (role) {
      if (!['user', 'employee', 'admin'].includes(role)) {
        return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
      }

      const { error: updateError } = await supabaseAdmin
        .from('users')
        .update({ role })
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating user role:', updateError);
        return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 });
      }
    }

    // Handle balance update and transaction creation
    if (balance !== undefined && transactionType && transactionAmount) {
      const amount = parseFloat(transactionAmount);
      
      // Update user balance
      const { error: balanceError } = await supabaseAdmin
        .from('users')
        .update({ balance })
        .eq('id', userId);

      if (balanceError) {
        console.error('Error updating user balance:', balanceError);
        return NextResponse.json({ error: 'Failed to update user balance' }, { status: 500 });
      }

      // Create transaction record
      const { error: transactionError } = await supabaseAdmin
        .from('transactions')
        .insert({
          user_id: userId,
          amount: transactionType === 'deposit' ? amount : -amount,
          type: transactionType,
          description: `Admin ${transactionType}: $${amount}`,
          from_user: `Admin: ${currentUser.roblox_name}`,
          created_by: currentUser.id
        });

      if (transactionError) {
        console.error('Error creating transaction:', transactionError);
        // Don't fail the whole request if transaction creation fails, just log it
      }
    }

    // Fetch updated user data
    const { data: updatedUser, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (fetchError || !updatedUser) {
      console.error('Error fetching updated user:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch updated user' }, { status: 500 });
    }

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Admin users PUT API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 