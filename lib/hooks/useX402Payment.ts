'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWalletClient, useAccount } from 'wagmi';
import { paymentService } from '../paymentService';
import { PaymentResult, PaidService } from '../types';

export interface UseX402PaymentReturn {
  isInitialized: boolean;
  isInitializing: boolean;
  error: string | null;
  testPayment: () => Promise<PaymentResult>;
  makePaidRequest: <T>(endpoint: string, method?: 'GET' | 'POST' | 'PUT' | 'DELETE', data?: any) => Promise<{ data: T; paymentResult: PaymentResult }>;
  getAvailableServices: () => Promise<PaidService[]>;
  initializePaymentService: () => Promise<void>;
}

/**
 * Custom hook for x402 payment integration with wagmi
 */
export function useX402Payment(): UseX402PaymentReturn {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { data: walletClient } = useWalletClient();
  const { address, isConnected } = useAccount();

  /**
   * Initialize the payment service when wallet is connected
   */
  const initializePaymentService = useCallback(async () => {
    if (!walletClient || !address || !isConnected) {
      setError('Wallet not connected');
      return;
    }

    if (isInitializing || isInitialized) {
      return;
    }

    setIsInitializing(true);
    setError(null);

    try {
      // Create account object for x402
      const account = {
        address,
        signMessage: async ({ message }: { message: string }) => {
          return await walletClient.signMessage({ message, account: address });
        },
        signTransaction: async (transaction: any) => {
          return await walletClient.signTransaction(transaction);
        },
        signTypedData: async (typedData: any) => {
          return await walletClient.signTypedData(typedData);
        },
      };

      // Initialize the payment service
      paymentService.initialize(walletClient, account as any);
      setIsInitialized(true);
      console.log('X402 payment service initialized successfully');
    } catch (err: any) {
      console.error('Failed to initialize payment service:', err);
      setError(err.message || 'Failed to initialize payment service');
    } finally {
      setIsInitializing(false);
    }
  }, [walletClient, address, isConnected, isInitializing, isInitialized]);

  /**
   * Auto-initialize when wallet is connected
   */
  useEffect(() => {
    if (isConnected && walletClient && address && !isInitialized && !isInitializing) {
      initializePaymentService();
    }
  }, [isConnected, walletClient, address, isInitialized, isInitializing, initializePaymentService]);

  /**
   * Reset state when wallet is disconnected
   */
  useEffect(() => {
    if (!isConnected) {
      setIsInitialized(false);
      setError(null);
    }
  }, [isConnected]);

  /**
   * Test the payment flow
   */
  const testPayment = useCallback(async (): Promise<PaymentResult> => {
    if (!isInitialized) {
      return {
        success: false,
        error: 'Payment service not initialized',
      };
    }

    try {
      return await paymentService.testPaymentFlow();
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Payment test failed',
      };
    }
  }, [isInitialized]);

  /**
   * Make a paid request
   */
  const makePaidRequest = useCallback(async <T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: any
  ): Promise<{ data: T; paymentResult: PaymentResult }> => {
    if (!isInitialized) {
      return {
        data: null as T,
        paymentResult: {
          success: false,
          error: 'Payment service not initialized',
        },
      };
    }

    try {
      return await paymentService.makePaidRequest<T>(endpoint, method, data);
    } catch (err: any) {
      return {
        data: null as T,
        paymentResult: {
          success: false,
          error: err.message || 'Paid request failed',
        },
      };
    }
  }, [isInitialized]);

  /**
   * Get available paid services
   */
  const getAvailableServices = useCallback(async (): Promise<PaidService[]> => {
    try {
      return await paymentService.getAvailableServices();
    } catch (err: any) {
      console.error('Failed to get available services:', err);
      return [];
    }
  }, []);

  return {
    isInitialized,
    isInitializing,
    error,
    testPayment,
    makePaidRequest,
    getAvailableServices,
    initializePaymentService,
  };
}
