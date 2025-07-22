import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';
import { PropertyImage } from '@/types/property';


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

// Helper function to upload images to Supabase Storage
async function uploadImages(files: File[], propertyId: string) {
  const uploadedImages = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileExt = file.name.split('.').pop();
    const fileName = `${propertyId}/${Date.now()}-${i}.${fileExt}`;
    
    try {
      const { error } = await supabaseAdmin.storage
        .from('property-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error uploading image:', error);
        continue;
      }

      // Get public URL
      const { data: { publicUrl } } = supabaseAdmin.storage
        .from('property-images')
        .getPublicUrl(fileName);

      uploadedImages.push({
        id: crypto.randomUUID(),
        url: publicUrl,
        name: file.name,
        size: file.size,
        path: fileName
      });
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }
  
  return uploadedImages;
}

// Stored property image (includes path for deletion)
interface StoredPropertyImage extends PropertyImage {
  path?: string;
}

// Database property type (snake_case from database)
interface DatabaseProperty {
  id: string;
  municipality: string;
  type: string;
  holder_roblox_name: string;
  holder_roblox_id: string;
  neighbourhood: string;
  code: string;
  lease_price: number;
  status: string;
  images: StoredPropertyImage[];
  created_at: string;
  updated_at: string;
  created_by: string;
}

// Helper function to transform database fields to frontend format
function transformPropertyForFrontend(dbProperty: DatabaseProperty) {
  return {
    id: dbProperty.id,
    municipality: dbProperty.municipality,
    type: dbProperty.type,
    holderRobloxName: dbProperty.holder_roblox_name,
    holderRobloxId: dbProperty.holder_roblox_id,
    neighbourhood: dbProperty.neighbourhood,
    code: dbProperty.code,
    leasePrice: dbProperty.lease_price,
    status: dbProperty.status,
    images: dbProperty.images || [],
    created_at: dbProperty.created_at,
    updated_at: dbProperty.updated_at,
    created_by: dbProperty.created_by
  };
}

// GET - Fetch all properties
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

    // Fetch all properties
    const { data: properties, error } = await supabaseAdmin
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching properties:', error);
      return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
    }

    // Transform properties to frontend format
    const transformedProperties = properties.map(transformPropertyForFrontend);

    return NextResponse.json({ properties: transformedProperties });
  } catch (error) {
    console.error('Properties GET API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new property
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

    const formData = await request.formData();
    
    // Extract property data
    const propertyData = {
      municipality: formData.get('municipality') as string,
      type: formData.get('type') as string,
      holder_roblox_name: formData.get('holderRobloxName') as string,
      holder_roblox_id: formData.get('holderRobloxId') as string,
      neighbourhood: formData.get('neighbourhood') as string,
      code: formData.get('code') as string,
      lease_price: parseFloat(formData.get('leasePrice') as string),
      status: formData.get('status') as string,
      created_by: currentUser.id
    };

    // Validate required fields
    const requiredFields = ['municipality', 'type', 'holder_roblox_name', 'holder_roblox_id', 'neighbourhood', 'code'];
    for (const field of requiredFields) {
      if (!propertyData[field as keyof typeof propertyData]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // Create property first to get ID
    const propertyId = crypto.randomUUID();
    
    // Handle image uploads
    const imageFiles: File[] = [];
    const imageEntries = formData.getAll('images');
    
    for (const entry of imageEntries) {
      if (entry instanceof File && entry.size > 0) {
        imageFiles.push(entry);
      }
    }

    let uploadedImages: Array<{
      id: string;
      url: string;
      name: string;
      size: number;
      path: string;
    }> = [];
    if (imageFiles.length > 0) {
      uploadedImages = await uploadImages(imageFiles, propertyId);
    }

    // Insert property with images
    const { data: property, error } = await supabaseAdmin
      .from('properties')
      .insert([{
        id: propertyId,
        ...propertyData,
        images: uploadedImages
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating property:', error);
      return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
    }

    // Transform property to frontend format
    const transformedProperty = transformPropertyForFrontend(property);

    return NextResponse.json({ property: transformedProperty }, { status: 201 });
  } catch (error) {
    console.error('Properties POST API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update property
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

    // Check if this is a transfer ownership request (JSON) or regular update (FormData)
    const contentType = request.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      // Handle transfer ownership (JSON request)
      const body = await request.json();
      const { id: propertyId, holderRobloxName, holderRobloxId, transferOwnership } = body;

      if (!propertyId) {
        return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
      }

      if (!transferOwnership) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
      }

      // Check if property exists
      const { data: existingProperty, error: fetchError } = await supabaseAdmin
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single();

      if (fetchError || !existingProperty) {
        return NextResponse.json({ error: 'Property not found' }, { status: 404 });
      }

      // Update only the holder information
      const { data: property, error } = await supabaseAdmin
        .from('properties')
        .update({
          holder_roblox_name: holderRobloxName,
          holder_roblox_id: holderRobloxId,
          updated_at: new Date().toISOString()
        })
        .eq('id', propertyId)
        .select()
        .single();

      if (error) {
        console.error('Error transferring property ownership:', error);
        return NextResponse.json({ error: 'Failed to transfer ownership' }, { status: 500 });
      }

      // Transform property to frontend format
      const transformedProperty = transformPropertyForFrontend(property);

      return NextResponse.json({ property: transformedProperty });
    }

    // Handle regular property update (FormData)
    const formData = await request.formData();
    const propertyId = formData.get('id') as string;

    if (!propertyId) {
      return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
    }

    // Check if property exists
    const { data: existingProperty, error: fetchError } = await supabaseAdmin
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .single();

    if (fetchError || !existingProperty) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // Extract updated property data
    const propertyData = {
      municipality: formData.get('municipality') as string,
      type: formData.get('type') as string,
      holder_roblox_name: formData.get('holderRobloxName') as string,
      holder_roblox_id: formData.get('holderRobloxId') as string,
      neighbourhood: formData.get('neighbourhood') as string,
      code: formData.get('code') as string,
      lease_price: parseFloat(formData.get('leasePrice') as string),
      status: formData.get('status') as string
    };

    // Handle image deletions
    const imagesToDeleteStr = formData.get('imagesToDelete') as string;
    let imagesToDelete: string[] = [];
    if (imagesToDeleteStr) {
      try {
        imagesToDelete = JSON.parse(imagesToDeleteStr);
      } catch (error) {
        console.error('Error parsing imagesToDelete:', error);
      }
    }

    // Delete images from storage
    if (imagesToDelete.length > 0) {
      for (const imageId of imagesToDelete) {
        const imageToDelete = existingProperty.images?.find((img: StoredPropertyImage) => img.id === imageId);
        if (imageToDelete && imageToDelete.path) {
          try {
            await supabaseAdmin.storage
              .from('property-images')
              .remove([imageToDelete.path]);
          } catch (error) {
            console.error('Error deleting image from storage:', error);
          }
        }
      }
    }

    // Handle new image uploads
    const imageFiles: File[] = [];
    const imageEntries = formData.getAll('images');
    
    for (const entry of imageEntries) {
      if (entry instanceof File && entry.size > 0) {
        imageFiles.push(entry);
      }
    }

    // Start with existing images, filter out deleted ones
    let updatedImages = (existingProperty.images || []).filter((img: StoredPropertyImage) => 
      !imagesToDelete.includes(img.id)
    );
    
    // Add new uploaded images
    if (imageFiles.length > 0) {
      const newImages = await uploadImages(imageFiles, propertyId);
      updatedImages = [...updatedImages, ...newImages];
    }

    // Update property
    const { data: property, error } = await supabaseAdmin
      .from('properties')
      .update({
        ...propertyData,
        images: updatedImages,
        updated_at: new Date().toISOString()
      })
      .eq('id', propertyId)
      .select()
      .single();

    if (error) {
      console.error('Error updating property:', error);
      return NextResponse.json({ error: 'Failed to update property' }, { status: 500 });
    }

    // Transform property to frontend format
    const transformedProperty = transformPropertyForFrontend(property);

    return NextResponse.json({ property: transformedProperty });
  } catch (error) {
    console.error('Properties PUT API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 