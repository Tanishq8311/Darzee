import React, { useState } from 'react';
import { Scissors, User, Building, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SimpleLoader } from '@/components/animations/SimpleLoader';
import { useAuthStore } from '@/store/auth';
import { UserRole } from '@/types';

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.CUSTOMER);
  const [error, setError] = useState('');
  
  const { login, signup, isLoading } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    const formData = new FormData(e.currentTarget);
    
    if (isLogin) {
      const success = await login({
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      });
      
      if (!success) {
        setError('Invalid credentials. Try: tailor@test.com or customer@test.com with password: password');
      }
    } else {
      const signupData = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        password: formData.get('password') as string,
        role: selectedRole,
        shopName: selectedRole === UserRole.TAILOR ? formData.get('shopName') as string : undefined,
        experience: selectedRole === UserRole.TAILOR ? Number(formData.get('experience')) : undefined,
        specialization: selectedRole === UserRole.TAILOR ? 
          (formData.get('specialization') as string)?.split(',').map(s => s.trim()) : undefined,
      };
      
      const success = await signup(signupData);
      
      if (!success) {
        setError('User already exists with this email');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <SimpleLoader size="lg" text={isLogin ? 'Signing in...' : 'Creating account...'} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Scissors className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">Darzee</h1>
          </div>
          <CardTitle>{isLogin ? 'Welcome Back' : 'Create Account'}</CardTitle>
          <p className="text-muted-foreground">
            {isLogin ? 'Sign in to your account' : 'Join our tailoring community'}
          </p>
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          {/* Role Selection for Signup */}
          {!isLogin && (
            <div className="mb-6">
              <label className="text-sm font-medium mb-3 block">I am a:</label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={selectedRole === UserRole.CUSTOMER ? 'default' : 'outline'}
                  onClick={() => setSelectedRole(UserRole.CUSTOMER)}
                  className="h-auto p-4"
                >
                  <div className="text-center">
                    <User className="w-6 h-6 mx-auto mb-1" />
                    <div className="text-sm">Customer</div>
                  </div>
                </Button>
                <Button
                  type="button"
                  variant={selectedRole === UserRole.TAILOR ? 'default' : 'outline'}
                  onClick={() => setSelectedRole(UserRole.TAILOR)}
                  className="h-auto p-4"
                >
                  <div className="text-center">
                    <Scissors className="w-6 h-6 mx-auto mb-1" />
                    <div className="text-sm">Tailor</div>
                  </div>
                </Button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring bg-background"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring bg-background"
                placeholder="Enter your email"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring bg-background"
                  placeholder="Enter your phone number"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  className="w-full px-3 py-2 pr-10 border border-border rounded-lg focus:ring-2 focus:ring-ring bg-background"
                  placeholder="Enter your password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Tailor-specific fields */}
            {!isLogin && selectedRole === UserRole.TAILOR && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Shop Name</label>
                  <input
                    type="text"
                    name="shopName"
                    required
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring bg-background"
                    placeholder="Enter your shop name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Experience (years)</label>
                  <input
                    type="number"
                    name="experience"
                    min="0"
                    max="50"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring bg-background"
                    placeholder="Years of experience"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Specialization</label>
                  <input
                    type="text"
                    name="specialization"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring bg-background"
                    placeholder="e.g., Suits, Shirts, Formal wear (comma separated)"
                  />
                </div>
              </>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
            </span>
            <Button
              variant="link"
              className="p-0 ml-1 h-auto"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </Button>
          </div>

          {/* Demo Credentials */}
          {isLogin && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg text-xs">
              <div className="font-medium mb-1">Demo Accounts:</div>
              <div>Tailor: tailor@test.com</div>
              <div>Customer: customer@test.com</div>
              <div>Password: password</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}