import React, { createContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  role: 'head_of_communications' | 'attorney_general' | 'complaint_handler';
  name: string;
  lastLogin?: Date;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo purposes
const mockUsers = [
  {
    id: '1',
    email: 'communications@ag.go.ke',
    password: 'comm123',
    role: 'head_of_communications' as const,
    name: 'Hon. Dorcas',
  },
  {
    id: '2',
    email: 'ag@ag.go.ke',
    password: 'ag123',
    role: 'attorney_general' as const,
    name: 'Hon. Dorcas Oduor',
  },
  {
    id: '3',
    email: 'mary.wanjiku@ag.go.ke',
    password: 'handler123',
    role: 'complaint_handler' as const,
    name: 'Mary Wanjiku',
  },
  {
    id: '4',
    email: 'peter.kimani@ag.go.ke',
    password: 'handler123',
    role: 'complaint_handler' as const,
    name: 'Peter Kimani',
  },
  {
    id: '5',
    email: 'sarah.muthoni@ag.go.ke',
    password: 'handler123',
    role: 'complaint_handler' as const,
    name: 'Sarah Muthoni',
  },
  {
    id: '6',
    email: 'james.ochieng@ag.go.ke',
    password: 'handler123',
    role: 'complaint_handler' as const,
    name: 'James Ochieng',
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('ag_admin_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const userWithLastLogin = {
        ...foundUser,
        lastLogin: new Date(),
      };
      delete (userWithLastLogin as any).password;
      
      setUser(userWithLastLogin);
      localStorage.setItem('ag_admin_user', JSON.stringify(userWithLastLogin));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ag_admin_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}