import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';
import { MortgageData } from '@/types/mortgage';

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

// Database mortgage type (snake_case from database)
interface DatabaseMortgage {
  id: string;
  property_id: string;
  user_id: string;
  amount_total: number;
  amount_paid: number;
  start_date: string;
  payment_frequency: string;
  duration_days: number;
  next_payment_due: string;
  last_payment_date?: string;
  status: string;
  initial_deposit: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  property?: {
    id: string;
    code: string;
    municipality: string;
    neighbourhood: string;
    holder_roblox_name: string;
  };
  user?: {
    id: string;
    roblox_name: string;
    roblox_id: string;
  };
  created_by_user?: {
    id: string;
    roblox_name: string;
  };
}

// Helper function to transform database fields to frontend format
function transformMortgageForFrontend(dbMortgage: DatabaseMortgage): MortgageData {
  return {
    id: dbMortgage.id,
    propertyId: dbMortgage.property_id,
    userId: dbMortgage.user_id,
    amountTotal: dbMortgage.amount_total,
    amountPaid: dbMortgage.amount_paid,
    startDate: dbMortgage.start_date,
    paymentFrequency: dbMortgage.payment_frequency as 'daily' | 'weekly',
    durationDays: dbMortgage.duration_days,
    nextPaymentDue: dbMortgage.next_payment_due,
    lastPaymentDate: dbMortgage.last_payment_date,
    status: dbMortgage.status as 'active' | 'completed' | 'defaulted',
    initialDeposit: dbMortgage.initial_deposit,
    notes: dbMortgage.notes,
    created_at: dbMortgage.created_at,
    updated_at: dbMortgage.updated_at,
    created_by: dbMortgage.created_by,
    property: dbMortgage.property ? {
      id: dbMortgage.property.id,
      code: dbMortgage.property.code,
      municipality: dbMortgage.property.municipality,
      neighbourhood: dbMortgage.property.neighbourhood,
      holderRobloxName: dbMortgage.property.holder_roblox_name,
    } : undefined,
    user: dbMortgage.user ? {
      id: dbMortgage.user.id,
      roblox_name: dbMortgage.user.roblox_name,
      roblox_id: dbMortgage.user.roblox_id,
    } : undefined,
    createdByUser: dbMortgage.created_by_user ? {
      id: dbMortgage.created_by_user.id,
      roblox_name: dbMortgage.created_by_user.roblox_name,
    } : undefined,
  };
}

// GET - Fetch all mortgages
export async function GET(request: NextRequest) {
  try {
    const sessionData = getCurrentUserFromRequest(request);
    
    if (!sessionData) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Fetch current user to check permissions
    const { data: currentUser, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', sessionData.userId)
      .single();

    if (userError || !currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has employee/admin permissions
    if (currentUser.role !== 'employee' && currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Fetch all mortgages with related data
    const { data: mortgages, error } = await supabaseAdmin
      .from('mortgages')
      .select(`
        *,
        property:property_id(id, code, municipality, neighbourhood, holder_roblox_name),
        user:user_id(id, roblox_name, roblox_id),
        created_by_user:created_by(id, roblox_name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching mortgages:', error);
      return NextResponse.json({ error: 'Failed to fetch mortgages' }, { status: 500 });
    }

    // Transform mortgages to frontend format
    const transformedMortgages = mortgages.map(transformMortgageForFrontend);

    return NextResponse.json({ mortgages: transformedMortgages });
  } catch (error) {
    console.error('Mortgages GET API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new mortgage
export async function POST(request: NextRequest) {
  try {
    const sessionData = getCurrentUserFromRequest(request);
    
    if (!sessionData) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Fetch current user to check permissions
    const { data: currentUser, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', sessionData.userId)
      .single();

    if (userError || !currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has employee/admin permissions
    if (currentUser.role !== 'employee' && currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    
    // Extract mortgage data
    const mortgageData = {
      property_id: body.propertyId,
      user_id: body.userId,
      amount_total: parseFloat(body.amountTotal),
      start_date: body.startDate,
      payment_frequency: body.paymentFrequency,
      duration_days: parseInt(body.durationDays),
      initial_deposit: parseFloat(body.initialDeposit || 0),

      created_by: currentUser.id
    };

    // Validate required fields
    const requiredFields = ['property_id', 'user_id', 'amount_total', 'start_date', 'payment_frequency', 'duration_days'];
    for (const field of requiredFields) {
      if (!mortgageData[field as keyof typeof mortgageData]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // Calculate next payment due date
    const startDate = new Date(mortgageData.start_date);
    const nextPaymentDue = new Date(startDate);
    
    if (mortgageData.payment_frequency === 'daily') {
      nextPaymentDue.setDate(nextPaymentDue.getDate() + 1);
    } else if (mortgageData.payment_frequency === 'weekly') {
      nextPaymentDue.setDate(nextPaymentDue.getDate() + 7);
    }

    // Create mortgage
    const { data: mortgage, error } = await supabaseAdmin
      .from('mortgages')
      .insert([{
        ...mortgageData,
        next_payment_due: nextPaymentDue.toISOString().split('T')[0], // Format as YYYY-MM-DD
        amount_paid: mortgageData.initial_deposit
      }])
      .select(`
        *,
        property:property_id(id, code, municipality, neighbourhood, holder_roblox_name),
        user:user_id(id, roblox_name, roblox_id),
        created_by_user:created_by(id, roblox_name)
      `)
      .single();

    if (error) {
      console.error('Error creating mortgage:', error);
      return NextResponse.json({ error: 'Failed to create mortgage' }, { status: 500 });
    }

    // Transform mortgage to frontend format
    const transformedMortgage = transformMortgageForFrontend(mortgage);

    return NextResponse.json({ mortgage: transformedMortgage }, { status: 201 });
  } catch (error) {
    console.error('Mortgages POST API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update mortgage
export async function PUT(request: NextRequest) {
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

    const body = await request.json();
    const mortgageId = body.id;

    if (!mortgageId) {
      return NextResponse.json({ error: 'Mortgage ID is required' }, { status: 400 });
    }

    // Check if mortgage exists
    const { data: existingMortgage, error: fetchError } = await supabaseAdmin
      .from('mortgages')
      .select('*')
      .eq('id', mortgageId)
      .single();

    if (fetchError || !existingMortgage) {
      return NextResponse.json({ error: 'Mortgage not found' }, { status: 404 });
    }

    // Extract updated mortgage data
    const updateData: Partial<{
      property_id: string;
      user_id: string;
      amount_total: number;
      start_date: string;
      payment_frequency: string;
      duration_days: number;
      initial_deposit: number;
      status: string;
      amount_paid: number;
      next_payment_due: string;
      last_payment_date: string;
      notes: string;
    }> = {};
    if (body.propertyId) updateData.property_id = body.propertyId;
    if (body.userId) updateData.user_id = body.userId;
    if (body.amountTotal) updateData.amount_total = parseFloat(body.amountTotal);
    if (body.startDate) updateData.start_date = body.startDate;
    if (body.paymentFrequency) updateData.payment_frequency = body.paymentFrequency;
    if (body.durationDays) updateData.duration_days = parseInt(body.durationDays);
    if (body.initialDeposit !== undefined) updateData.initial_deposit = parseFloat(body.initialDeposit);

    if (body.status) updateData.status = body.status;
    if (body.amountPaid !== undefined) updateData.amount_paid = parseFloat(body.amountPaid);
    if (body.nextPaymentDue) updateData.next_payment_due = body.nextPaymentDue;
    if (body.lastPaymentDate) updateData.last_payment_date = body.lastPaymentDate;

    // Update mortgage
    const { data: mortgage, error } = await supabaseAdmin
      .from('mortgages')
      .update(updateData)
      .eq('id', mortgageId)
      .select(`
        *,
        property:property_id(id, code, municipality, neighbourhood, holder_roblox_name),
        user:user_id(id, roblox_name, roblox_id),
        created_by_user:created_by(id, roblox_name)
      `)
      .single();

    if (error) {
      console.error('Error updating mortgage:', error);
      return NextResponse.json({ error: 'Failed to update mortgage' }, { status: 500 });
    }

    // Transform mortgage to frontend format
    const transformedMortgage = transformMortgageForFrontend(mortgage);

    return NextResponse.json({ mortgage: transformedMortgage });
  } catch (error) {
    console.error('Mortgages PUT API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 