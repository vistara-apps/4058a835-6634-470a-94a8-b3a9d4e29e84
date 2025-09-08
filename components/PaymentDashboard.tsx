'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useX402Payment } from '@/lib/hooks/useX402Payment';
import { ActionButton } from './ActionButton';
import { PaidService, PaymentResult } from '@/lib/types';
import { 
  CreditCard, 
  Zap, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  DollarSign,
  Shield,
  Sparkles,
  Trophy,
  BarChart3
} from 'lucide-react';

export function PaymentDashboard() {
  const { isConnected, address } = useAccount();
  const {
    isInitialized,
    isInitializing,
    error,
    testPayment,
    makePaidRequest,
    getAvailableServices,
    initializePaymentService,
  } = useX402Payment();

  const [services, setServices] = useState<PaidService[]>([]);
  const [testResult, setTestResult] = useState<PaymentResult | null>(null);
  const [isTestingPayment, setIsTestingPayment] = useState(false);
  const [selectedService, setSelectedService] = useState<PaidService | null>(null);
  const [isUsingService, setIsUsingService] = useState(false);

  // Load available services
  useEffect(() => {
    const loadServices = async () => {
      const availableServices = await getAvailableServices();
      setServices(availableServices);
    };
    loadServices();
  }, [getAvailableServices]);

  const handleTestPayment = async () => {
    setIsTestingPayment(true);
    setTestResult(null);
    
    try {
      const result = await testPayment();
      setTestResult(result);
    } catch (err: any) {
      setTestResult({
        success: false,
        error: err.message || 'Test payment failed',
      });
    } finally {
      setIsTestingPayment(false);
    }
  };

  const handleUseService = async (service: PaidService) => {
    setSelectedService(service);
    setIsUsingService(true);
    
    try {
      // Mock data for the service request
      const requestData = {
        userId: address,
        serviceId: service.id,
        timestamp: Date.now(),
      };

      const result = await makePaidRequest(service.endpoint, 'POST', requestData);
      
      if (result.paymentResult.success) {
        alert(`Successfully used ${service.name}! Transaction: ${result.paymentResult.transactionHash}`);
      } else {
        alert(`Failed to use ${service.name}: ${result.paymentResult.error}`);
      }
    } catch (err: any) {
      alert(`Error using service: ${err.message}`);
    } finally {
      setIsUsingService(false);
      setSelectedService(null);
    }
  };

  const getServiceIcon = (category: string) => {
    switch (category) {
      case 'ai-battle':
        return <Zap className="w-5 h-5" />;
      case 'nft-enhancement':
        return <Sparkles className="w-5 h-5" />;
      case 'tournament':
        return <Trophy className="w-5 h-5" />;
      case 'analytics':
        return <BarChart3 className="w-5 h-5" />;
      default:
        return <DollarSign className="w-5 h-5" />;
    }
  };

  if (!isConnected) {
    return (
      <div className="glass-card p-6 text-center">
        <Shield className="w-12 h-12 text-accent mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Connect Your Wallet</h3>
        <p className="text-text-secondary">
          Connect your wallet to access premium x402 payment features
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Payment Status */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <CreditCard className="w-6 h-6 text-accent" />
            <span>x402 Payment System</span>
          </h2>
          
          <div className="flex items-center space-x-2">
            {isInitializing ? (
              <Loader2 className="w-5 h-5 animate-spin text-accent" />
            ) : isInitialized ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400" />
            )}
            <span className={`text-sm font-medium ${
              isInitialized ? 'text-green-400' : 'text-red-400'
            }`}>
              {isInitializing ? 'Initializing...' : isInitialized ? 'Ready' : 'Not Ready'}
            </span>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-400 font-medium">Error:</span>
              <span className="text-text-secondary">{error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-surface rounded-lg p-4">
            <div className="text-sm text-text-secondary mb-1">Wallet</div>
            <div className="font-mono text-sm">
              {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}
            </div>
          </div>
          <div className="bg-surface rounded-lg p-4">
            <div className="text-sm text-text-secondary mb-1">Network</div>
            <div className="font-semibold text-accent">Base</div>
          </div>
          <div className="bg-surface rounded-lg p-4">
            <div className="text-sm text-text-secondary mb-1">Token</div>
            <div className="font-semibold text-green-400">USDC</div>
          </div>
        </div>

        {!isInitialized && !isInitializing && (
          <ActionButton
            variant="primary"
            size="lg"
            onClick={initializePaymentService}
            className="w-full"
          >
            <Shield className="w-5 h-5" />
            Initialize Payment System
          </ActionButton>
        )}
      </div>

      {/* Test Payment */}
      {isInitialized && (
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold mb-4">Test Payment Flow</h3>
          <p className="text-text-secondary mb-4">
            Test the x402 payment system with a small transaction to verify everything is working correctly.
          </p>
          
          <ActionButton
            variant="secondary"
            size="lg"
            onClick={handleTestPayment}
            disabled={isTestingPayment}
            className="mb-4"
          >
            {isTestingPayment ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Zap className="w-5 h-5" />
            )}
            {isTestingPayment ? 'Testing Payment...' : 'Test Payment Flow'}
          </ActionButton>

          {testResult && (
            <div className={`rounded-lg p-4 ${
              testResult.success 
                ? 'bg-green-500/10 border border-green-500/20' 
                : 'bg-red-500/10 border border-red-500/20'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                {testResult.success ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
                <span className={`font-medium ${
                  testResult.success ? 'text-green-400' : 'text-red-400'
                }`}>
                  {testResult.success ? 'Payment Test Successful!' : 'Payment Test Failed'}
                </span>
              </div>
              
              {testResult.transactionHash && (
                <div className="text-sm text-text-secondary">
                  Transaction: <span className="font-mono">{testResult.transactionHash}</span>
                </div>
              )}
              
              {testResult.amount && (
                <div className="text-sm text-text-secondary">
                  Amount: <span className="font-semibold text-green-400">{testResult.amount} USDC</span>
                </div>
              )}
              
              {testResult.error && (
                <div className="text-sm text-red-400">
                  Error: {testResult.error}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Available Services */}
      {isInitialized && services.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold mb-4">Premium Services</h3>
          <p className="text-text-secondary mb-6">
            Access premium features and services using x402 payments with USDC on Base.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service) => (
              <div key={service.id} className="bg-surface rounded-lg p-4 border border-border">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getServiceIcon(service.category)}
                    <h4 className="font-semibold">{service.name}</h4>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-text-secondary">Price</div>
                    <div className="font-bold text-green-400">{service.pricePerRequest} USDC</div>
                  </div>
                </div>
                
                <p className="text-sm text-text-secondary mb-4">
                  {service.description}
                </p>
                
                <ActionButton
                  variant="primary"
                  size="sm"
                  onClick={() => handleUseService(service)}
                  disabled={isUsingService && selectedService?.id === service.id}
                  className="w-full"
                >
                  {isUsingService && selectedService?.id === service.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <DollarSign className="w-4 h-4" />
                  )}
                  {isUsingService && selectedService?.id === service.id 
                    ? 'Processing...' 
                    : `Use Service (${service.pricePerRequest} USDC)`
                  }
                </ActionButton>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
