'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
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
  DialogTrigger,
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
import { propertyOperations, userOperations, transactionOperations } from '@/lib/supabase';
import { Property, User } from '@/types/user';
import { useEffect, useState } from 'react';
import { 
  Building, 
  Plus, 
  Users,
  MapPin,
  DollarSign,
  UserCheck
} from 'lucide-react';

export default function EmployeePage() {
  return (
    <ProtectedRoute requiredRole="employee">
      <EmployeeContent />
    </ProtectedRoute>
  );
}

function EmployeeContent() {
  const { appUser } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Form states
  const [newProperty, setNewProperty] = useState({
    address: '',
    description: '',
    value: '',
  });
  const [selectedUserId, setSelectedUserId] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allProperties, allUsers] = await Promise.all([
          propertyOperations.getAllProperties(),
          userOperations.getAllUsers()
        ]);
        
        setProperties(allProperties || []);
        setUsers(allUsers || []);
      } catch (error) {
        console.error('Error fetching employee data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateProperty = async () => {
    if (!appUser || !newProperty.address || !newProperty.value) return;

    try {
      const property = await propertyOperations.createProperty({
        address: newProperty.address,
        description: newProperty.description || undefined,
        value: parseFloat(newProperty.value),
        assigned_by: appUser.id,
        owner_id: null,
      });

      setProperties(prev => [property, ...prev]);
      setNewProperty({ address: '', description: '', value: '' });
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating property:', error);
    }
  };

  const handleAssignProperty = async () => {
    if (!selectedProperty || !selectedUserId || !appUser) return;

    try {
      // Update property ownership
      await propertyOperations.assignProperty(
        selectedProperty.id, 
        selectedUserId
      );

      // Create transaction record
      await transactionOperations.createTransaction({
        user_id: selectedUserId,
        property_id: selectedProperty.id,
        type: 'property_assignment',
        amount: selectedProperty.value,
        description: `Property assigned: ${selectedProperty.address}`,
        created_by: appUser.id,
      });

      // Refresh properties list
      const updatedProperties = await propertyOperations.getAllProperties();
      setProperties(updatedProperties || []);

      setIsAssignDialogOpen(false);
      setSelectedProperty(null);
      setSelectedUserId('');
    } catch (error) {
      console.error('Error assigning property:', error);
    }
  };

  if (!appUser) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const unassignedProperties = properties.filter(p => !p.owner_id);
  const assignedProperties = properties.filter(p => p.owner_id);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Employee Panel</h1>
        <p className="text-muted-foreground">
          Manage properties and user assignments
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{properties.length}</div>
            <p className="text-xs text-muted-foreground">Properties in system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unassigned</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unassignedProperties.length}</div>
            <p className="text-xs text-muted-foreground">Available for assignment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignedProperties.length}</div>
            <p className="text-xs text-muted-foreground">Currently owned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Property
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Property</DialogTitle>
              <DialogDescription>
                Add a new property to the system that can be assigned to users.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="address">Property Address</Label>
                <Input
                  id="address"
                  value={newProperty.address}
                  onChange={(e) => setNewProperty(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="123 Main Street, City"
                />
              </div>
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  value={newProperty.description}
                  onChange={(e) => setNewProperty(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Property description"
                />
              </div>
              <div>
                <Label htmlFor="value">Property Value</Label>
                <Input
                  id="value"
                  type="number"
                  value={newProperty.value}
                  onChange={(e) => setNewProperty(prev => ({ ...prev, value: e.target.value }))}
                  placeholder="250000"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateProperty}>
                Create Property
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Properties Management */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Property Management</CardTitle>
          <CardDescription>
            Manage property listings and assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{property.address}</p>
                      {property.description && (
                        <p className="text-sm text-muted-foreground">{property.description}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      {property.value.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    {property.owner ? (
                      <span className="font-medium">{property.owner.roblox_name}</span>
                    ) : (
                      <span className="text-muted-foreground">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={property.owner_id ? "default" : "secondary"}>
                      {property.owner_id ? "Assigned" : "Available"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {!property.owner_id && (
                      <Dialog 
                        open={isAssignDialogOpen && selectedProperty?.id === property.id} 
                        onOpenChange={(open) => {
                          setIsAssignDialogOpen(open);
                          if (open) {
                            setSelectedProperty(property);
                          } else {
                            setSelectedProperty(null);
                            setSelectedUserId('');
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            Assign
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Assign Property</DialogTitle>
                            <DialogDescription>
                              Assign {property.address} to a user
                            </DialogDescription>
                          </DialogHeader>
                          <div>
                            <Label htmlFor="user-select">Select User</Label>
                            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose a user" />
                              </SelectTrigger>
                              <SelectContent>
                                {users.map((user) => (
                                  <SelectItem key={user.id} value={user.id}>
                                    {user.roblox_name} ({user.role})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleAssignProperty}>
                              Assign Property
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 