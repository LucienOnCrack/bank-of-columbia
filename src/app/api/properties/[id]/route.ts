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

// GET - Fetch single property
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

    const { id } = await params;
    const { data: property, error } = await supabaseAdmin
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching property:', error);
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    return NextResponse.json({ property });
  } catch (error) {
    console.error('Property GET API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete property
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

    if (currentUser.role !== 'employee' && currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { id } = await params;
    
    // Fetch property to get images for deletion
    const { data: property, error: fetchError } = await supabaseAdmin
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // Delete associated images from storage
    if (property.images && property.images.length > 0) {
      const imagePaths = property.images
        .filter((img: { path?: string }) => img.path)
        .map((img: { path: string }) => img.path);
      
      if (imagePaths.length > 0) {
        const { error: storageError } = await supabaseAdmin.storage
          .from('property-images')
          .remove(imagePaths);
        
        if (storageError) {
          console.error('Error deleting images from storage:', storageError);
        }
      }
    }

    // Delete property from database
    const { error } = await supabaseAdmin
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting property:', error);
      return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Property DELETE API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 