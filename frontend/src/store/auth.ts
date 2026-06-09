import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthState, LoginCredentials, SignupData, UserRole } from '@/types';

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
}

// Mock users for development (in real app, this would be API calls)
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Tailor',
    email: 'tailor@test.com',
    phone: '+1234567890',
    role: UserRole.TAILOR,
    shopName: 'John\'s Tailoring',
    experience: 10,
    specialization: ['Suits', 'Shirts', 'Formal wear'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Jane Customer',
    email: 'customer@test.com',
    phone: '+0987654321',
    role: UserRole.CUSTOMER,
    tailorId: '1',
    measurements: {
      chest: 38,
      waist: 32,
      hips: 36,
      shoulder: 16,
      armLength: 24,
      legLength: 30,
      neck: 15,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock authentication - check against mock users
        const user = mockUsers.find(u => u.email === credentials.email);
        
        if (user && credentials.password === 'password') {
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false 
          });
          return true;
        }
        
        set({ isLoading: false });
        return false;
      },

      signup: async (data: SignupData) => {
        set({ isLoading: true });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Check if user already exists
        const existingUser = mockUsers.find(u => u.email === data.email);
        if (existingUser) {
          set({ isLoading: false });
          return false;
        }
        
        // Create new user
        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: data.role,
          shopName: data.shopName,
          experience: data.experience,
          specialization: data.specialization,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        mockUsers.push(newUser);
        
        set({ 
          user: newUser, 
          isAuthenticated: true, 
          isLoading: false 
        });
        return true;
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false 
        });
      },

      updateProfile: (data: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { 
            ...currentUser, 
            ...data, 
            updatedAt: new Date() 
          };
          set({ user: updatedUser });
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);