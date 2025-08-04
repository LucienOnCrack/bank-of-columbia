import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

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

// GET - Fetch property by code with mortgage information
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const sessionData = getCurrentUserFromRequest(request);
    
    if (!sessionData) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { data: currentUser, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', sessionData.userId)
      .single();

    if (userError || !currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (currentUser.role !== 'employee' && currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { code } = await params;
    
    // Fetch property by code
    const { data: property, error: propertyError } = await supabaseAdmin
      .from('properties')
      .select('*')
      .eq('code', code)
      .single();

    if (propertyError) {
      console.error('Error fetching property:', propertyError);
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // Fetch mortgage data for this property
    const { data: mortgage, error: mortgageError } = await supabaseAdmin
      .from('mortgages')
      .select(`
        *,
        user:user_id(id, roblox_name, roblox_id),
        created_by_user:created_by(id, roblox_name)
      `)
      .eq('property_id', property.id)
      .single();

    // If no mortgage exists, return property data without mortgage info
    if (mortgageError) {
      return NextResponse.json({ 
        property,
        mortgage: null 
      });
    }

    // Fetch mortgage payments to calculate total paid
    const { data: payments, error: paymentsError } = await supabaseAdmin
      .from('mortgage_payments')
      .select('amount')
      .eq('mortgage_id', mortgage.id);

    if (paymentsError) {
      console.error('Error fetching mortgage payments:', paymentsError);
    }

    // Calculate total payments made
    const totalPayments = payments?.reduce((sum, payment) => sum + parseFloat(payment.amount), 0) || 0;

    return NextResponse.json({ 
      property,
      mortgage: {
        ...mortgage,
        totalPayments
      }
    });
  } catch (error) {
    console.error('Property by code GET API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}