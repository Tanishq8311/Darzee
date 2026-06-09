import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Phone, Mail, MapPin, Ruler, Sparkles, Crown, Star, Scissors } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StitchingLoader } from '@/components/animations/StitchingLoader';
import { MeasuringTape } from '@/components/animations/MeasuringTape';
import { useAppStore } from '@/store';
import { Customer } from '@/types';

export function Customers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const customers = useAppStore((state) => state.customers);
  const addCustomer = useAppStore((state) => state.addCustomer);
  const deleteCustomer = useAppStore((state) => state.deleteCustomer);

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const handleAddCustomer = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(event.currentTarget);
    
    const newCustomer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'> = {
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
        notes: formData.get('notes') as string || '',
      },
    };

    // Simulate API call with loading
    setTimeout(() => {
      addCustomer(newCustomer);
      setShowAddForm(false);
      setIsLoading(false);
      event.currentTarget.reset();
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <StitchingLoader size="lg" text="Adding Customer to Atelier" />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Mobile-Optimized Luxury Header */}
      <div className="luxury-card rounded-xl sm:rounded-2xl p-4 sm:p-6 fabric-texture relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10">
          <Crown className="w-16 h-16 sm:w-24 sm:h-24 text-gold rotate-12" />
        </div>
        <div className="relative flex flex-col gap-4">
          <div className="text-center sm:text-left">
            <h2 className="text-xl sm:text-3xl font-display font-bold text-gold mb-2">Distinguished Clientele</h2>
            <p className="text-silver text-sm sm:text-base">Crafting excellence for our valued customers</p>
            <div className="mt-3 sm:mt-4">
              <MeasuringTape length={60} showMeasurement measurement={`${customers.length} Elite Customers`} />
            </div>
          </div>
          <div className="flex justify-center sm:justify-end">
            <Button 
              variant="golden" 
              onClick={() => setShowAddForm(true)} 
              size="default"
              className="w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="hidden xs:inline">Welcome New Client</span>
              <span className="xs:hidden">Add Client</span>
            </Button>
          </div>
        </div>
        
        {/* Mobile stitching indicator */}
        <div className="mt-4 sm:hidden">
          <div className="flex justify-center">
            <StitchingLoader size="sm" text="" />
          </div>
        </div>
      </div>

      {/* Mobile-Optimized Elegant Search */}
      <div className="relative max-w-full sm:max-w-lg mx-auto px-2 sm:px-0">
        <div className="luxury-card rounded-xl sm:rounded-2xl p-1">
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gold w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search clients..."
              className="w-full pl-10 sm:pl-12 pr-10 sm:pr-4 py-3 sm:py-4 bg-transparent text-gold placeholder-silver/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/50 font-medium text-sm sm:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-gold animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Luxury Add Customer Form */}
      {showAddForm && (
        <Card className="animate-slide-down border-gold/30">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
              <Crown className="w-8 h-8 text-gold" />
            </div>
            <CardTitle className="text-2xl">Welcome New Distinguished Client</CardTitle>
            <p className="text-silver">Create a profile worthy of luxury craftsmanship</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddCustomer} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-display font-semibold text-gold flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  Personal Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gold mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full px-4 py-3 bg-navy-light border border-gold/30 rounded-xl text-gold placeholder-silver/60 focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
                      placeholder="Enter distinguished name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gold mb-2">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      className="w-full px-4 py-3 bg-navy-light border border-gold/30 rounded-xl text-gold placeholder-silver/60 focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gold mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="w-full px-4 py-3 bg-navy-light border border-gold/30 rounded-xl text-gold placeholder-silver/60 focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
                      placeholder="elite@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gold mb-2">Address</label>
                    <input
                      type="text"
                      name="address"
                      className="w-full px-4 py-3 bg-navy-light border border-gold/30 rounded-xl text-gold placeholder-silver/60 focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
                      placeholder="Luxury residence address"
                    />
                  </div>
                </div>
              </div>

              {/* Bespoke Measurements */}
              <div className="space-y-4">
                <h4 className="text-lg font-display font-semibold text-gold flex items-center">
                  <Ruler className="w-5 h-5 mr-2" />
                  Bespoke Measurements (inches)
                </h4>
                <div className="luxury-card p-4 rounded-xl">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { name: 'chest', label: 'Chest' },
                      { name: 'waist', label: 'Waist' },
                      { name: 'hips', label: 'Hips' },
                      { name: 'shoulder', label: 'Shoulder' },
                      { name: 'armLength', label: 'Arm Length' },
                      { name: 'legLength', label: 'Leg Length' },
                      { name: 'neck', label: 'Neck' },
                    ].map((field, index) => (
                      <div key={field.name} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                        <label className="block text-sm font-medium text-silver mb-1">{field.label}</label>
                        <div className="relative">
                          <input
                            type="number"
                            name={field.name}
                            step="0.1"
                            className="w-full px-3 py-2 bg-navy border border-gold/20 rounded-lg text-gold placeholder-silver/40 focus:ring-1 focus:ring-gold/50 focus:border-gold transition-all text-center"
                            placeholder="0.0"
                          />
                          <Scissors className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gold/50" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Special Notes */}
              <div className="space-y-4">
                <h4 className="text-lg font-display font-semibold text-gold flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Special Preferences
                </h4>
                <textarea
                  name="notes"
                  rows={4}
                  className="w-full px-4 py-3 bg-navy-light border border-gold/30 rounded-xl text-gold placeholder-silver/60 focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all resize-none"
                  placeholder="Special styling preferences, fabric choices, or unique requirements for this distinguished client..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gold/20">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                  size="lg"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="golden" size="lg">
                  <Crown className="w-4 h-4 mr-2" />
                  Welcome to Atelier
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Mobile-First Elite Customer Gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {filteredCustomers.length === 0 ? (
          <div className="col-span-full">
            <Card className="text-center py-16 border-2 border-dashed border-gold/30">
              <CardContent>
                <div className="relative">
                  <Crown className="w-20 h-20 text-gold/30 mx-auto mb-6 animate-float" />
                  <Sparkles className="absolute top-4 right-1/2 transform translate-x-8 w-6 h-6 text-gold animate-pulse" />
                  <Sparkles className="absolute bottom-4 left-1/2 transform -translate-x-8 w-4 h-4 text-gold animate-pulse" />
                </div>
                <h3 className="font-display font-semibold text-gold text-xl mb-2">
                  {searchTerm ? 'No Distinguished Clients Found' : 'Your Elite Clientele Awaits'}
                </h3>
                <p className="text-silver mb-6">
                  {searchTerm 
                    ? 'Refine your search to find the perfect client.' 
                    : 'Begin building your luxury customer base with exceptional service.'
                  }
                </p>
                {!searchTerm && (
                  <Button variant="golden" onClick={() => setShowAddForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Welcome First Client
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredCustomers.map((customer, index) => (
            <Card 
              key={customer.id} 
              className="group cursor-pointer hover:scale-105 animate-slide-up border-gold/20" 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-0">
                {/* Customer Header */}
                <div className="relative p-6 bg-gradient-to-br from-gold/10 to-gold/5 rounded-t-xl">
                  <div className="absolute top-3 right-3">
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gold/20">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-red-500/20"
                        onClick={() => deleteCustomer(customer.id)}
                      >
                        <Trash2 className="w-3 h-3 text-red-400" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center shadow-golden">
                      <span className="text-lg font-bold text-navy">
                        {customer.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-gold text-lg group-hover:text-gold-light transition-colors">
                        {customer.name}
                      </h3>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-gold fill-current" />
                        ))}
                        <span className="ml-2 text-xs text-silver">Elite Client</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="p-6 space-y-3">
                  {customer.phone && (
                    <div className="flex items-center text-sm text-silver group-hover:text-gold transition-colors">
                      <div className="w-8 h-8 bg-gold/20 rounded-lg flex items-center justify-center mr-3">
                        <Phone className="w-4 h-4 text-gold" />
                      </div>
                      {customer.phone}
                    </div>
                  )}
                  {customer.email && (
                    <div className="flex items-center text-sm text-silver group-hover:text-gold transition-colors">
                      <div className="w-8 h-8 bg-gold/20 rounded-lg flex items-center justify-center mr-3">
                        <Mail className="w-4 h-4 text-gold" />
                      </div>
                      {customer.email}
                    </div>
                  )}
                  {customer.address && (
                    <div className="flex items-center text-sm text-silver group-hover:text-gold transition-colors">
                      <div className="w-8 h-8 bg-gold/20 rounded-lg flex items-center justify-center mr-3">
                        <MapPin className="w-4 h-4 text-gold" />
                      </div>
                      <span className="truncate">{customer.address}</span>
                    </div>
                  )}
                </div>

                {/* Measurements Preview */}
                <div className="p-6 pt-0">
                  <div className="luxury-card p-4 rounded-xl">
                    <h4 className="text-sm font-display font-semibold text-gold mb-3 flex items-center">
                      <Ruler className="w-4 h-4 mr-2" />
                      Bespoke Measurements
                    </h4>
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div className="text-center">
                        <div className="text-silver/60">Chest</div>
                        <div className="text-gold font-semibold">{customer.measurements.chest}"</div>
                      </div>
                      <div className="text-center">
                        <div className="text-silver/60">Waist</div>
                        <div className="text-gold font-semibold">{customer.measurements.waist}"</div>
                      </div>
                      <div className="text-center">
                        <div className="text-silver/60">Shoulder</div>
                        <div className="text-gold font-semibold">{customer.measurements.shoulder}"</div>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <MeasuringTape length={80} />
                    </div>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="p-6 pt-0">
                  <Button variant="golden" className="w-full group-hover:shadow-golden transition-all">
                    <Scissors className="w-4 h-4 mr-2" />
                    Create Masterpiece
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}