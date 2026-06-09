export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  measurements: Measurements;
  createdAt: Date;
  updatedAt: Date;
}

export interface Measurements {
  chest: number;
  waist: number;
  hips: number;
  shoulder: number;
  armLength: number;
  legLength: number;
  neck: number;
  notes?: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  advanceAmount: number;
  remainingAmount: number;
  orderDate: Date;
  deliveryDate: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  type: ClothingType;
  design: string;
  fabric: string;
  quantity: number;
  price: number;
  measurements: Partial<Measurements>;
  specialInstructions?: string;
}

export enum OrderStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  READY_FOR_TRIAL = 'ready_for_trial',
  ALTERATIONS = 'alterations',
  COMPLETED = 'completed',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export enum ClothingType {
  SHIRT = 'shirt',
  PANT = 'pant',
  SUIT = 'suit',
  DRESS = 'dress',
  BLOUSE = 'blouse',
  LEHENGA = 'lehenga',
  KURTA = 'kurta',
  JACKET = 'jacket',
  OTHER = 'other'
}

export interface Design {
  id: string;
  name: string;
  type: ClothingType;
  description: string;
  imageUrl?: string;
  basePrice: number;
  isActive: boolean;
  createdAt: Date;
}

export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalCustomers: number;
}