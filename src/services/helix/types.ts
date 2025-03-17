import { OrderSide, OrderType } from '@injectivelabs/sdk-ts'

export interface MarketData {
  orderbook: any;
  trades: any;
  market: any;
}

export interface OrderDetails {
  privateKeyHex: string;
  marketId: string;
  orderSide: OrderSide;
  quantity: string;
  price: string;
}

export interface LiquidityOrder {
  price: string;
  quantity: string;
  side: OrderSide;
}

export interface Condition {
  checkCondition: () => Promise<boolean>;
  description: string;
}

export interface Action {
  execute: (params: any) => Promise<any>;
  description: string;
}

export interface NetworkConfig {
  network: string;
  endpoints: {
    indexer: string;
    tx: string;
  };
  chainId: string;
}

export interface TransactionOptions {
  memo?: string;
  fee?: {
    amount: {
      denom: string;
      amount: string;
    }[];
    gas: string;
  };
}