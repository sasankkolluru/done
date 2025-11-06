import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'faculty';
  department?: string;
  phone?: string;
  token: string;
  profile?: any;
}

interface AuthContextType {
  user: User | null;
  profile: any | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: {
    full_name: string;
    role: 'admin' | 'faculty';
    department?: string;
    phone?: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const isAuthenticated = !!user;

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Verify token with backend
          const response = await api.get('/auth/me');
          setUser(response.data.user);
          if (response.data.profile) {
            setProfile(response.data.profile);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data;
      
      // Store the token in localStorage
      localStorage.setItem('token', token);
      
      // Set the default Authorization header for axios
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      if (response.data.profile) {
        setProfile(response.data.profile);
      }
      setLoading(false);
      
      // Redirect based on user role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/faculty/dashboard');
      }
    } catch (error: any) {
      console.error('Error signing in:', error.response?.data?.message || error.message);
      setLoading(false);
      throw error;
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    userData: {
      full_name: string;
      role: 'admin' | 'faculty';
      department?: string;
      phone?: string;
    }
  ) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/register', {
        email,
        password,
        ...userData,
      });
      
      const { user, token } = response.data;
      
      // Store the token in localStorage
      localStorage.setItem('token', token);
      
      // Set the default Authorization header for axios
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      if (response.data.profile) {
        setProfile(response.data.profile);
      }
      setLoading(false);
      
      // Redirect based on user role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/faculty/dashboard');
      }
    } catch (error: any) {
      console.error('Error signing up:', error.response?.data?.message || error.message);
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and state
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      setProfile(null);
      navigate('/login');
    }
  };

  const value = {
    user,
    profile,
    loading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Export the useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;