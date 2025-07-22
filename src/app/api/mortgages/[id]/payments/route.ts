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

// GET - Fetch payment history for a mortgage
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id: mortgageId } = await params;

    // Fetch payments for the mortgage from transactions table
    const { data: payments, error } = await supabaseAdmin
      .from('transactions')
      .select(`
        *,
        created_by_user:created_by(id, roblox_name)
      `)
      .eq('mortgage_id', mortgageId)
      .eq('type', 'mortgage_payment')
      .order('payment_date', { ascending: false });

    if (error) {
      console.error('Error fetching mortgage payments:', error);
      return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
    }

    return NextResponse.json({ payments });
  } catch (error) {
    console.error('Mortgage payments GET API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Record a new payment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id: mortgageId } = await params;
    const body = await request.json();

    // Validate required fields
    if (!body.amount || !body.paymentDate) {
      return NextResponse.json({ error: 'Amount and payment date are required' }, { status: 400 });
    }

    // Check if mortgage exists
    const { data: mortgage, error: mortgageError } = await supabaseAdmin
      .from('mortgages')
      .select('*, property:property_id(code)')
      .eq('id', mortgageId)
      .single();

    if (mortgageError || !mortgage) {
      return NextResponse.json({ error: 'Mortgage not found' }, { status: 404 });
    }

    // Start a transaction to record payment and update mortgage
    const paymentAmount = parseFloat(body.amount);
    const paymentDate = body.paymentDate;

    // Insert payment record into transactions table
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from('transactions')
      .insert([{
        user_id: mortgage.user_id,
        property_id: mortgage.property_id,
        mortgage_id: mortgageId,
        type: 'mortgage_payment',
        amount: paymentAmount,
        description: `Mortgage payment for ${mortgage.property?.code || 'property'}`,
        payment_method: body.paymentMethod || null,
        payment_date: paymentDate,
        notes: body.notes || null,
        created_by: currentUser.id
      }])
      .select(`
        *,
        created_by_user:created_by(id, roblox_name)
      `)
      .single();

    if (paymentError) {
      console.error('Error recording payment:', paymentError);
      return NextResponse.json({ error: 'Failed to record payment' }, { status: 500 });
    }

    // Update mortgage with new payment info
    const newAmountPaid = mortgage.amount_paid + paymentAmount;
    let newStatus = mortgage.status;
    let nextPaymentDue = mortgage.next_payment_due;

    // Check if mortgage is now fully paid
    if (newAmountPaid >= mortgage.amount_total) {
      newStatus = 'completed';
    } else {
      // Calculate next payment due date
      const currentDue = new Date(mortgage.next_payment_due);
      if (mortgage.payment_frequency === 'daily') {
        currentDue.setDate(currentDue.getDate() + 1);
      } else if (mortgage.payment_frequency === 'weekly') {
        currentDue.setDate(currentDue.getDate() + 7);
      }
      nextPaymentDue = currentDue.toISOString().split('T')[0];
    }

    const { error: updateError } = await supabaseAdmin
      .from('mortgages')
      .update({
        amount_paid: newAmountPaid,
        last_payment_date: paymentDate,
        next_payment_due: nextPaymentDue,
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', mortgageId);

    if (updateError) {
      console.error('Error updating mortgage:', updateError);
      return NextResponse.json({ error: 'Payment recorded but failed to update mortgage' }, { status: 500 });
    }

    return NextResponse.json({ payment }, { status: 201 });
  } catch (error) {
    console.error('Mortgage payment POST API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 