import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken, getRobloxUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    
    // Handle OAuth errors
    if (error) {
      console.error('OAuth error:', error);
      return NextResponse.redirect(new URL('/auth/error', request.url));
    }
    
    if (!code) {
      console.error('No authorization code received');
      return NextResponse.redirect(new URL('/auth/error', request.url));
    }
    
    // Exchange code for access token
    const tokenResponse = await exchangeCodeForToken(code);
    
    // Get Roblox user info
    const robloxUser = await getRobloxUser(tokenResponse.access_token);
    
    // Check if user exists in our database
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('roblox_id', robloxUser.id)
      .single();
    
    if (existingUser) {
      // Update existing user's Roblox name in case it changed
      const { error: updateError } = await supabase
        .from('users')
        .update({ roblox_name: robloxUser.username })
        .eq('roblox_id', robloxUser.id);
      
      if (updateError) {
        console.error('Error updating user:', updateError);
        return NextResponse.redirect(new URL('/auth/error', request.url));
      }
    } else {
      // Create Supabase auth user first
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: `${robloxUser.id}@roblox.temp`, // Temporary email since Roblox doesn't provide one
        email_confirm: true,
        user_metadata: {
          roblox_id: robloxUser.id,
          roblox_name: robloxUser.username,
          display_name: robloxUser.displayName,
        }
      });
      
      if (authError || !authUser.user) {
        console.error('Error creating auth user:', authError);
        return NextResponse.redirect(new URL('/auth/error', request.url));
      }
      
      // Create user in our custom users table
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          id: authUser.user.id,
          roblox_id: robloxUser.id,
          roblox_name: robloxUser.username,
          role: 'user',
          balance: 0,
        })
        .select()
        .single();
      
      if (createError || !newUser) {
        console.error('Error creating user record:', createError);
        return NextResponse.redirect(new URL('/auth/error', request.url));
      }
      
      // user = newUser; // User created successfully
    }
    
    // Sign in the user
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: `${robloxUser.id}@roblox.temp`,
      password: robloxUser.id, // Use Roblox ID as password
    });
    
    if (signInError) {
      console.error('Error signing in user:', signInError);
      return NextResponse.redirect(new URL('/auth/error', request.url));
    }
    
    // Redirect to dashboard on successful authentication
    return NextResponse.redirect(new URL('/dashboard', request.url));
    
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.redirect(new URL('/auth/error', request.url));
  }
} 