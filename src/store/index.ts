import { create } from 'zustand';
import { Customer, Order, Design, DashboardStats } from '@/types';

interface AppState {
  // Customers
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  getCustomerById: (id: string) => Customer | undefined;

  // Orders
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateOrder: (id: string, order: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  getOrderById: (id: string) => Order | undefined;

  // Designs
  designs: Design[];
  addDesign: (design: Omit<Design, 'id' | 'createdAt'>) => void;
  updateDesign: (id: string, design: Partial<Design>) => void;
  deleteDesign: (id: string) => void;

  // Dashboard
  getDashboardStats: () => DashboardStats;
}

export const useAppStore = create<AppState>((set, get) => ({
  customers: [],
  orders: [],
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

  addCustomer: (customerData) =>
    set((state) => ({
      customers: [
        ...state.customers,
        {
          ...customerData,
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
        order.id === id
          ? { ...order, ...orderData, updatedAt: new Date() }
          : order
      ),
    })),

  deleteOrder: (id) =>
    set((state) => ({
      orders: state.orders.filter((order) => order.id !== id),
    })),

  getOrderById: (id) => get().orders.find((order) => order.id === id),

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

  getDashboardStats: () => {
    const state = get();
    const totalOrders = state.orders.length;
    const pendingOrders = state.orders.filter(
      (order) => order.status === 'pending' || order.status === 'in_progress'
    ).length;
    const completedOrders = state.orders.filter(
      (order) => order.status === 'completed' || order.status === 'delivered'
    ).length;
    const totalRevenue = state.orders
      .filter((order) => order.status === 'delivered')
      .reduce((sum, order) => sum + order.totalAmount, 0);
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyRevenue = state.orders
      .filter(
        (order) =>
          order.status === 'delivered' &&
          order.deliveryDate.getMonth() === currentMonth &&
          order.deliveryDate.getFullYear() === currentYear
      )
      .reduce((sum, order) => sum + order.totalAmount, 0);

    return {
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue,
      monthlyRevenue,
      totalCustomers: state.customers.length,
    };
  },
}));