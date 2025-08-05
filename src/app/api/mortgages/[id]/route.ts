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

// GET - Fetch single mortgage
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

    const { id } = await params;
    
    let mortgageQuery = supabaseAdmin
      .from('mortgages')
      .select(`
        *,
        property:property_id(id, code, municipality, neighbourhood, holder_roblox_name),
        user:user_id(id, roblox_name, roblox_id),
        created_by_user:created_by(id, roblox_name)
      `)
      .eq('id', id);

    // If user is not employee/admin, ensure they can only access their own mortgage
    if (currentUser.role !== 'employee' && currentUser.role !== 'admin') {
      mortgageQuery = mortgageQuery.eq('user_id', currentUser.id);
    }

    const { data: mortgage, error } = await mortgageQuery.single();

    if (error) {
      console.error('Error fetching mortgage:', error);
      return NextResponse.json({ error: 'Mortgage not found' }, { status: 404 });
    }

    return NextResponse.json({ mortgage });
  } catch (error) {
    console.error('Mortgage GET API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete mortgage
export async function DELETE(
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

    // Only employees and admins can delete mortgages
    if (currentUser.role !== 'employee' && currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Insufficient permissions: Only employees and administrators can delete mortgages' }, { status: 403 });
    }

    const { id } = await params;
    
    // Check if mortgage exists
    const { data: mortgage, error: fetchError } = await supabaseAdmin
      .from('mortgages')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !mortgage) {
      return NextResponse.json({ error: 'Mortgage not found' }, { status: 404 });
    }

    // Delete mortgage from database (cascade will handle related payments)
    const { error } = await supabaseAdmin
      .from('mortgages')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting mortgage:', error);
      return NextResponse.json({ error: 'Failed to delete mortgage' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Mortgage deleted successfully' });
  } catch (error) {
    console.error('Mortgage DELETE API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 