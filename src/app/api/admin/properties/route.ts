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
      console.log(`Access denied for user ${currentUser.roblox_name} with role ${currentUser.role}`);
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    console.log(`User ${currentUser.roblox_name} (${currentUser.role}) accessing admin properties endpoint`);

    // Fetch all properties with related data
    const { data: properties, error } = await supabaseAdmin
      .from('properties')
      .select(`
        *,
        created_by_user:created_by(roblox_name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching properties:', error);
      return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
    }

    return NextResponse.json({ properties });
  } catch (error) {
    console.error('Admin properties API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 