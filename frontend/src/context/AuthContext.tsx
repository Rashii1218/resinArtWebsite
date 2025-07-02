import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  phoneNumber?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  }) => Promise<void>;
  logout: () => void;
  updatePhoneNumber: (phoneNumber: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Always try to fetch the current user from the backend using the cookie
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth/me`,
          { withCredentials: true }
        );
        setUser(response.data);
        localStorage.setItem('userId', response.data._id);
        if (response.data.isAdmin) {
          localStorage.setItem('isAdmin', 'true');
        }
      } catch (error) {
        setUser(null);
        localStorage.removeItem('userId');
        localStorage.removeItem('isAdmin');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth/login`,
      { email, password },
      { withCredentials: true }
    );

    const { user } = response.data;
    setUser(user);
    localStorage.setItem('userId', user._id);
    if (user.isAdmin) {
      localStorage.setItem('isAdmin', 'true');
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  }) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth/register`,
      userData,
      { withCredentials: true }
    );

    const { user } = response.data;
    setUser(user);
    localStorage.setItem('userId', user._id);
    if (user.isAdmin) {
      localStorage.setItem('isAdmin', 'true');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userId');
    localStorage.removeItem('isAdmin');
  };

  const updatePhoneNumber = async (phoneNumber: string) => {
    if (!user) return;
    const response = await axios.patch(
      `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth/user/${user._id}`,
      { phoneNumber },
      { withCredentials: true }
    );
    setUser({ ...user, phoneNumber });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updatePhoneNumber }}>
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 
