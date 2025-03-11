import {
  getEip712TypedData,
  TxResponse,
  IndexerGrpcSpotApi,
  IndexerGrpcDerivativesApi,
  OrderTypeMap as SpotOrderType,
  OrderTypeMap as DerivativeOrderType,
  MsgCreateSpotLimitOrder,
  MsgCreateSpotMarketOrder,
  MsgCreateDerivativeLimitOrder,
  MsgCreateDerivativeMarketOrder,
  MsgCancelSpotOrder,
  MsgCancelDerivativeOrder,
} from '@injectivelabs/sdk-ts';
import { MsgBroadcaster } from '@injectivelabs/wallet-ts'
import { EthereumChainId, ChainId } from '@injectivelabs/ts-types'
import {
    Network,
    getNetworkEndpoints,
    getInjNameRegistryContractForNetwork,
    getNetworkInfo
  } from '@injectivelabs/networks'
import {
  PrivateKey,
  ChainRestAuthApi,
  createTransaction,
} from '@injectivelabs/sdk-ts'
import { TxClient } from "@injectivelabs/sdk-ts";
import { BigNumberInBase, BigNumberInWei } from "@injectivelabs/utils";
import { walletStrategy } from './injective-wallet';
import { OrderSide as SpotOrderSide, OrderSide as DerivativeOrderSide } from '@injectivelabs/ts-types'

// Network configuration based on environment
const NETWORK = process.env.NEXT_PUBLIC_INJECTIVE_NETWORK || 'testnet';
const networkInfo = getNetworkInfo(NETWORK as Network);
const chainId = networkInfo.chainId;
const ethereumChainId = networkInfo.ethereumChainId;
const txService = new TxClient(networkInfo.grpc);

// API endpoints
const INDEXER_API = process.env.NEXT_PUBLIC_INJECTIVE_INDEXER || '';
const TX_API = process.env.NEXT_PUBLIC_INJECTIVE_TX_API || '';

// Gas configuration
const DEFAULT_GAS_PRICE = 500000000; // 0.5 INJ
const DEFAULT_GAS_LIMIT = {
  spot: 200000,
  derivative: 250000,
  cancel: 150000
};

// Initialize API clients
const spotApi = new IndexerGrpcSpotApi(INDEXER_API);
const derivativeApi = new IndexerGrpcDerivativesApi(INDEXER_API);
const txClient = new TxClient(TX_API);

// Initialize message broadcaster
const msgBroadcaster = new MsgBroadcaster({
  walletStrategy,
  network: NETWORK as Network,
  simulateTx: true,
  txTimeout: 60000
});

/**
 * Order types and interfaces
 */
export enum OrderType {
  MARKET = 'MARKET',
  LIMIT = 'LIMIT'
}

export enum OrderSide {
  BUY = 'BUY',
  SELL = 'SELL'
}

export enum MarketType {
  SPOT = 'SPOT',
  DERIVATIVE = 'DERIVATIVE'
}

export interface OrderParams {
  marketId: string;
  marketType: MarketType;
  orderType: OrderType;
  orderSide: OrderSide;
  price?: string; // Required for limit orders
  quantity: string;
  leverage?: number; // Required for derivative orders
  subaccountId?: string; // Optional, will use default if not provided
}

export interface CancelOrderParams {
  marketId: string;
  marketType: MarketType;
  orderId: string;
  subaccountId?: string;
}

export interface TransactionResponse {
  txHash: string;
  success: boolean;
  error?: string;
}

/**
 * Gets the Injective address from the wallet strategy
 */
export const getInjectiveAddress = async (): Promise<string> => {
  try {
    const address = await walletStrategy.getAddresses();
    if (!address.length) {
      throw new Error('No address found in wallet');
    }
    return address[0];
  } catch (error) {
    console.error('Failed to get Injective address:', error);
    throw new Error('Failed to get Injective address');
  }
};

/**
 * Gets the default subaccount ID for the current address
 */
export const getDefaultSubaccountId = async (): Promise<string> => {
  try {
    const address = await getInjectiveAddress();
    return `${address}000000000000000000000000`;
  } catch (error) {
    console.error('Failed to get default subaccount ID:', error);
    throw new Error('Failed to get default subaccount ID');
  }
};

/**
 * Estimates gas for a transaction
 */
export const estimateGas = async (msgs: any[]): Promise<number> => {
  try {
    const address = await getInjectiveAddress();
    const simulationResponse = await msgBroadcaster.simulate({
      msgs,
      address,
      chainId
    });
    
    return Math.ceil(simulationResponse.gasInfo.gasUsed * 1.3); // Add 30% buffer
  } catch (error) {
    console.error('Gas estimation failed:', error);
    // Return default gas limit based on message type
    if (msgs[0] instanceof MsgCreateSpotLimitOrder || msgs[0] instanceof MsgCreateSpotMarketOrder) {
      return DEFAULT_GAS_LIMIT.spot;
    } else if (
      msgs[0] instanceof MsgCreateDerivativeLimitOrder || 
      msgs[0] instanceof MsgCreateDerivativeMarketOrder
    ) {
      return DEFAULT_GAS_LIMIT.derivative;
    } else if (
      msgs[0] instanceof MsgCancelSpotOrder || 
      msgs[0] instanceof MsgCancelDerivativeOrder
    ) {
      return DEFAULT_GAS_LIMIT.cancel;
    }
    
    return 200000; // Default fallback
  }
};

/**
 * Creates and signs a transaction with EIP-712
 */
export const signTransaction = async (msgs: any[]): Promise<string> => {
  try {
    const address = await getInjectiveAddress();
    const gas = await estimateGas(msgs);
    
    const { txRaw, signDoc } = createTransaction({
      chainId,
      message: msgs,
      timeoutHeight: 0,
      fee: {
        amount: [
          {
            denom: 'inj',
            amount: (gas * DEFAULT_GAS_PRICE).toString(),
          },
        ],
        gas: gas.toString(),
      },
      memo: '',
      signMode: 'EIP712',
    });
    
    const typedData = getEip712TypedData({
      msgs,
      fee: {
        amount: [
          {
            denom: 'inj',
            amount: (gas * DEFAULT_GAS_PRICE).toString(),
          },
        ],
        gas: gas.toString(),
      },
      chainId: ethereumChainId,
      memo: '',
    });
    
    const signature = await walletStrategy.signEip712TypedData(
      JSON.stringify(typedData),
      address
    );
    
    return txClient.broadcastTx(txRaw, signature);
  } catch (error) {
    console.error('Transaction signing failed:', error);
    throw new Error(`Transaction signing failed: ${error.message}`);
  }
};

/**
 * Creates and broadcasts a spot order
 */
export const createSpotOrder = async (params: OrderParams): Promise<TransactionResponse> => {
  try {
    const { 
      marketId, 
      orderType, 
      orderSide, 
      price, 
      quantity, 
      subaccountId: providedSubaccountId 
    } = params;
    
    const address = await getInjectiveAddress();
    const subaccountId = providedSubaccountId || await getDefaultSubaccountId();
    
    // Convert order side to SDK enum
    const side = orderSide === OrderSide.BUY 
      ? SpotOrderSide.Buy 
      : SpotOrderSide.Sell;
    
    let msg;
    
    if (orderType === OrderType.LIMIT) {
      if (!price) {
        throw new Error('Price is required for limit orders');
      }
      
      // Create limit order message
      msg = MsgCreateSpotLimitOrder.fromJSON({
        sender: address,
        order: {
          marketId,
          subaccountId,
          feeRecipient: address,
          price: new BigNumberInBase(price).toWei().toFixed(),
          quantity: new BigNumberInBase(quantity).toWei().toFixed(),
          orderType: SpotOrderType.Limit,
          side
        }
      });
    } else {
      // Create market order message
      msg = MsgCreateSpotMarketOrder.fromJSON({
        sender: address,
        order: {
          marketId,
          subaccountId,
          feeRecipient: address,
          quantity: new BigNumberInBase(quantity).toWei().toFixed(),
          orderType: SpotOrderType.Market,
          side
        }
      });
    }
    
    const txHash = await signTransaction([msg]);
    
    return {
      txHash,
      success: true
    };
  } catch (error) {
    console.error('Failed to create spot order:', error);
    return {
      txHash: '',
      success: false,
      error: error.message
    };
  }
};

/**
 * Creates and broadcasts a derivative order
 */
export const createDerivativeOrder = async (params: OrderParams): Promise<TransactionResponse> => {
  try {
    const { 
      marketId, 
      orderType, 
      orderSide, 
      price, 
      quantity, 
      leverage = 1,
      subaccountId: providedSubaccountId 
    } = params;
    
    const address = await getInjectiveAddress();
    const subaccountId = providedSubaccountId || await getDefaultSubaccountId();
    
    // Convert order side to SDK enum
    const side = orderSide === OrderSide.BUY 
      ? DerivativeOrderSide.Buy 
      : DerivativeOrderSide.Sell;
    
    let msg;
    
    if (orderType === OrderType.LIMIT) {
      if (!price) {
        throw new Error('Price is required for limit orders');
      }
      
      // Create derivative limit order message
      msg = MsgCreateDerivativeLimitOrder.fromJSON({
        sender: address,
        order: {
          marketId,
          subaccountId,
          feeRecipient: address,
          price: new BigNumberInBase(price).toWei().toFixed(),
          quantity: new BigNumberInBase(quantity).toWei().toFixed(),
          leverage: leverage.toString(),
          orderType: DerivativeOrderType.Limit,
          side
        }
      });
    } else {
      // Create derivative market order message
      msg = MsgCreateDerivativeMarketOrder.fromJSON({
        sender: address,
        order: {
          marketId,
          subaccountId,
          feeRecipient: address,
          quantity: new BigNumberInBase(quantity).toWei().toFixed(),
          leverage: leverage.toString(),
          orderType: DerivativeOrderType.Market,
          side
        }
      });
    }
    
    const txHash = await signTransaction([msg]);
    
    return {
      txHash,
      success: true
    };
  } catch (error) {
    console.error('Failed to create derivative order:', error);
    return {
      txHash: '',
      success: false,
      error: error.message
    };
  }
};

/**
 * Cancels an existing order
 */
export const cancelOrder = async (params: CancelOrderParams): Promise<TransactionResponse> => {
  try {
    const { 
      marketId, 
      marketType, 
      orderId,
      subaccountId: providedSubaccountId 
    } = params;
    
    const address = await getInjectiveAddress();
    const subaccountId = providedSubaccountId || await getDefaultSubaccountId();
    
    let msg;
    
    if (marketType === MarketType.SPOT) {
      msg = MsgCancelSpotOrder.fromJSON({
        sender: address,
        marketId,
        subaccountId,
        orderId
      });
    } else {
      msg = MsgCancelDerivativeOrder.fromJSON({
        sender: address,
        marketId,
        subaccountId,
        orderId
      });
    }
    
    const txHash = await signTransaction([msg]);
    
    return {
      txHash,
      success: true
    };
  } catch (error) {
    console.error('Failed to cancel order:', error);
    return {
      txHash: '',
      success: false,
      error: error.message
    };
  }
};

/**
 * Creates an order (spot or derivative)
 */
export const createOrder = async (params: OrderParams): Promise<TransactionResponse> => {
  if (params.marketType === MarketType.SPOT) {
    return createSpotOrder(params);
  } else {
    return createDerivativeOrder(params);
  }
};

/**
 * Gets the transaction status
 */
export const getTransactionStatus = async (txHash: string): Promise<boolean> => {
  try {
    const txResponse = await txClient.fetchTx(txHash);
    return txResponse.code === 0;
  } catch (error) {
    console.error('Failed to get transaction status:', error);
    return false;
  }
}; 