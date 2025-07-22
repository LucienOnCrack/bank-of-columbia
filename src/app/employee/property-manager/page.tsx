'use client';

import { useAuth } from '@/components/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,

} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PropertyData, PropertyFormData, PropertyStatus, PropertyType } from '@/types/property';
import { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit,
  Trash2,
  DollarSign,
  MapPin,
  Upload,
  X,
  Loader2,
  UserCheck
} from 'lucide-react';
import { toast } from 'sonner';

const propertyTypes: PropertyType[] = ['Small House', 'Small Row House', 'Medium House', 'Medium Row House', 'Large House', 'Large Row House'];
const propertyStatuses: PropertyStatus[] = ['Available', 'Leased', 'Pending', 'Maintenance'];
const municipalities: string[] = ['Lander', 'Medford', 'Woodbury', 'Mersea'];

export default function PropertyManager() {
  const { appUser } = useAuth();
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<PropertyData | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  
  // Transfer ownership state
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [propertyToTransfer, setPropertyToTransfer] = useState<PropertyData | null>(null);
  const [users, setUsers] = useState<Array<{id: string, roblox_name: string, roblox_id: string}>>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [transferring, setTransferring] = useState(false);

  // Form data
  const [formData, setFormData] = useState<PropertyFormData>({
    municipality: '',
    type: 'Small House',
    holderRobloxName: '',
    holderRobloxId: '',
    neighbourhood: '',
    code: '',
    leasePrice: 0,
    status: 'Available',
    images: []
  });

  // Load properties on component mount
  useEffect(() => {
    loadProperties();
  }, []);



  // Load properties from API
  const loadProperties = async () => {
    try {
      const response = await fetch('/api/properties');
      if (response.ok) {
        const data = await response.json();
        setProperties(data.properties || []);
      } else {
        console.error('Failed to load properties');
        toast.error('Failed to load properties');
      }
    } catch (error) {
      console.error('Error loading properties:', error);
      toast.error('Error loading properties');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      municipality: '',
      type: 'Small House',
      holderRobloxName: '',
      holderRobloxId: '',
      neighbourhood: '',
      code: '',
      leasePrice: 0,
      status: 'Available',
      images: []
    });
    setImagesToDelete([]);
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (property: PropertyData) => {
    setSelectedProperty(property);
    setFormData({
      municipality: property.municipality,
      type: property.type,
      holderRobloxName: property.holderRobloxName,
      holderRobloxId: property.holderRobloxId,
      neighbourhood: property.neighbourhood,
      code: property.code,
      leasePrice: property.leasePrice,
      status: property.status,
      images: [] // Reset images for editing
    });
    setImagesToDelete([]); // Reset images to delete
    setIsEditDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!appUser || submitting) return;

    setSubmitting(true);

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Add property fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'images') {
          // Handle file uploads
          if (Array.isArray(value)) {
            value.forEach(file => {
              submitData.append('images', file);
            });
          }
        } else {
          submitData.append(key, value.toString());
        }
      });

      let response;
      
      if (isEditDialogOpen && selectedProperty) {
        // Update existing property
        submitData.append('id', selectedProperty.id);
        if (imagesToDelete.length > 0) {
          submitData.append('imagesToDelete', JSON.stringify(imagesToDelete));
        }
        response = await fetch('/api/properties', {
          method: 'PUT',
          body: submitData
        });
      } else {
        // Create new property
        response = await fetch('/api/properties', {
          method: 'POST',
          body: submitData
        });
      }

      if (response.ok) {
        toast.success(isEditDialogOpen ? 'Property updated successfully' : 'Property created successfully');
        
        // Reload properties to get fresh data
        await loadProperties();
        
        // Close dialogs and reset form
        setIsAddDialogOpen(false);
        setIsEditDialogOpen(false);
        resetForm();
        setSelectedProperty(null);
        setImagesToDelete([]);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save property');
      }
    } catch (error) {
      console.error('Error saving property:', error);
      toast.error('Error saving property');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (propertyId: string) => {
    if (!confirm('Are you sure you want to delete this property?')) {
      return;
    }

    try {
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Property deleted successfully');
        // Reload properties to get fresh data
        await loadProperties();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete property');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Error deleting property');
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newFiles]
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const markImageForDeletion = (imageId: string) => {
    setImagesToDelete(prev => [...prev, imageId]);
  };

  const unmarkImageForDeletion = (imageId: string) => {
    setImagesToDelete(prev => prev.filter(id => id !== imageId));
  };

  const getStatusBadgeColor = (status: PropertyStatus) => {
    switch (status) {
      case 'Available': 
        return 'bg-green-500/20 text-green-700 border-green-200 hover:bg-green-500/30';
      case 'Leased': 
        return 'bg-blue-500/20 text-blue-700 border-blue-200 hover:bg-blue-500/30';
      case 'Pending': 
        return 'bg-yellow-500/20 text-yellow-700 border-yellow-200 hover:bg-yellow-500/30';
      case 'Maintenance': 
        return 'bg-red-500/20 text-red-700 border-red-200 hover:bg-red-500/30';
      default: 
        return 'bg-gray-500/20 text-gray-700 border-gray-200 hover:bg-gray-500/30';
    }
  };

  const capitalizeStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Fetch users for transfer ownership
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const usersData = await response.json();
        setUsers(usersData.users || []);
      } else {
        toast.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    }
  };

  const openTransferDialog = (property: PropertyData) => {
    setPropertyToTransfer(property);
    setSelectedUserId('');
    setIsTransferDialogOpen(true);
    fetchUsers();
  };

  const handleTransferOwnership = async () => {
    if (!propertyToTransfer || !selectedUserId) {
      toast.error('Please select a user to transfer to');
      return;
    }

    setTransferring(true);
    try {
      const selectedUser = users.find(user => user.id === selectedUserId);
      if (!selectedUser) {
        toast.error('Selected user not found');
        return;
      }

      const response = await fetch('/api/properties', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: propertyToTransfer.id,
          holderRobloxName: selectedUser.roblox_name,
          holderRobloxId: selectedUser.roblox_id,
          transferOwnership: true
        }),
      });

      if (response.ok) {
        toast.success('Property ownership transferred successfully!');
        setIsTransferDialogOpen(false);
        setPropertyToTransfer(null);
        setSelectedUserId('');
        loadProperties(); // Refresh the properties list
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to transfer ownership');
      }
    } catch (error) {
      console.error('Error transferring property:', error);
      toast.error('An error occurred while transferring ownership');
    } finally {
      setTransferring(false);
    }
  };

  if (!appUser) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-end">
        <Button onClick={openAddDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </Button>
      </div>



      {/* Properties Table */}
      <Card>
        <CardHeader>
          <CardTitle>Properties ({properties.length})</CardTitle>
          <CardDescription>
            All properties in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Municipality</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Holder</TableHead>
                <TableHead>Neighbourhood</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell>
                    <div className="font-medium">{property.code}</div>
                  </TableCell>
                  <TableCell>{property.municipality}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{property.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{property.holderRobloxName}</div>
                      <div className="text-sm text-muted-foreground">ID: {property.holderRobloxId}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {property.neighbourhood}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      {(property.leasePrice || 0).toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusBadgeColor(property.status)}>
                      {capitalizeStatus(property.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(property)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openTransferDialog(property)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <UserCheck className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(property.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Property Dialog */}
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogContent className="!max-w-[50vw] !w-[50vw] max-h-[90vh] overflow-y-auto" style={{width: '50vw', maxWidth: '50vw'}}>
          <DialogHeader>
            <DialogTitle>Add New Property</DialogTitle>
            <DialogDescription>
              Create a new property listing with details and images.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Property Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Property Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="type">Property Type</Label>
                <Select value={formData.type} onValueChange={(value: PropertyType) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger className="w-full h-10">
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="municipality">Municipality</Label>
                <Select value={formData.municipality} onValueChange={(value: string) => setFormData(prev => ({ ...prev, municipality: value }))}>
                  <SelectTrigger className="w-full h-10">
                    <SelectValue placeholder="Select municipality" />
                  </SelectTrigger>
                  <SelectContent>
                    {municipalities.map(municipality => (
                      <SelectItem key={municipality} value={municipality}>{municipality}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="neighbourhood">Neighbourhood / Street</Label>
                <Input
                  id="neighbourhood"
                  className="w-full h-10"
                  value={formData.neighbourhood}
                  onChange={(e) => setFormData(prev => ({ ...prev, neighbourhood: e.target.value }))}
                  placeholder="Central Avenue"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Property Code</Label>
                <Input
                  id="code"
                  className="w-full h-10"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                  placeholder="RES-001"
                />
              </div>
            </div>

            {/* Financial & Holder Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Financial & Holder Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="leasePrice">Lease Price</Label>
                <Input
                  id="leasePrice"
                  type="number"
                  className="w-full h-10"
                  value={formData.leasePrice === 0 ? '' : formData.leasePrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, leasePrice: e.target.value === '' ? 0 : Number(e.target.value) }))}
                  placeholder="2500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: PropertyStatus) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger className="w-full h-10">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyStatuses.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="holderName">Roblox Username</Label>
                <Input
                  id="holderName"
                  className="w-full h-10"
                  value={formData.holderRobloxName}
                  onChange={(e) => setFormData(prev => ({ ...prev, holderRobloxName: e.target.value }))}
                  placeholder="JohnDoe123"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="holderId">Roblox ID</Label>
                <Input
                  id="holderId"
                  className="w-full h-10"
                  value={formData.holderRobloxId}
                  onChange={(e) => setFormData(prev => ({ ...prev, holderRobloxId: e.target.value }))}
                  placeholder="12345678"
                />
              </div>
            </div>

            {/* Image Gallery */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-lg font-semibold">Image Gallery</h3>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4 flex flex-col items-center justify-center">
                  <Label htmlFor="images" className="cursor-pointer">
                    <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                      Click to upload images
                    </span>
                    <Input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e.target.files)}
                    />
                  </Label>
                  <p className="text-xs text-gray-500 text-center">PNG, JPG, GIF up to 10MB each</p>
                </div>
              </div>

              {/* Image Preview */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      <p className="text-xs text-gray-500 mt-1 truncate">{image.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                'Create Property'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Property Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="!max-w-[50vw] !w-[50vw] max-h-[90vh] overflow-y-auto" style={{width: '50vw', maxWidth: '50vw'}}>
          <DialogHeader>
            <DialogTitle>Edit Property</DialogTitle>
            <DialogDescription>
              Update property details and images.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Property Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Property Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="edit-type">Property Type</Label>
                <Select value={formData.type} onValueChange={(value: PropertyType) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger className="w-full h-10">
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-municipality">Municipality</Label>
                <Select value={formData.municipality} onValueChange={(value: string) => setFormData(prev => ({ ...prev, municipality: value }))}>
                  <SelectTrigger className="w-full h-10">
                    <SelectValue placeholder="Select municipality" />
                  </SelectTrigger>
                  <SelectContent>
                    {municipalities.map(municipality => (
                      <SelectItem key={municipality} value={municipality}>{municipality}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-neighbourhood">Neighbourhood / Street</Label>
                <Input
                  id="edit-neighbourhood"
                  className="w-full h-10"
                  value={formData.neighbourhood}
                  onChange={(e) => setFormData(prev => ({ ...prev, neighbourhood: e.target.value }))}
                  placeholder="Central Avenue"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-code">Property Code</Label>
                <Input
                  id="edit-code"
                  className="w-full h-10"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                  placeholder="RES-001"
                />
              </div>
            </div>

            {/* Financial & Holder Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Financial & Holder Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="edit-leasePrice">Lease Price</Label>
                <Input
                  id="edit-leasePrice"
                  type="number"
                  className="w-full h-10"
                  value={formData.leasePrice === 0 ? '' : formData.leasePrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, leasePrice: e.target.value === '' ? 0 : Number(e.target.value) }))}
                  placeholder="2500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(value: PropertyStatus) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger className="w-full h-10">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyStatuses.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-holderName">Roblox Username</Label>
                <Input
                  id="edit-holderName"
                  className="w-full h-10"
                  value={formData.holderRobloxName}
                  onChange={(e) => setFormData(prev => ({ ...prev, holderRobloxName: e.target.value }))}
                  placeholder="JohnDoe123"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-holderId">Roblox ID</Label>
                <Input
                  id="edit-holderId"
                  className="w-full h-10"
                  value={formData.holderRobloxId}
                  onChange={(e) => setFormData(prev => ({ ...prev, holderRobloxId: e.target.value }))}
                  placeholder="12345678"
                />
              </div>
            </div>

            {/* Current Images */}
            {selectedProperty && selectedProperty.images.length > 0 && (
              <div className="md:col-span-2 space-y-4">
                <h3 className="text-lg font-semibold">Current Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedProperty.images
                    .filter(image => !imagesToDelete.includes(image.id))
                    .map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => markImageForDeletion(image.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      <p className="text-xs text-gray-500 mt-1 truncate">{image.name}</p>
                    </div>
                  ))}
                </div>
                {imagesToDelete.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-red-600">Images to be deleted ({imagesToDelete.length})</h4>
                    <div className="flex flex-wrap gap-2">
                      {imagesToDelete.map((imageId) => {
                        const image = selectedProperty.images.find(img => img.id === imageId);
                        return image ? (
                          <div key={imageId} className="relative">
                            <img
                              src={image.url}
                              alt={image.name}
                              className="w-16 h-16 object-cover rounded border-2 border-red-500 opacity-60"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              className="absolute -top-2 -right-2 h-6 w-6 p-0"
                              onClick={() => unmarkImageForDeletion(imageId)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* New Image Gallery */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-lg font-semibold">Add New Images</h3>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4 flex flex-col items-center justify-center">
                  <Label htmlFor="edit-images" className="cursor-pointer">
                    <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                      Click to upload new images
                    </span>
                    <Input
                      id="edit-images"
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e.target.files)}
                    />
                  </Label>
                  <p className="text-xs text-gray-500 text-center">PNG, JPG, GIF up to 10MB each</p>
                </div>
              </div>

              {/* New Image Preview */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      <p className="text-xs text-gray-500 mt-1 truncate">{image.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                'Update Property'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transfer Ownership Dialog */}
      <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Transfer Property Ownership</DialogTitle>
            <DialogDescription>
              Transfer ownership of {propertyToTransfer?.code} to another user.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Current Owner</Label>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">{propertyToTransfer?.holderRobloxName}</div>
                <div className="text-sm text-gray-500">ID: {propertyToTransfer?.holderRobloxId}</div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="transfer-user">Transfer To</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select user..." />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      <div>
                        <div className="font-medium">{user.roblox_name}</div>
                        <div className="text-xs text-gray-500">ID: {user.roblox_id}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsTransferDialogOpen(false)}
              disabled={transferring}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleTransferOwnership}
              disabled={!selectedUserId || transferring}
            >
              {transferring ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Transferring...
                </>
              ) : (
                'Transfer Ownership'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 