import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
<<<<<<< HEAD
import { User } from '@supabase/supabase-js';
import { supabase, Profile } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
=======
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'faculty';
  department?: string;
  phone?: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
>>>>>>> 7dbaff3 (Resolve merge conflicts)
  loading: boolean;
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

<<<<<<< HEAD
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  console.log('AuthProvider initializing...');
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider useEffect running');
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Session data:', session);
      setUser(session?.user ?? null);
      if (session?.user) {
        console.log('User found, fetching profile...');
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    console.log('Fetching profile for user:', userId);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
=======
// Create axios instance with base URL from environment variables
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

// Add a request interceptor to include the auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token with backend
      const verifyToken = async () => {
        try {
          const response = await api.get('/auth/me');
          setUser(response.data.user);
        } catch (error) {
          console.error('Error verifying token:', error);
          localStorage.removeItem('token');
          setUser(null);
        } finally {
          setLoading(false);
        }
      };
      verifyToken();
    } else {
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data;
      
      // Store the token in localStorage
      localStorage.setItem('token', token);
      
      // Set the user in state
      setUser(user);
      
      // Redirect based on user role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/faculty/dashboard');
      }
    } catch (error: any) {
      console.error('Error signing in:', error.response?.data?.message || error.message);
      throw error;
>>>>>>> 7dbaff3 (Resolve merge conflicts)
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (data.user) {
      await fetchProfile(data.user.id);
    }
  };

  const signUp = async (
    email: string,
    password: string,
=======
  const signUp = async (
    email: string, 
    password: string, 
>>>>>>> 7dbaff3 (Resolve merge conflicts)
    userData: {
      full_name: string;
      role: 'admin' | 'faculty';
      department?: string;
      phone?: string;
    }
  ) => {
<<<<<<< HEAD
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: data.user.id,
          email,
          full_name: userData.full_name,
          role: userData.role,
          department: userData.department,
          phone: userData.phone,
        },
      ]);

      if (profileError) throw profileError;
      await fetchProfile(data.user.id);
=======
    try {
      setLoading(true);
      const response = await api.post('/auth/register', {
        email,
        password,
        ...userData
      });
      
      const { user, token } = response.data;
      
      // Store the token in localStorage
      localStorage.setItem('token', token);
      
      // Set the user in state
      setUser(user);
      
      // Redirect based on user role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/faculty/dashboard');
      }
    } catch (error: any) {
      console.error('Error signing up:', error.response?.data?.message || error.message);
      throw error;
    } finally {
      setLoading(false);
>>>>>>> 7dbaff3 (Resolve merge conflicts)
    }
  };

  const signOut = async () => {
<<<<<<< HEAD
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, signIn, signUp, signOut }}
    >
      {children}
=======
    try {
      // Call backend to invalidate token
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Error during sign out:', error);
    } finally {
      // Clear local storage and state
      localStorage.removeItem('token');
      setUser(null);
      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {!loading && children}
>>>>>>> 7dbaff3 (Resolve merge conflicts)
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
<<<<<<< HEAD
=======

// Export the axios instance for use in other parts of the app
export { api };
>>>>>>> 7dbaff3 (Resolve merge conflicts)
