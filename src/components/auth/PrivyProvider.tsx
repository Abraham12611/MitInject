"use client";

import { PrivyProvider as BasePrivyProvider } from '@privy-io/react-auth';
import { PrivyWagmiConnector } from '@privy-io/wagmi-connector';
import { configureChains, createConfig } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { PrivyAuthProvider } from '@/contexts/PrivyAuthContext';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [publicProvider()]
);

const wagmiConfig = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});

interface PrivyProviderProps {
  children: React.ReactNode;
}

export function PrivyProvider({ children }: PrivyProviderProps) {
  return (
    <BasePrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        loginMethods: ['email', 'wallet'],
        appearance: {
          theme: 'dark',
          accentColor: '#7C3AED', // Injective purple
          showWalletLoginFirst: true,
        },
        defaultChain: mainnet,
      }}
    >
      <PrivyWagmiConnector
        wagmiChainsConfig={{
          chains,
          publicClient,
        }}
      >
        <PrivyAuthProvider>{children}</PrivyAuthProvider>
      </PrivyWagmiConnector>
    </BasePrivyProvider>
  );
} 