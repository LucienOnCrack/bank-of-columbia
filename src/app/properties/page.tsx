'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PropertyData, PropertyType } from '@/types/property';
import { 
  MapPin,
  DollarSign,
  Building,
  Search,
  SlidersHorizontal,
  Loader2,
  ImageIcon
} from 'lucide-react';
import Image from 'next/image';

const propertyTypes: PropertyType[] = ['Small House', 'Small Row House', 'Medium House', 'Medium Row House', 'Large House', 'Large Row House'];
const municipalities: string[] = ['Lander', 'Medford', 'Woodbury', 'Mersea'];

export default function PropertiesPage() {
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<PropertyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  const loadProperties = async () => {
    try {
      const response = await fetch('/api/properties/public');
      if (response.ok) {
        const data = await response.json();
        setProperties(data.properties || []);
      } else {
        console.error('Failed to load properties');
      }
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = [...properties];

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(property =>
        property.code.toLowerCase().includes(searchLower) ||
        property.neighbourhood.toLowerCase().includes(searchLower) ||
        property.municipality.toLowerCase().includes(searchLower)
      );
    }

    // Apply municipality filter
    if (selectedMunicipality) {
      filtered = filtered.filter(property => property.municipality === selectedMunicipality);
    }

    // Apply type filter
    if (selectedType) {
      filtered = filtered.filter(property => property.type === selectedType);
    }

    // Apply max price filter
    if (maxPrice) {
      const maxPriceNum = parseFloat(maxPrice);
      if (!isNaN(maxPriceNum)) {
        filtered = filtered.filter(property => property.leasePrice <= maxPriceNum);
      }
    }

    setFilteredProperties(filtered);
  }, [properties, searchTerm, selectedMunicipality, selectedType, maxPrice]);

  // Load properties on component mount
  useEffect(() => {
    loadProperties();
  }, []);

  // Apply filters whenever filter state changes
  useEffect(() => {
    applyFilters();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties, searchTerm, selectedMunicipality, selectedType, maxPrice]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedMunicipality('');
    setSelectedType('');
    setMaxPrice('');
  };

  const getPropertyImage = (property: PropertyData) => {
    if (property.images && property.images.length > 0) {
      return property.images[0].url;
    }
    return null;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Available Properties</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover premium properties available for lease across our municipalities. 
              Find your perfect home or business location today.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search by property code, neighbourhood, or municipality..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:w-auto"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Municipality</label>
                  <Select value={selectedMunicipality} onValueChange={setSelectedMunicipality}>
                    <SelectTrigger>
                      <SelectValue placeholder="All municipalities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All municipalities</SelectItem>
                      {municipalities.map(municipality => (
                        <SelectItem key={municipality} value={municipality}>{municipality}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Property Type</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All types</SelectItem>
                      {propertyTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Max Price</label>
                  <Input
                    type="number"
                    placeholder="Enter max price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>

                <div className="flex items-end">
                  <Button variant="outline" onClick={clearFilters} className="w-full">
                    Clear Filters
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredProperties.length} of {properties.length} available properties
          </p>
        </div>

        {/* Properties Grid */}
        {filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProperties.map((property) => (
              <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
                {/* Property Image */}
                <div className="relative h-56">
                  {getPropertyImage(property) ? (
                    <Image
                      src={getPropertyImage(property)!}
                      alt={`Property ${property.code}`}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-200">
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-green-500/20 text-green-700 border-green-200 hover:bg-green-500/30 backdrop-blur-sm">
                      Available
                    </Badge>
                  </div>

                  {/* Property Type Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge variant="outline" className="bg-white/90 backdrop-blur-sm">
                      {property.type}
                    </Badge>
                  </div>
                </div>

                {/* Property Details */}
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                        {property.code}
                      </CardTitle>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin className="h-3 w-3 mr-1" />
                        {property.municipality}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-black">
                        {formatPrice(property.leasePrice)}
                      </div>
                      <div className="text-xs text-gray-500">per month</div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Building className="h-3 w-3 mr-2" />
                      {property.neighbourhood}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="h-3 w-3 mr-2" />
                      Lease Available
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 