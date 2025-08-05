import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    // Get current user
    const user = await getCurrentUser();
    
    if (!user) {
      console.log('No user found in petition submission');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    console.log('User found for petition:', { id: user.userId, username: user.username });

    // Parse request body
    const body = await request.json();
    const {
      currentCustomer,
      mortgagePayments,
      rentPayments,
      savingsAccount,
      creditCard
    } = body;

    // Validate required fields
    if (
      typeof currentCustomer !== 'string' ||
      typeof mortgagePayments !== 'string' ||
      typeof rentPayments !== 'string' ||
      typeof savingsAccount !== 'string' ||
      typeof creditCard !== 'string'
    ) {
      return NextResponse.json(
        { error: 'All petition responses are required' },
        { status: 400 }
      );
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

    // Convert string responses to boolean
    const petitionData = {
      user_id: user.userId,
      roblox_username: user.username,
      current_customer: currentCustomer === 'yes',
      interested_mortgage_payments: mortgagePayments === 'yes',
      interested_rent_payments: rentPayments === 'yes',
      interested_savings_account: savingsAccount === 'yes',
      interested_credit_card: creditCard === 'yes'
    };

    console.log('Petition data to insert:', petitionData);

    // Insert petition signature (or update if already exists due to UNIQUE constraint)
    const { data, error } = await supabaseAdmin
      .from('petition_signatures')
      .upsert([petitionData], {
        onConflict: 'user_id',
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving petition signature:', error);
      return NextResponse.json(
        { 
          error: 'Failed to save petition signature',
          details: error.message,
          code: error.code 
        },
        { status: 500 }
      );
    }

    // Get total signature count
    const { count, error: countError } = await supabaseAdmin
      .from('petition_signatures')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error counting signatures:', countError);
      // Continue without count rather than failing
    }

    return NextResponse.json({
      success: true,
      message: 'Petition signed successfully',
      signature: data,
      totalSignatures: count || 0
    });

  } catch (error) {
    console.error('Petition submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve petition signature count (public) or full signatures (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const countOnly = searchParams.get('count') === 'true';
    const checkSigned = searchParams.get('checkSigned') === 'true';

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

    if (countOnly) {
      // Public endpoint - just return count
      const { count, error } = await supabaseAdmin
        .from('petition_signatures')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Error counting signatures:', error);
        return NextResponse.json(
          { error: 'Failed to count signatures' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        totalCount: count || 0
      });
    }

    // Check if current user has signed (authenticated access)
    if (checkSigned) {
      const user = await getCurrentUser();
      
      if (!user) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      const { data, error } = await supabaseAdmin
        .from('petition_signatures')
        .select('id')
        .eq('user_id', user.userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
        console.error('Error checking user signature:', error);
        return NextResponse.json(
          { error: 'Failed to check signature status' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        hasSigned: !!data
      });
    }

    // Full data endpoint - requires authentication
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user is employee or admin
    if (!['employee', 'admin'].includes(user.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Get all petition signatures
    const { data: signatures, error } = await supabaseAdmin
      .from('petition_signatures')
      .select('*')
      .order('signed_at', { ascending: false });

    if (error) {
      console.error('Error fetching petition signatures:', error);
      return NextResponse.json(
        { error: 'Failed to fetch petition signatures' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      signatures,
      totalCount: signatures.length
    });

  } catch (error) {
    console.error('Petition fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}