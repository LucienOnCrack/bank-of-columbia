export type PropertyStatus = 'Available' | 'Leased' | 'Pending' | 'Maintenance';
export type PropertyType = 'Residential' | 'Commercial' | 'Industrial' | 'Land' | 'Office' | 'Retail';

export interface PropertyImage {
  id: string;
  url: string;
  name: string;
  size: number;
}

export interface PropertyData {
  id: string;
  municipality: string;
  type: PropertyType;
  holderRobloxName: string;
  holderRobloxId: string;
  neighbourhood: string;
  code: string;
  leasePrice: number;
  status: PropertyStatus;
  images: PropertyImage[];
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface PropertyFormData {
  municipality: string;
  type: PropertyType;
  holderRobloxName: string;
  holderRobloxId: string;
  neighbourhood: string;
  code: string;
  leasePrice: number;
  status: PropertyStatus;
  images: File[];
} 