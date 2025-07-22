import { NextRequest, NextResponse } from 'next/server';
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
  images: Array<{
    id: string;
    url: string;
    name: string;
    size: number;
  }>;
  created_at: string;
  updated_at: string;
  created_by: string;
}

// Function to convert database property types back to frontend format
function mapPropertyTypeFromDatabase(dbType: string): string {
  const typeMapping: { [key: string]: string } = {
    'Residential': 'Medium House',
    'Commercial': 'Large House',
    'Industrial': 'Large House',
    'Land': 'Small House',
    'Office': 'Medium House',
    'Retail': 'Medium Row House'
  };
  
  return typeMapping[dbType] || dbType;
}

// Function to convert frontend property types to database format for filtering
function mapPropertyTypeToDatabase(newType: string): string {
  const typeMapping: { [key: string]: string } = {
    'Small House': 'Residential',
    'Small Row House': 'Residential', 
    'Medium House': 'Residential',
    'Medium Row House': 'Residential',
    'Large House': 'Commercial',
    'Large Row House': 'Commercial'
  };
  
  return typeMapping[newType] || newType;
}

// Helper function to transform database fields to frontend format
function transformPropertyForFrontend(dbProperty: DatabaseProperty) {
  return {
    id: dbProperty.id,
    municipality: dbProperty.municipality,
    type: mapPropertyTypeFromDatabase(dbProperty.type), // Convert from DB to frontend format
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

// GET - Fetch available properties (public endpoint)
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters for filtering
    const { searchParams } = new URL(request.url);
    const municipality = searchParams.get('municipality');
    const type = searchParams.get('type');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');

    // Build query
    let query = supabaseAdmin
      .from('properties')
      .select('*')
      .eq('status', 'Available') // Only show available properties
      .order('created_at', { ascending: false });

    // Apply filters
    if (municipality) {
      query = query.eq('municipality', municipality);
    }
    
    if (type) {
      query = query.eq('type', mapPropertyTypeToDatabase(type)); // Convert frontend type to DB type for filtering
    }
    
    if (maxPrice) {
      query = query.lte('lease_price', parseFloat(maxPrice));
    }

    // Apply search if provided
    if (search) {
      query = query.or(`code.ilike.%${search}%,neighbourhood.ilike.%${search}%,municipality.ilike.%${search}%`);
    }

    const { data: properties, error } = await query;

    if (error) {
      console.error('Error fetching public properties:', error);
      return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
    }

    // Transform properties to frontend format
    const transformedProperties = properties.map(transformPropertyForFrontend);

    return NextResponse.json({ 
      properties: transformedProperties,
      total: transformedProperties.length 
    });
  } catch (error) {
    console.error('Public properties API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 