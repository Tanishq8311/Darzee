import React, { useState } from 'react';
import { 
  User, 
  Edit, 
  Phone, 
  Mail, 
  MapPin, 
  Store,
  Award,
  Star,
  Save,
  X,
  Camera
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth';
import { UserRole } from '@/types';

export function Profile() {
  const { user, updateProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    shopName: user?.shopName || '',
    experience: user?.experience || 0,
    specialization: user?.specialization?.join(', ') || '',
  });

  if (!user) return null;

  const handleSave = () => {
    updateProfile({
      name: editForm.name,
      phone: editForm.phone,
      address: editForm.address,
      shopName: editForm.shopName,
      experience: Number(editForm.experience),
      specialization: editForm.specialization.split(',').map(s => s.trim()).filter(Boolean),
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      name: user?.name || '',
      phone: user?.phone || '',
      address: user?.address || '',
      shopName: user?.shopName || '',
      experience: user?.experience || 0,
      specialization: user?.specialization?.join(', ') || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <Button
                size="icon"
                variant="outline"
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <Button
                  variant={isEditing ? "destructive" : "outline"}
                  onClick={isEditing ? handleCancel : () => setIsEditing(true)}
                >
                  {isEditing ? <X className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>
              
              <div className="flex items-center space-x-4 text-muted-foreground mb-4">
                <span className="capitalize bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                  {user.role}
                </span>
                {user.role === UserRole.TAILOR && user.shopName && (
                  <span className="flex items-center">
                    <Store className="w-4 h-4 mr-1" />
                    {user.shopName}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{user.phone}</span>
                </div>
                {user.address && (
                  <div className="flex items-center space-x-2 md:col-span-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{user.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Details */}
      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring bg-background"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring bg-background"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Address</label>
                <textarea
                  value={editForm.address}
                  onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring bg-background"
                  rows={2}
                />
              </div>

              {user.role === UserRole.TAILOR && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Shop Name</label>
                    <input
                      type="text"
                      value={editForm.shopName}
                      onChange={(e) => setEditForm({...editForm, shopName: e.target.value})}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring bg-background"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Experience (years)</label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={editForm.experience}
                      onChange={(e) => setEditForm({...editForm, experience: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring bg-background"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Specialization</label>
                    <input
                      type="text"
                      value={editForm.specialization}
                      onChange={(e) => setEditForm({...editForm, specialization: e.target.value})}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring bg-background"
                      placeholder="e.g., Suits, Shirts, Formal wear (comma separated)"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Professional Details (Tailor only) */}
          {user.role === UserRole.TAILOR && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    Professional Info
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {user.experience && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Experience</label>
                        <p className="text-lg font-semibold">{user.experience} years</p>
                      </div>
                    )}
                    
                    {user.specialization && user.specialization.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Specialization</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {user.specialization.map((spec, index) => (
                            <span
                              key={index}
                              className="bg-primary/10 text-primary px-2 py-1 rounded-lg text-sm"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="w-5 h-5 mr-2" />
                    Business Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Rating</label>
                      <p className="text-lg font-semibold">4.9 ★</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Total Orders</label>
                      <p className="text-lg font-semibold">156</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Active Customers</label>
                      <p className="text-lg font-semibold">23</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Customer-specific info */}
          {user.role === UserRole.CUSTOMER && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Total Orders</label>
                      <p className="text-lg font-semibold">12</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Completed Orders</label>
                      <p className="text-lg font-semibold">9</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                      <p className="text-lg font-semibold">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Measurements</CardTitle>
                </CardHeader>
                <CardContent>
                  {user.measurements ? (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="font-medium text-muted-foreground">Chest</label>
                        <p>{user.measurements.chest}"</p>
                      </div>
                      <div>
                        <label className="font-medium text-muted-foreground">Waist</label>
                        <p>{user.measurements.waist}"</p>
                      </div>
                      <div>
                        <label className="font-medium text-muted-foreground">Hips</label>
                        <p>{user.measurements.hips}"</p>
                      </div>
                      <div>
                        <label className="font-medium text-muted-foreground">Shoulder</label>
                        <p>{user.measurements.shoulder}"</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No measurements recorded</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">Receive updates about your orders</p>
                  </div>
                  <Button variant="outline" size="sm">Enable</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">SMS Notifications</h4>
                    <p className="text-sm text-muted-foreground">Get SMS updates for urgent matters</p>
                  </div>
                  <Button variant="outline" size="sm">Enable</Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Dark Mode</h4>
                    <p className="text-sm text-muted-foreground">Switch to dark theme</p>
                  </div>
                  <Button variant="outline" size="sm">Toggle</Button>
                </div>

                <hr />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-destructive">Delete Account</h4>
                    <p className="text-sm text-muted-foreground">Permanently delete your account and data</p>
                  </div>
                  <Button variant="destructive" size="sm">Delete</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}