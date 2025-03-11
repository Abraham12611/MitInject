'use client'

import { createContext, useContext, useState, useCallback } from 'react';

interface User {
  accessToken?: string;
  idToken?: string;
  email?: string;
  name?: string;
  publicKey?: string;
  type?: string;
  address?: string;  // Injective address
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (method: 'privy' | 'wallet', data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  login: async () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const handleSetUser = useCallback((newUser: User | null) => {
    console.log('AuthContext: Setting user to:', newUser);
    setUser(newUser);
  }, []);

  const login = async (method: 'privy' | 'wallet', data: any) => {
    try {
      if (method === 'wallet') {
        setUser({
          publicKey: data.publicKey,
          type: data.type,
          address: data.address
        });
      } else if (method === 'privy') {
        // Privy login will be implemented here
        setUser({
          ...data,
          type: 'privy'
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser: handleSetUser,
      login
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 


// 'use client'

// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { decryptData } from '@/utils/encryption';

// // Provide default values
// const AuthContext = createContext({
//   isAuthenticated: false,
//   user: null,
//   loading: true,
//   login: () => Promise.resolve(),
//   logout: () => {},
// });

// export function AuthProvider({ children }) {
//   const router = useRouter();
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Check for existing auth on mount
//   useEffect(() => {
//     checkAuth();
//   }, []);

//   const checkAuth = () => {
//     try {
//       // Check localStorage for wallet or session
//       const wallet = localStorage.getItem('wallet');
//       const session = localStorage.getItem('session');

//       if (wallet) {
//         const decryptedWallet = decryptData(wallet);
//         setUser({ type: 'wallet', ...decryptedWallet });
//         setIsAuthenticated(true);
//       } else if (session) {
//         const sessionData = JSON.parse(session);
//         setUser({ type: 'google', ...sessionData });
//         setIsAuthenticated(true);
//       }
//     } catch (error) {
//       console.error('Auth check failed:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = async (method, data) => {
//     try {
//       switch (method) {
//         case 'google':
//           // Start Google OAuth flow
//           const response = await fetch('/api/auth/google');
//           const { url } = await response.json();
//           window.location.href = url; // Redirect to Google login
//           break;

//         case 'wallet':
//           // Handle wallet login (already implemented)
//           setUser({ type: 'wallet', ...data });
//           setIsAuthenticated(true);
//           break;

//         default:
//           throw new Error('Invalid login method');
//       }
//     } catch (error) {
//       console.error('Login failed:', error);
//       throw error;
//     }
//   };

//   const logout = () => {
//     try {
//       // Clear all auth data
//       localStorage.removeItem('wallet');
//       localStorage.removeItem('session');
//       setUser(null);
//       setIsAuthenticated(false);
//       router.push('/');
//     } catch (error) {
//       console.error('Logout failed:', error);
//     }
//   };

//   const value = {
//     isAuthenticated,
//     user,
//     loading,
//     login,
//     logout,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   // Only throw if we're not in loading state
//   if (!context && !context.loading) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }; 