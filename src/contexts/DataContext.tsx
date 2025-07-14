import React, { createContext, useContext, useState, useEffect } from 'react';
import { Plan, Location, Purchase, Credential } from '../types';

interface DataContextType {
  plans: Plan[];
  locations: Location[];
  purchases: Purchase[];
  credentials: Credential[];
  addLocation: (location: Omit<Location, 'id'>) => void;
  updateLocation: (id: string, location: Partial<Location>) => void;
  deleteLocation: (id: string) => void;
  addCredential: (credential: Omit<Credential, 'id' | 'createdAt'>) => void;
  updateCredentialStatus: (id: string, status: 'available' | 'used', assignedUserId?: string, assignedPurchaseId?: string) => void;
  deleteCredential: (id: string) => void;
  getAvailableCredential: (locationId: string, planType: string) => Credential | null;
  getCredentialsByLocation: (locationId: string, planType?: string) => Credential[];
  purchasePlan: (planId: string, locationId: string, userId: string) => Purchase | null;
  getUserPurchases: (userId: string) => Purchase[];
  getAllPurchases: () => Purchase[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const defaultPlans: Plan[] = [
  {
    id: '1',
    name: 'Quick Browse',
    duration: '3 Hours',
    price: 250.00,
    dataAmount: '2',
    type: '3-hour',
  },
  {
    id: '2',
    name: 'Daily Essential',
    duration: '1 Day',
    price: 500.00,
    dataAmount: '5',
    type: 'daily',
    popular: true,
  },
  {
    id: '3',
    name: 'Weekly Standard',
    duration: '1 Week',
    price: 2000.00,
    dataAmount: '15',
    type: 'weekly',
    popular: true,
  },
  {
    id: '4',
    name: 'Monthly Premium',
    duration: '1 Month',
    price: 7000.00,
    dataAmount: '50',
    type: 'monthly',
  },
];

const defaultLocations: Location[] = [
  {
    id: '1',
    name: 'StarNetX 1',
    wifiName: 'StarNetX 1',
    username: 'user1',
    password: 'pass123',
    isActive: true,
  },
  {
    id: '2',
    name: 'StarNetX 2',
    wifiName: 'StarNetX 2',
    username: 'user2',
    password: 'pass456',
    isActive: true,
  },
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [plans] = useState<Plan[]>(defaultPlans);
  const [locations, setLocations] = useState<Location[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [credentials, setCredentials] = useState<Credential[]>([]);

  useEffect(() => {
    const savedLocations = localStorage.getItem('starnetx_locations');
    const savedPurchases = localStorage.getItem('starnetx_purchases');
    const savedCredentials = localStorage.getItem('starnetx_credentials');
    
    if (savedLocations) {
      setLocations(JSON.parse(savedLocations));
    } else {
      setLocations(defaultLocations);
      localStorage.setItem('starnetx_locations', JSON.stringify(defaultLocations));
    }
    
    if (savedPurchases) {
      setPurchases(JSON.parse(savedPurchases));
    }
    
    if (savedCredentials) {
      setCredentials(JSON.parse(savedCredentials));
    }
  }, []);

  const addLocation = (location: Omit<Location, 'id'>) => {
    const newLocation: Location = {
      ...location,
      id: Date.now().toString(),
    };
    const updatedLocations = [...locations, newLocation];
    setLocations(updatedLocations);
    localStorage.setItem('starnetx_locations', JSON.stringify(updatedLocations));
  };

  const updateLocation = (id: string, locationUpdate: Partial<Location>) => {
    const updatedLocations = locations.map(loc => 
      loc.id === id ? { ...loc, ...locationUpdate } : loc
    );
    setLocations(updatedLocations);
    localStorage.setItem('starnetx_locations', JSON.stringify(updatedLocations));
  };

  const deleteLocation = (id: string) => {
    const updatedLocations = locations.filter(loc => loc.id !== id);
    setLocations(updatedLocations);
    localStorage.setItem('starnetx_locations', JSON.stringify(updatedLocations));
  };

  const addCredential = (credential: Omit<Credential, 'id' | 'createdAt'>) => {
    const newCredential: Credential = {
      ...credential,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updatedCredentials = [...credentials, newCredential];
    setCredentials(updatedCredentials);
    localStorage.setItem('starnetx_credentials', JSON.stringify(updatedCredentials));
  };

  const updateCredentialStatus = (
    id: string, 
    status: 'available' | 'used', 
    assignedUserId?: string, 
    assignedPurchaseId?: string
  ) => {
    const updatedCredentials = credentials.map(cred => 
      cred.id === id 
        ? { 
            ...cred, 
            status, 
            assignedUserId: status === 'used' ? assignedUserId : undefined,
            assignedPurchaseId: status === 'used' ? assignedPurchaseId : undefined,
            assignedDate: status === 'used' ? new Date().toISOString() : undefined,
          } 
        : cred
    );
    setCredentials(updatedCredentials);
    localStorage.setItem('starnetx_credentials', JSON.stringify(updatedCredentials));
  };

  const deleteCredential = (id: string) => {
    const updatedCredentials = credentials.filter(cred => cred.id !== id);
    setCredentials(updatedCredentials);
    localStorage.setItem('starnetx_credentials', JSON.stringify(updatedCredentials));
  };

  const getAvailableCredential = (locationId: string, planType: string): Credential | null => {
    return credentials.find(cred => 
      cred.locationId === locationId && 
      cred.planType === planType && 
      cred.status === 'available'
    ) || null;
  };

  const getCredentialsByLocation = (locationId: string, planType?: string): Credential[] => {
    return credentials.filter(cred => 
      cred.locationId === locationId && 
      (!planType || cred.planType === planType)
    );
  };

  const purchasePlan = (planId: string, locationId: string, userId: string): Purchase | null => {
    const plan = plans.find(p => p.id === planId);
    const location = locations.find(l => l.id === locationId);
    
    if (!plan || !location) return null;

    // Check for available credential
    const availableCredential = getAvailableCredential(locationId, plan.type);
    if (!availableCredential) {
      return null; // No available credentials
    }

    const now = new Date();
    let expiryDate = new Date(now);
    
    switch (plan.type) {
      case '3-hour':
        expiryDate.setHours(now.getHours() + 3);
        break;
      case 'daily':
        expiryDate.setDate(now.getDate() + 1);
        break;
      case 'weekly':
        expiryDate.setDate(now.getDate() + 7);
        break;
      case 'monthly':
        expiryDate.setMonth(now.getMonth() + 1);
        break;
    }

    const purchase: Purchase = {
      id: Date.now().toString(),
      userId,
      planId,
      locationId,
      amount: plan.price,
      purchaseDate: now.toISOString(),
      expiryDate: expiryDate.toISOString(),
      mikrotikCredentials: {
        username: availableCredential.username,
        password: availableCredential.password,
      },
      status: 'active',
    };

    // Mark credential as used
    updateCredentialStatus(availableCredential.id, 'used', userId, purchase.id);

    // Handle referral commission
    const users = JSON.parse(localStorage.getItem('starnetx_users') || '[]');
    const purchaserUser = users.find((u: any) => u.id === userId);
    
    if (purchaserUser && purchaserUser.referredBy) {
      const referrerIndex = users.findIndex((u: any) => u.id === purchaserUser.referredBy);
      if (referrerIndex !== -1) {
        const commission = plan.price * 0.1; // 10% commission
        users[referrerIndex].walletBalance += commission;
        localStorage.setItem('starnetx_users', JSON.stringify(users));
        
        // Update current user if they are the referrer
        const currentUser = JSON.parse(localStorage.getItem('starnetx_user') || 'null');
        if (currentUser && currentUser.id === users[referrerIndex].id) {
          localStorage.setItem('starnetx_user', JSON.stringify(users[referrerIndex]));
        }
      }
    }
    const updatedPurchases = [...purchases, purchase];
    setPurchases(updatedPurchases);
    localStorage.setItem('starnetx_purchases', JSON.stringify(updatedPurchases));
    
    return purchase;
  };

  const getUserPurchases = (userId: string): Purchase[] => {
    return purchases.filter(purchase => purchase.userId === userId);
  };

  const getAllPurchases = (): Purchase[] => {
    return purchases;
  };

  return (
    <DataContext.Provider value={{
      plans,
      locations,
      purchases,
      credentials,
      addLocation,
      updateLocation,
      deleteLocation,
      addCredential,
      updateCredentialStatus,
      deleteCredential,
      getAvailableCredential,
      getCredentialsByLocation,
      purchasePlan,
      getUserPurchases,
      getAllPurchases,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};