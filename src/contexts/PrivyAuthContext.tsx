import { createContext, useContext, useCallback } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';

interface PrivyAuthContextType {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  connectWallet: () => Promise<void>;
  isAuthenticated: boolean;
  isConnected: boolean;
  address: string | null;
  walletAddress: string | null;
  isLoading: boolean;
}

const PrivyAuthContext = createContext<PrivyAuthContextType>({
  login: async () => {},
  logout: async () => {},
  connectWallet: async () => {},
  isAuthenticated: false,
  isConnected: false,
  address: null,
  walletAddress: null,
  isLoading: true,
});

export function usePrivyAuth() {
  const context = useContext(PrivyAuthContext);
  if (!context) {
    throw new Error('usePrivyAuth must be used within a PrivyAuthProvider');
  }
  return context;
}

export function PrivyAuthProvider({ children }: { children: React.ReactNode }) {
  const {
    login: privyLogin,
    logout: privyLogout,
    authenticated: isAuthenticated,
    ready: isReady,
    user,
    connectWallet: privyConnectWallet,
  } = usePrivy();

  const { wallets } = useWallets();
  const { wallet: wagmiWallet } = usePrivyWagmi();
  
  const activeWallet = wallets[0];
  const wagmiAddress = wagmiWallet?.address;

  const login = useCallback(async () => {
    try {
      await privyLogin();
    } catch (error) {
      console.error('Failed to login:', error);
      throw error;
    }
  }, [privyLogin]);

  const logout = useCallback(async () => {
    try {
      await privyLogout();
    } catch (error) {
      console.error('Failed to logout:', error);
      throw error;
    }
  }, [privyLogout]);

  const connectWallet = useCallback(async () => {
    try {
      await privyConnectWallet();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }, [privyConnectWallet]);

  return (
    <PrivyAuthContext.Provider
      value={{
        login,
        logout,
        connectWallet,
        isAuthenticated,
        isConnected: !!wagmiAddress,
        address: user?.id || null,
        walletAddress: wagmiAddress || null,
        isLoading: !isReady,
      }}
    >
      {children}
    </PrivyAuthContext.Provider>
  );
} 