import { create } from 'zustand';
import { Customer, Order, Design, DashboardStats, User, UserRole, Notification } from '@/types';

interface AppState {
  // Current user context
  currentUserId: string | null;
  setCurrentUser: (userId: string) => void;

  // Customers (for tailors)
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>, tailorId: string) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  getCustomerById: (id: string) => Customer | undefined;
  getCustomersByTailor: (tailorId: string) => Customer[];

  // Orders
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateOrder: (id: string, order: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  getOrderById: (id: string) => Order | undefined;
  getOrdersByTailor: (tailorId: string) => Order[];
  getOrdersByCustomer: (customerId: string) => Order[];

  // Designs
  designs: Design[];
  addDesign: (design: Omit<Design, 'id' | 'createdAt'>) => void;
  updateDesign: (id: string, design: Partial<Design>) => void;
  deleteDesign: (id: string) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  getNotificationsByUser: (userId: string) => Notification[];

  // Dashboard
  getDashboardStats: (userId: string, userRole: UserRole) => DashboardStats;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Current user context
  currentUserId: null,
  setCurrentUser: (userId: string) => set({ currentUserId: userId }),

  // Mock data
  customers: [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1234567890',
      address: '123 Main St, City, State 12345',
      tailorId: '1', // Mock tailor ID
      measurements: {
        chest: 38,
        waist: 32,
        hips: 36,
        shoulder: 16,
        armLength: 24,
        legLength: 30,
        neck: 15,
      },
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+0987654321',
      address: '456 Oak Ave, Town, State 67890',
      tailorId: '1', // Mock tailor ID
      measurements: {
        chest: 34,
        waist: 28,
        hips: 38,
        shoulder: 14,
        armLength: 22,
        legLength: 28,
        neck: 13,
      },
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20'),
    },
  ],

  orders: [
    {
      id: '1',
      customerId: '1',
      customerName: 'John Smith',
      tailorId: '1',
      items: [
        {
          id: '1',
          type: 'shirt' as any,
          design: 'Classic Formal Shirt',
          fabric: 'Cotton',
          quantity: 2,
          price: 1600,
          measurements: {
            chest: 38,
            waist: 32,
            hips: 36,
            shoulder: 16,
            armLength: 24,
            legLength: 30,
            neck: 15,
          },
          specialInstructions: 'White collar, French cuffs',
        }
      ],
      status: 'in_progress' as any,
      totalAmount: 1600,
      advanceAmount: 500,
      remainingAmount: 1100,
      orderDate: new Date('2024-01-25'),
      estimatedDeliveryDate: new Date('2024-02-10'),
      notes: 'Customer prefers white buttons',
      createdAt: new Date('2024-01-25'),
      updatedAt: new Date('2024-01-25'),
    },
  ],

  designs: [
    {
      id: '1',
      name: 'Classic Formal Shirt',
      type: 'shirt' as any,
      description: 'Traditional formal shirt with collar and cuffs',
      basePrice: 800,
      isActive: true,
      createdAt: new Date(),
    },
    {
      id: '2',
      name: 'Slim Fit Trousers',
      type: 'pant' as any,
      description: 'Modern slim fit formal trousers',
      basePrice: 1200,
      isActive: true,
      createdAt: new Date(),
    },
    {
      id: '3',
      name: 'Traditional Kurta',
      type: 'kurta' as any,
      description: 'Classic Indian kurta with traditional embroidery',
      basePrice: 1500,
      isActive: true,
      createdAt: new Date(),
    },
  ],

  notifications: [
    {
      id: '1',
      userId: '2', // Customer ID
      title: 'Order Ready for Pickup',
      message: 'Order #abc123 is ready! Please visit the shop to collect your order.',
      type: 'order_ready' as any,
      isRead: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      orderId: '1',
    },
    {
      id: '2',
      userId: '1', // Tailor ID
      title: 'Payment Received',
      message: 'Payment of ₹500 received for order #abc123 from John Smith.',
      type: 'payment_due' as any,
      isRead: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      orderId: '1',
    },
    {
      id: '3',
      userId: '2', // Customer ID
      title: 'Order Delivery Tomorrow',
      message: 'Your order #abc123 is scheduled for delivery tomorrow. Make sure you\'re available!',
      type: 'eta_reminder' as any,
      isRead: false,
      createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      orderId: '1',
    },
  ],

  // Customer actions
  addCustomer: (customerData, tailorId) =>
    set((state) => ({
      customers: [
        ...state.customers,
        {
          ...customerData,
          tailorId,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    })),

  updateCustomer: (id, customerData) =>
    set((state) => ({
      customers: state.customers.map((customer) =>
        customer.id === id
          ? { ...customer, ...customerData, updatedAt: new Date() }
          : customer
      ),
    })),

  deleteCustomer: (id) =>
    set((state) => ({
      customers: state.customers.filter((customer) => customer.id !== id),
    })),

  getCustomerById: (id) => get().customers.find((customer) => customer.id === id),

  getCustomersByTailor: (tailorId) =>
    get().customers.filter((customer) => customer.tailorId === tailorId),

  // Order actions
  addOrder: (orderData) =>
    set((state) => ({
      orders: [
        ...state.orders,
        {
          ...orderData,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    })),

  updateOrder: (id, orderData) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === id ? { ...order, ...orderData, updatedAt: new Date() } : order
      ),
    })),

  deleteOrder: (id) =>
    set((state) => ({
      orders: state.orders.filter((order) => order.id !== id),
    })),

  getOrderById: (id) => get().orders.find((order) => order.id === id),

  getOrdersByTailor: (tailorId) =>
    get().orders.filter((order) => order.tailorId === tailorId),

  getOrdersByCustomer: (customerId) =>
    get().orders.filter((order) => order.customerId === customerId),

  // Design actions
  addDesign: (designData) =>
    set((state) => ({
      designs: [
        ...state.designs,
        {
          ...designData,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date(),
        },
      ],
    })),

  updateDesign: (id, designData) =>
    set((state) => ({
      designs: state.designs.map((design) =>
        design.id === id ? { ...design, ...designData } : design
      ),
    })),

  deleteDesign: (id) =>
    set((state) => ({
      designs: state.designs.filter((design) => design.id !== id),
    })),

  // Notification actions
  addNotification: (notificationData) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          ...notificationData,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date(),
        },
      ],
    })),

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification
      ),
    })),

  getNotificationsByUser: (userId) =>
    get().notifications.filter((notification) => notification.userId === userId),

  // Dashboard stats
  getDashboardStats: (userId: string, userRole: UserRole): DashboardStats => {
    const state = get();
    
    if (userRole === UserRole.TAILOR) {
      const tailorCustomers = state.customers.filter(c => c.tailorId === userId);
      const tailorOrders = state.orders.filter(o => o.tailorId === userId);
      
      return {
        totalCustomers: tailorCustomers.length,
        activeOrders: tailorOrders.filter(o => o.status === 'in_progress' || o.status === 'pending').length,
        completedOrders: tailorOrders.filter(o => o.status === 'completed' || o.status === 'delivered').length,
        totalRevenue: tailorOrders.reduce((sum, order) => sum + order.advanceAmount, 0),
        pendingPayments: tailorOrders.reduce((sum, order) => sum + order.remainingAmount, 0),
        monthlyOrders: tailorOrders.filter(o => 
          new Date(o.createdAt).getMonth() === new Date().getMonth() &&
          new Date(o.createdAt).getFullYear() === new Date().getFullYear()
        ).length,
      } as any;
    } else {
      // Customer stats
      const customerOrders = state.orders.filter(o => o.customerId === userId);
      
      return {
        totalCustomers: 0,
        activeOrders: customerOrders.filter(o => o.status === 'in_progress' || o.status === 'pending').length,
        completedOrders: customerOrders.filter(o => o.status === 'completed' || o.status === 'delivered').length,
        totalRevenue: 0,
        pendingPayments: customerOrders.reduce((sum, order) => sum + order.remainingAmount, 0),
        monthlyOrders: customerOrders.filter(o => 
          new Date(o.createdAt).getMonth() === new Date().getMonth() &&
          new Date(o.createdAt).getFullYear() === new Date().getFullYear()
        ).length,
      } as any;
    }
  },
}));