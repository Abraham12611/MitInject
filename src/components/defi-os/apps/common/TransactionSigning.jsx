import React, { useState, useEffect } from 'react';
import { Loader2, Check, AlertCircle, ArrowUpDown, TrendingUp, TrendingDown } from 'lucide-react';
import { usePrivyAuth } from '@/contexts/PrivyAuthContext';
import { 
  createOrder, 
  OrderType, 
  OrderSide, 
  MarketType,
  getTransactionStatus
} from '@/utils/injective-signing';

const TransactionSigning = ({ 
  marketId, 
  marketType = MarketType.SPOT,
  defaultPrice = '',
  defaultQuantity = '',
  defaultOrderType = OrderType.LIMIT,
  defaultOrderSide = OrderSide.BUY,
  defaultLeverage = 1,
  onSuccess,
  onError,
  theme,
  className = ''
}) => {
  // State for form inputs
  const [price, setPrice] = useState(defaultPrice);
  const [quantity, setQuantity] = useState(defaultQuantity);
  const [orderType, setOrderType] = useState(defaultOrderType);
  const [orderSide, setOrderSide] = useState(defaultOrderSide);
  const [leverage, setLeverage] = useState(defaultLeverage);
  
  // State for transaction status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [txStatus, setTxStatus] = useState(null); // null, 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');
  
  // Get wallet address from Privy
  const { walletAddress, isConnected } = usePrivyAuth();
  
  // Check transaction status
  useEffect(() => {
    let intervalId;
    
    if (txHash && txStatus !== 'success' && txStatus !== 'error') {
      intervalId = setInterval(async () => {
        try {
          const status = await getTransactionStatus(txHash);
          if (status) {
            setTxStatus('success');
            onSuccess && onSuccess(txHash);
            clearInterval(intervalId);
          }
        } catch (error) {
          console.error('Error checking transaction status:', error);
        }
      }, 2000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [txHash, txStatus, onSuccess]);
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isConnected || !walletAddress) {
      setErrorMessage('Please connect your wallet');
      setTxStatus('error');
      onError && onError('Please connect your wallet');
      return;
    }
    
    if (orderType === OrderType.LIMIT && !price) {
      setErrorMessage('Price is required for limit orders');
      setTxStatus('error');
      onError && onError('Price is required for limit orders');
      return;
    }
    
    if (!quantity) {
      setErrorMessage('Quantity is required');
      setTxStatus('error');
      onError && onError('Quantity is required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setTxStatus(null);
      setErrorMessage('');
      
      const orderParams = {
        marketId,
        marketType,
        orderType,
        orderSide,
        price: orderType === OrderType.LIMIT ? price : undefined,
        quantity,
        leverage: marketType === MarketType.DERIVATIVE ? leverage : undefined
      };
      
      const response = await createOrder(orderParams);
      
      if (response.success) {
        setTxHash(response.txHash);
        // We'll set txStatus to 'success' in the useEffect when confirmed
      } else {
        setTxStatus('error');
        setErrorMessage(response.error || 'Transaction failed');
        onError && onError(response.error || 'Transaction failed');
      }
    } catch (error) {
      console.error('Order submission error:', error);
      setTxStatus('error');
      setErrorMessage(error.message || 'Transaction failed');
      onError && onError(error.message || 'Transaction failed');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Reset form
  const resetForm = () => {
    setPrice(defaultPrice);
    setQuantity(defaultQuantity);
    setOrderType(defaultOrderType);
    setOrderSide(defaultOrderSide);
    setLeverage(defaultLeverage);
    setTxHash('');
    setTxStatus(null);
    setErrorMessage('');
  };
  
  return (
    <div className={`${className}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Order Type Selection */}
        <div className="flex space-x-2">
          <button
            type="button"
            className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center ${
              orderType === OrderType.LIMIT
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
            onClick={() => setOrderType(OrderType.LIMIT)}
            disabled={isSubmitting}
            style={orderType === OrderType.LIMIT ? { backgroundColor: theme?.colors?.accent } : {}}
          >
            <ArrowUpDown className="w-4 h-4 mr-2" />
            Limit
          </button>
          <button
            type="button"
            className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center ${
              orderType === OrderType.MARKET
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
            onClick={() => setOrderType(OrderType.MARKET)}
            disabled={isSubmitting}
            style={orderType === OrderType.MARKET ? { backgroundColor: theme?.colors?.accent } : {}}
          >
            <ArrowUpDown className="w-4 h-4 mr-2" />
            Market
          </button>
        </div>
        
        {/* Order Side Selection */}
        <div className="flex space-x-2">
          <button
            type="button"
            className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center ${
              orderSide === OrderSide.BUY
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
            onClick={() => setOrderSide(OrderSide.BUY)}
            disabled={isSubmitting}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Buy
          </button>
          <button
            type="button"
            className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center ${
              orderSide === OrderSide.SELL
                ? 'bg-red-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
            onClick={() => setOrderSide(OrderSide.SELL)}
            disabled={isSubmitting}
          >
            <TrendingDown className="w-4 h-4 mr-2" />
            Sell
          </button>
        </div>
        
        {/* Price Input (for Limit Orders) */}
        {orderType === OrderType.LIMIT && (
          <div>
            <label 
              className="block text-sm font-medium mb-1"
              style={{ color: theme?.colors?.text?.secondary }}
            >
              Price
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
              className="w-full p-2 rounded-lg border"
              style={{ 
                backgroundColor: theme?.colors?.secondary,
                borderColor: theme?.colors?.border,
                color: theme?.colors?.text?.primary
              }}
              disabled={isSubmitting}
              step="any"
              min="0"
              required={orderType === OrderType.LIMIT}
            />
          </div>
        )}
        
        {/* Quantity Input */}
        <div>
          <label 
            className="block text-sm font-medium mb-1"
            style={{ color: theme?.colors?.text?.secondary }}
          >
            Quantity
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter quantity"
            className="w-full p-2 rounded-lg border"
            style={{ 
              backgroundColor: theme?.colors?.secondary,
              borderColor: theme?.colors?.border,
              color: theme?.colors?.text?.primary
            }}
            disabled={isSubmitting}
            step="any"
            min="0"
            required
          />
        </div>
        
        {/* Leverage Input (for Derivative Markets) */}
        {marketType === MarketType.DERIVATIVE && (
          <div>
            <label 
              className="block text-sm font-medium mb-1"
              style={{ color: theme?.colors?.text?.secondary }}
            >
              Leverage
            </label>
            <input
              type="number"
              value={leverage}
              onChange={(e) => setLeverage(Number(e.target.value))}
              placeholder="Enter leverage"
              className="w-full p-2 rounded-lg border"
              style={{ 
                backgroundColor: theme?.colors?.secondary,
                borderColor: theme?.colors?.border,
                color: theme?.colors?.text?.primary
              }}
              disabled={isSubmitting}
              step="1"
              min="1"
              max="20"
              required={marketType === MarketType.DERIVATIVE}
            />
          </div>
        )}
        
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 px-4 rounded-lg flex items-center justify-center"
          style={{ 
            backgroundColor: orderSide === OrderSide.BUY ? '#10B981' : '#EF4444',
            color: 'white',
            opacity: isSubmitting ? 0.7 : 1
          }}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              {orderSide === OrderSide.BUY ? 'Buy' : 'Sell'} {marketType === MarketType.SPOT ? 'Spot' : 'Derivative'}
            </>
          )}
        </button>
        
        {/* Transaction Status */}
        {txHash && (
          <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: theme?.colors?.secondary }}>
            <div className="flex items-center">
              <span className="text-sm font-medium mr-2" style={{ color: theme?.colors?.text?.secondary }}>
                Transaction:
              </span>
              <a
                href={`https://${NETWORK === 'mainnet' ? '' : 'testnet.'}explorer.injective.network/transaction/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm truncate"
                style={{ color: theme?.colors?.accent }}
              >
                {txHash.slice(0, 8)}...{txHash.slice(-8)}
              </a>
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm font-medium mr-2" style={{ color: theme?.colors?.text?.secondary }}>
                Status:
              </span>
              {txStatus === 'success' ? (
                <span className="flex items-center text-green-500">
                  <Check className="w-4 h-4 mr-1" />
                  Success
                </span>
              ) : txStatus === 'error' ? (
                <span className="flex items-center text-red-500">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  Failed
                </span>
              ) : (
                <span className="flex items-center" style={{ color: theme?.colors?.text?.primary }}>
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  Pending
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Error Message */}
        {errorMessage && (
          <div className="mt-4 p-3 rounded-lg bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200">
            <div className="flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              <span>{errorMessage}</span>
            </div>
          </div>
        )}
        
        {/* Reset Button (after success) */}
        {txStatus === 'success' && (
          <button
            type="button"
            className="w-full py-2 px-4 rounded-lg mt-4"
            style={{ 
              backgroundColor: theme?.colors?.secondary,
              color: theme?.colors?.text?.primary,
              border: `1px solid ${theme?.colors?.border}`
            }}
            onClick={resetForm}
          >
            New Order
          </button>
        )}
      </form>
    </div>
  );
};

// Get network from environment
const NETWORK = process.env.NEXT_PUBLIC_INJECTIVE_NETWORK || 'testnet';

export default TransactionSigning; 