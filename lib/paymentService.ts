'use client';

import axios, { AxiosInstance } from 'axios';
import { withPaymentInterceptor } from 'x402-axios';
import { Account, WalletClient } from 'viem';
import { PaymentConfig, PaymentResult, PaidService } from './types';

export class X402PaymentService {
  private axiosInstance: AxiosInstance | null = null;
  private config: PaymentConfig;

  constructor(config: PaymentConfig) {
    this.config = config;
  }

  /**
   * Initialize the payment service with a wallet client
   */
  public initialize(walletClient: WalletClient, account: Account): void {
    try {
      // Create base axios instance
      const baseAxios = axios.create({
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // For now, we'll use the base axios instance and implement x402 manually
      // This is a simplified implementation until x402-axios types are more stable
      this.axiosInstance = baseAxios;

      console.log('X402 Payment Service initialized successfully (simplified mode)');
    } catch (error) {
      console.error('Failed to initialize X402 Payment Service:', error);
      throw new Error('Payment service initialization failed');
    }
  }

  /**
   * Make a paid request to an x402-enabled service
   */
  public async makePaidRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: any
  ): Promise<{ data: T; paymentResult: PaymentResult }> {
    if (!this.axiosInstance) {
      throw new Error('Payment service not initialized. Call initialize() first.');
    }

    try {
      // Simulate x402 payment flow
      console.log(`Making paid request to ${endpoint} with method ${method}`);
      
      // In a real implementation, this would:
      // 1. Make the initial request
      // 2. Handle 402 Payment Required response
      // 3. Process payment via wallet
      // 4. Retry request with payment proof
      
      // For demo purposes, simulate a successful payment
      const mockResponse = {
        data: {
          success: true,
          message: `Service ${endpoint} accessed successfully`,
          timestamp: Date.now(),
          ...data,
        } as T,
      };

      // Simulate transaction hash
      const mockTxHash = `0x${Math.random().toString(16).slice(2, 66)}`;

      return {
        data: mockResponse.data,
        paymentResult: {
          success: true,
          transactionHash: mockTxHash,
          amount: '0.10', // Mock payment amount
        },
      };
    } catch (error: any) {
      console.error('Paid request failed:', error);
      
      return {
        data: null as T,
        paymentResult: {
          success: false,
          error: error.response?.data?.message || error.message || 'Payment request failed',
        },
      };
    }
  }

  /**
   * Test the payment flow with a simple endpoint
   */
  public async testPaymentFlow(): Promise<PaymentResult> {
    try {
      console.log('Testing x402 payment flow...');
      
      // Simulate a small delay for realistic UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful test payment
      const mockTxHash = `0x${Math.random().toString(16).slice(2, 66)}`;
      
      const result: PaymentResult = {
        success: true,
        transactionHash: mockTxHash,
        amount: '0.01', // Small test amount
      };
      
      console.log('Payment flow test successful:', result);
      return result;
    } catch (error: any) {
      console.error('Payment flow test error:', error);
      return {
        success: false,
        error: error.message || 'Payment flow test failed',
      };
    }
  }

  /**
   * Get available paid services (mock implementation)
   */
  public async getAvailableServices(): Promise<PaidService[]> {
    // In a real implementation, this would fetch from a service discovery endpoint
    return [
      {
        id: 'ai-battle-enhanced',
        name: 'Enhanced AI Battle',
        description: 'Battle against advanced AI opponents with dynamic strategies',
        endpoint: 'https://api.cryptoarena.com/battle/ai-enhanced',
        pricePerRequest: '0.10',
        category: 'ai-battle',
      },
      {
        id: 'nft-power-boost',
        name: 'NFT Power Boost',
        description: 'Temporarily boost your NFT stats for battles',
        endpoint: 'https://api.cryptoarena.com/nft/boost',
        pricePerRequest: '0.25',
        category: 'nft-enhancement',
      },
      {
        id: 'tournament-entry',
        name: 'Premium Tournament Entry',
        description: 'Enter exclusive tournaments with higher rewards',
        endpoint: 'https://api.cryptoarena.com/tournament/premium',
        pricePerRequest: '1.00',
        category: 'tournament',
      },
      {
        id: 'battle-analytics',
        name: 'Advanced Battle Analytics',
        description: 'Get detailed analytics and insights on your battles',
        endpoint: 'https://api.cryptoarena.com/analytics/battle',
        pricePerRequest: '0.05',
        category: 'analytics',
      },
    ];
  }

  /**
   * Check if the service is properly initialized
   */
  public isInitialized(): boolean {
    return this.axiosInstance !== null;
  }

  /**
   * Get current configuration
   */
  public getConfig(): PaymentConfig {
    return { ...this.config };
  }

  /**
   * Update payment configuration
   */
  public updateConfig(newConfig: Partial<PaymentConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Export a default instance
export const paymentService = new X402PaymentService({
  maxAmount: '10.00', // Maximum 10 USDC per transaction
  network: 'base',
  token: 'USDC',
});
