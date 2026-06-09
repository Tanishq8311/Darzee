import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  MapPin,
  Users,
  Ruler,
  Save,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SimpleLoader } from '@/components/animations/SimpleLoader';
import { useAppStore } from '@/store';
import { useAuthStore } from '@/store/auth';
import { Customer, UserRole } from '@/types';

export function Customers() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const { user } = useAuthStore();
  const { addCustomer, updateCustomer, deleteCustomer, getCustomersByTailor } = useAppStore();
  
  // Only tailors can access this page
  if (!user || user.role !== UserRole.TAILOR) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className="text-muted-foreground">Only tailors can manage customers</p>
      </div>
    );
  }

  // Get customers for current tailor
  const tailorCustomers = getCustomersByTailor(user.id);
  
  const filteredCustomers = tailorCustomers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const handleAddCustomer = async (formData: FormData) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const customerData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      measurements: {
        chest: Number(formData.get('chest')) || 0,
        waist: Number(formData.get('waist')) || 0,
        hips: Number(formData.get('hips')) || 0,
        shoulder: Number(formData.get('shoulder')) || 0,
        armLength: Number(formData.get('armLength')) || 0,
        legLength: Number(formData.get('legLength')) || 0,
        neck: Number(formData.get('neck')) || 0,
      },
    };

    addCustomer(customerData, user.id);
    setShowAddForm(false);
    setIsLoading(false);
  };

  const handleUpdateCustomer = async (formData: FormData) => {
    if (!editingCustomer) return;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updates = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      measurements: {
        chest: Number(formData.get('chest')) || 0,
        waist: Number(formData.get('waist')) || 0,
        hips: Number(formData.get('hips')) || 0,
        shoulder: Number(formData.get('shoulder')) || 0,
        armLength: Number(formData.get('armLength')) || 0,
        legLength: Number(formData.get('legLength')) || 0,
        neck: Number(formData.get('neck')) || 0,
      },
    };

    updateCustomer(editingCustomer.id, updates);
    setEditingCustomer(null);
    setIsLoading(false);
  };

  const handleDeleteCustomer = async (id: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      deleteCustomer(id);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <SimpleLoader size="lg" text="Processing..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Customer Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage your customers and their measurements
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search customers by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring bg-background"
        />
      </div>

      {/* Add Customer Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Add New Customer</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowAddForm(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleAddCustomer(new FormData(e.currentTarget));
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring bg-background"
                  />
                </div>
              </div>

              {/* Measurements */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Ruler className="w-5 h-5 mr-2" />
                  Body Measurements (inches)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Chest</label>
                    <input
                      type="number"
                      name="chest"
                      step="0.5"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Waist</label>
                    <input
                      type="number"
                      name="waist"
                      step="0.5"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Hips</label>
                    <input
                      type="number"
                      name="hips"
                      step="0.5"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Shoulder</label>
                    <input
                      type="number"
                      name="shoulder"
                      step="0.5"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Arm Length</label>
                    <input
                      type="number"
                      name="armLength"
                      step="0.5"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Leg Length</label>
                    <input
                      type="number"
                      name="legLength"
                      step="0.5"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Neck</label>
                    <input
                      type="number"
                      name="neck"
                      step="0.5"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring bg-background"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  Add Customer
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Edit Customer Form */}
      {editingCustomer && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Edit Customer</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setEditingCustomer(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleUpdateCustomer(new FormData(e.currentTarget));
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingCustomer.name}
                    required
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={editingCustomer.email}
                    required
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={editingCustomer.phone}
                    required
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    defaultValue={editingCustomer.address}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring bg-background"
                  />
                </div>
              </div>

              {/* Measurements */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Ruler className="w-5 h-5 mr-2" />
                  Body Measurements (inches)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Chest</label>
                    <input
                      type="number"
                      name="chest"
                      step="0.5"
                      defaultValue={editingCustomer.measurements.chest}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Waist</label>
                    <input
                      type="number"
                      name="waist"
                      step="0.5"
                      defaultValue={editingCustomer.measurements.waist}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Hips</label>
                    <input
                      type="number"
                      name="hips"
                      step="0.5"
                      defaultValue={editingCustomer.measurements.hips}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Shoulder</label>
                    <input
                      type="number"
                      name="shoulder"
                      step="0.5"
                      defaultValue={editingCustomer.measurements.shoulder}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Arm Length</label>
                    <input
                      type="number"
                      name="armLength"
                      step="0.5"
                      defaultValue={editingCustomer.measurements.armLength}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Leg Length</label>
                    <input
                      type="number"
                      name="legLength"
                      step="0.5"
                      defaultValue={editingCustomer.measurements.legLength}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Neck</label>
                    <input
                      type="number"
                      name="neck"
                      step="0.5"
                      defaultValue={editingCustomer.measurements.neck}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring bg-background"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={() => setEditingCustomer(null)}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  Update Customer
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Customer List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.length === 0 ? (
          <div className="col-span-full text-center py-12 border-2 border-dashed border-border rounded-lg">
            <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No customers found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'No customers match your search.' : 'Start by adding your first customer.'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Customer
              </Button>
            )}
          </div>
        ) : (
          filteredCustomers.map((customer) => (
            <Card key={customer.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{customer.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Customer since {new Date(customer.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingCustomer(customer)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteCustomer(customer.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="truncate">{customer.email}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{customer.phone}</span>
                </div>
                
                {customer.address && (
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="truncate">{customer.address}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-border">
                  <h4 className="font-medium text-sm mb-2 flex items-center">
                    <Ruler className="w-4 h-4 mr-2" />
                    Measurements
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>Chest: {customer.measurements.chest}"</div>
                    <div>Waist: {customer.measurements.waist}"</div>
                    <div>Shoulder: {customer.measurements.shoulder}"</div>
                    <div>Arm: {customer.measurements.armLength}"</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary Stats */}
      {tailorCustomers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Customer Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{tailorCustomers.length}</div>
                <div className="text-sm text-muted-foreground">Total Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {tailorCustomers.filter(c => 
                    new Date().getTime() - c.updatedAt.getTime() < 30 * 24 * 60 * 60 * 1000
                  ).length}
                </div>
                <div className="text-sm text-muted-foreground">Active This Month</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {tailorCustomers.filter(c => 
                    new Date().getTime() - c.createdAt.getTime() < 7 * 24 * 60 * 60 * 1000
                  ).length}
                </div>
                <div className="text-sm text-muted-foreground">New This Week</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}