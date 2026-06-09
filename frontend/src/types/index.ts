export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  role: UserRole;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
  // Tailor specific fields
  shopName?: string;
  experience?: number;
  specialization?: string[];
  // Customer specific fields
  measurements?: Measurements;
  tailorId?: string; // Which tailor added this customer
}

export enum UserRole {
  TAILOR = 'tailor',
  CUSTOMER = 'customer'
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  // Optional tailor fields
  shopName?: string;
  experience?: number;
  specialization?: string[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  measurements: Measurements;
  tailorId: string; // Who added this customer
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
  tailorId: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  advanceAmount: number;
  remainingAmount: number;
  orderDate: Date;
  estimatedDeliveryDate: Date;
  actualDeliveryDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: Date;
  orderId?: string;
}

export enum NotificationType {
  ORDER_READY = 'order_ready',
  ETA_REMINDER = 'eta_reminder',
  PAYMENT_DUE = 'payment_due',
  ORDER_CREATED = 'order_created',
  ORDER_UPDATED = 'order_updated'
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