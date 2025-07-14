import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, phone?: string, referredBy?: string) => Promise<boolean>;
  logout: () => void;
  updateWalletBalance: (amount: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('starnetx_user');
    const savedAdmin = localStorage.getItem('starnetx_admin');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    if (savedAdmin === 'true') {
      setIsAdmin(true);
    }
  }, []);

  const generateReferralCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    const users = JSON.parse(localStorage.getItem('starnetx_users') || '[]');
    const foundUser = users.find((u: User) => u.email === email);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('starnetx_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    // Simple admin check - in production, this would be properly secured
    if (email === 'admin@starnetx.com' && password === 'admin123') {
      setIsAdmin(true);
      localStorage.setItem('starnetx_admin', 'true');
      return true;
    }
    return false;
  };

  const register = async (email: string, password: string, phone?: string, referredBy?: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('starnetx_users') || '[]');
    
    if (users.find((u: User) => u.email === email)) {
      return false; // User already exists
    }

    // Validate referral code if provided
    let referrerUser = null;
    if (referredBy) {
      referrerUser = users.find((u: User) => u.referralCode === referredBy.toUpperCase());
      if (!referrerUser) {
        return false; // Invalid referral code
      }
    }
    const newUser: User = {
      id: Date.now().toString(),
      email,
      phone,
      walletBalance: 0,
      referralCode: generateReferralCode(),
      referredBy: referrerUser ? referrerUser.id : undefined,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('starnetx_users', JSON.stringify(users));
    setUser(newUser);
    localStorage.setItem('starnetx_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('starnetx_user');
    localStorage.removeItem('starnetx_admin');
  };

  const updateWalletBalance = (amount: number) => {
    if (user) {
      const updatedUser = { ...user, walletBalance: user.walletBalance + amount };
      setUser(updatedUser);
      localStorage.setItem('starnetx_user', JSON.stringify(updatedUser));
      
      // Update in users array
      const users = JSON.parse(localStorage.getItem('starnetx_users') || '[]');
      const userIndex = users.findIndex((u: User) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem('starnetx_users', JSON.stringify(users));
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAdmin,
      login,
      adminLogin,
      register,
      logout,
      updateWalletBalance,
    }}>
      {children}
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