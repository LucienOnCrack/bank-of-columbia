import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken, getRobloxUser, createSessionToken } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code) {
      console.error('No authorization code received');
      return NextResponse.redirect(new URL('/auth/error', request.url));
    }

    // Exchange code for access token
    const tokenData = await exchangeCodeForToken(code);
    
    // Get Roblox user info
    const robloxUser = await getRobloxUser(tokenData.access_token);

    // Check if user exists in our database
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('roblox_id', robloxUser.id)
      .single();

    let user;

    if (existingUser) {
      // Update existing user's Roblox name in case it changed
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({ roblox_name: robloxUser.username })
        .eq('roblox_id', robloxUser.id)
        .select()
        .single();
      
      if (updateError) {
        console.error('Error updating user:', updateError);
        return NextResponse.redirect(new URL('/auth/error', request.url));
      }
      
      user = updatedUser;
    } else {
      // Create new user - let database auto-generate UUID
      console.log('Creating user with data:', {
        roblox_id: robloxUser.id,
        roblox_name: robloxUser.username,
        role: 'user',
        balance: 0,
      });
      
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([{
          roblox_id: robloxUser.id,
          roblox_name: robloxUser.username,
          role: 'user',
          balance: 0,
        }])
        .select()
        .single();
      
      if (createError || !newUser) {
        console.error('Error creating user:', createError);
        return NextResponse.redirect(new URL('/auth/error', request.url));
      }
      
      user = newUser;
    }

    // Create JWT session token
    const sessionToken = createSessionToken(user);

    // Create response and set cookie
    const response = NextResponse.redirect(new URL('/dashboard', request.url));
    
    // Set secure HTTP-only cookie
    response.cookies.set('session-token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(new URL('/auth/error', request.url));
  }
} 