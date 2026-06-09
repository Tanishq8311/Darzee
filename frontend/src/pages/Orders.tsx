import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Calendar,
  DollarSign,
  Package,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  Pause,
  X,
  Save
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SimpleLoader } from '@/components/animations/SimpleLoader';
import { useAppStore } from '@/store';
import { useAuthStore } from '@/store/auth';
import { Order, UserRole, OrderStatus, ClothingType } from '@/types';

export function Orders() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const { user } = useAuthStore();
  const { 
    addOrder, 
    updateOrder, 
    deleteOrder, 
    getOrdersByTailor, 
    getOrdersByCustomer,
    getCustomersByTailor,
    designs 
  } = useAppStore();

  if (!user) return null;

  // Get orders based on user role
  const userOrders = user.role === UserRole.TAILOR 
    ? getOrdersByTailor(user.id)
    : getOrdersByCustomer(user.id);

  // Get customers (only for tailors)
  const customers = user.role === UserRole.TAILOR ? getCustomersByTailor(user.id) : [];

  // Filter orders
  const filteredOrders = userOrders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case OrderStatus.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case OrderStatus.READY:
        return 'bg-green-100 text-green-800 border-green-200';
      case OrderStatus.DELIVERED:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case OrderStatus.CANCELLED:
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return <Clock className="w-4 h-4" />;
      case OrderStatus.IN_PROGRESS:
        return <Package className="w-4 h-4" />;
      case OrderStatus.READY:
        return <CheckCircle className="w-4 h-4" />;
      case OrderStatus.DELIVERED:
        return <CheckCircle className="w-4 h-4" />;
      case OrderStatus.CANCELLED:
        return <X className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleCreateOrder = async (formData: FormData) => {
    if (user.role !== UserRole.TAILOR) return;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const selectedCustomer = customers.find(c => c.id === formData.get('customerId') as string);
    const selectedDesign = designs.find(d => d.id === formData.get('designId') as string);
    
    if (!selectedCustomer || !selectedDesign) {
      setIsLoading(false);
      return;
    }

    const quantity = Number(formData.get('quantity')) || 1;
    const unitPrice = Number(formData.get('unitPrice')) || selectedDesign.basePrice;
    const totalAmount = quantity * unitPrice;
    const advanceAmount = Number(formData.get('advanceAmount')) || 0;
    
    const orderData = {
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      tailorId: user.id,
      items: [{
        id: '1',
        designId: selectedDesign.id,
        designName: selectedDesign.name,
        quantity,
        unitPrice,
        totalPrice: totalAmount,
        measurements: selectedCustomer.measurements,
        customizations: (formData.get('customizations') as string)?.split(',').map(s => s.trim()).filter(Boolean) || [],
      }],
      status: OrderStatus.PENDING,
      totalAmount,
      advanceAmount,
      remainingAmount: totalAmount - advanceAmount,
      orderDate: new Date(),
      estimatedDeliveryDate: new Date(formData.get('estimatedDeliveryDate') as string),
      notes: formData.get('notes') as string || '',
    };

    addOrder(orderData);
    setShowCreateForm(false);
    setIsLoading(false);
  };

  const handleUpdateOrder = async (formData: FormData) => {
    if (!editingOrder || user.role !== UserRole.TAILOR) return;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const updates = {
      status: formData.get('status') as OrderStatus,
      estimatedDeliveryDate: new Date(formData.get('estimatedDeliveryDate') as string),
      notes: formData.get('notes') as string || '',
      advanceAmount: Number(formData.get('advanceAmount')) || editingOrder.advanceAmount,
    };
    
    updates.remainingAmount = editingOrder.totalAmount - updates.advanceAmount;
    
    updateOrder(editingOrder.id, updates);
    setEditingOrder(null);
    setIsLoading(false);
  };

  const handleDeleteOrder = async (id: string) => {
    if (user.role !== UserRole.TAILOR) return;
    
    if (confirm('Are you sure you want to delete this order?')) {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      deleteOrder(id);
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
          <h1 className="text-3xl font-bold">
            {user.role === UserRole.TAILOR ? 'Order Management' : 'My Orders'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {user.role === UserRole.TAILOR 
              ? 'Create and manage tailoring orders' 
              : 'Track your orders and delivery status'
            }
          </p>
        </div>
        {user.role === UserRole.TAILOR && (
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Order
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by customer name or order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring bg-background"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
          className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring bg-background"
        >
          <option value="all">All Status</option>
          <option value={OrderStatus.PENDING}>Pending</option>
          <option value={OrderStatus.IN_PROGRESS}>In Progress</option>
          <option value={OrderStatus.READY}>Ready</option>
          <option value={OrderStatus.DELIVERED}>Delivered</option>
          <option value={OrderStatus.CANCELLED}>Cancelled</option>
        </select>
      </div>

      {/* Create Order Form */}
      {showCreateForm && user.role === UserRole.TAILOR && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Create New Order</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowCreateForm(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleCreateOrder(new FormData(e.currentTarget));
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Customer *</label>
                  <select
                    name="customerId"
                    required
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring bg-background"
                  >
                    <option value="">Select a customer</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} - {customer.phone}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Design *</label>
                  <select
                    name="designId"
                    required
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring bg-background"
                  >
                    <option value="">Select a design</option>
                    {designs.filter(d => d.isActive).map(design => (
                      <option key={design.id} value={design.id}>
                        {design.name} - ₹{design.basePrice}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Quantity *</label>
                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    defaultValue="1"
                    required
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Unit Price (₹) *</label>
                  <input
                    type="number"
                    name="unitPrice"
                    min="0"
                    step="0.01"
                    required
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Advance Payment (₹) *</label>
                  <input
                    type="number"
                    name="advanceAmount"
                    min="0"
                    step="0.01"
                    required
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Estimated Delivery *</label>
                  <input
                    type="date"
                    name="estimatedDeliveryDate"
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring bg-background"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Customizations</label>
                  <input
                    type="text"
                    name="customizations"
                    placeholder="e.g., Extra pockets, Special buttons (comma separated)"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring bg-background"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Notes</label>
                  <textarea
                    name="notes"
                    rows={3}
                    placeholder="Additional notes or special instructions..."
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring bg-background"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  Create Order
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Edit Order Form */}
      {editingOrder && user.role === UserRole.TAILOR && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Edit Order #{editingOrder.id.slice(-6)}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setEditingOrder(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleUpdateOrder(new FormData(e.currentTarget));
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Status *</label>
                  <select
                    name="status"
                    defaultValue={editingOrder.status}
                    required
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring bg-background"
                  >
                    <option value={OrderStatus.PENDING}>Pending</option>
                    <option value={OrderStatus.IN_PROGRESS}>In Progress</option>
                    <option value={OrderStatus.READY}>Ready</option>
                    <option value={OrderStatus.DELIVERED}>Delivered</option>
                    <option value={OrderStatus.CANCELLED}>Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Estimated Delivery *</label>
                  <input
                    type="date"
                    name="estimatedDeliveryDate"
                    defaultValue={new Date(editingOrder.estimatedDeliveryDate).toISOString().split('T')[0]}
                    required
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Advance Paid (₹)</label>
                  <input
                    type="number"
                    name="advanceAmount"
                    defaultValue={editingOrder.advanceAmount}
                    min="0"
                    max={editingOrder.totalAmount}
                    step="0.01"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Total Amount</label>
                  <input
                    type="text"
                    value={`₹${editingOrder.totalAmount.toLocaleString()}`}
                    disabled
                    className="w-full px-3 py-2 border border-border rounded-lg bg-muted text-muted-foreground"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Notes</label>
                  <textarea
                    name="notes"
                    defaultValue={editingOrder.notes}
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring bg-background"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={() => setEditingOrder(null)}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  Update Order
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No orders found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== 'all'
                ? 'No orders match your filters.'
                : user.role === UserRole.TAILOR
                ? 'Start by creating your first order.'
                : 'No orders placed yet.'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && user.role === UserRole.TAILOR && (
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Order
              </Button>
            )}
          </div>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">Order #{order.id.slice(-6)}</h3>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <User className="w-4 h-4" />
                          <span>{order.customerName}</span>
                          <span>•</span>
                          <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{order.status.replace('_', ' ').toUpperCase()}</span>
                        </span>
                        {user.role === UserRole.TAILOR && (
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingOrder(order)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteOrder(order.id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Items</p>
                        <div className="space-y-1">
                          {order.items.map((item, index) => (
                            <p key={index} className="text-sm">
                              {item.quantity}x {item.designName}
                            </p>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Payment</p>
                        <p className="text-sm font-semibold">₹{order.totalAmount.toLocaleString()}</p>
                        <p className="text-xs text-green-600">₹{order.advanceAmount.toLocaleString()} paid</p>
                        {order.remainingAmount > 0 && (
                          <p className="text-xs text-red-600">₹{order.remainingAmount.toLocaleString()} due</p>
                        )}
                      </div>

                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Delivery</p>
                        <div className="flex items-center space-x-1 text-sm">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(order.estimatedDeliveryDate).toLocaleDateString()}</span>
                        </div>
                        {new Date(order.estimatedDeliveryDate) < new Date() && order.status !== OrderStatus.DELIVERED && (
                          <p className="text-xs text-red-600">Overdue</p>
                        )}
                      </div>
                    </div>

                    {order.notes && (
                      <div className="pt-3 border-t border-border">
                        <p className="text-sm text-muted-foreground">
                          <strong>Notes:</strong> {order.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Orders Summary */}
      {userOrders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Orders Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{userOrders.length}</div>
                <div className="text-sm text-muted-foreground">Total Orders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {userOrders.filter(o => o.status === OrderStatus.PENDING || o.status === OrderStatus.IN_PROGRESS).length}
                </div>
                <div className="text-sm text-muted-foreground">Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {userOrders.filter(o => o.status === OrderStatus.DELIVERED).length}
                </div>
                <div className="text-sm text-muted-foreground">Delivered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  ₹{userOrders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Value</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}