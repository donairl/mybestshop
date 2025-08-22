import type { User } from '@/types'

// Auth utilities
export const authUtils = {
  // Get stored token
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  },

  // Get stored user
  getUser: (): User | null => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  // Set user data
  setUser: (user: User): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  },

  // Set token
  setToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  },

  // Clear auth data
  logout: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!authUtils.getToken();
  },

  // Check if user is admin
  isAdmin: (): boolean => {
    const user = authUtils.getUser();
    return user?.role === 'ADMIN';
  },

  // Get redirect path based on user role
  getRedirectPath: (user?: User): string => {
    const currentUser = user || authUtils.getUser();
    if (currentUser?.role === 'ADMIN') {
      return '/admin/dashboard';
    }
    return '/products';
  }
};
