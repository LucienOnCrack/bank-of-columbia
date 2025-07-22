import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const sessionData = getCurrentUserFromRequest(request);
    
    if (!sessionData) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Create admin client to fetch fresh user data from database
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

    // Fetch current user data from database using the user ID from JWT
    const { data: currentUser, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', sessionData.userId)
      .single();

    if (error || !currentUser) {
      console.error('Error fetching user from database:', error);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return fresh user data from database
    return NextResponse.json({ user: currentUser });
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
  }
} 