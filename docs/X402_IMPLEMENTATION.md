# x402 Payment Flow Implementation

This document describes the implementation of the x402 payment protocol in the Crypto Combat Arena application.

## Overview

The x402 protocol enables seamless cryptocurrency payments over HTTP, allowing users to pay for premium services using USDC on the Base network. This implementation integrates with wagmi for wallet connectivity and provides a complete payment flow for the gaming application.

## Features Implemented

### ✅ Core x402 Integration
- **x402-axios Integration**: Automatic payment handling for HTTP requests
- **wagmi useWalletClient**: Wallet connectivity and transaction signing
- **USDC on Base**: Native support for USDC payments on Base network
- **Transaction Confirmations**: Real-time transaction status and confirmations
- **Error Handling**: Comprehensive error handling for payment failures

### ✅ Payment Services
- **Enhanced AI Battle**: Premium AI opponents with advanced strategies ($0.10 USDC)
- **NFT Power Boost**: Temporary stat boosts for NFTs ($0.25 USDC)
- **Premium Tournament Entry**: Access to exclusive tournaments ($1.00 USDC)
- **Advanced Battle Analytics**: Detailed battle insights and analytics ($0.05 USDC)

### ✅ User Interface
- **Payment Dashboard**: Complete payment management interface
- **Service Discovery**: Browse and purchase available premium services
- **Payment Testing**: Built-in payment flow testing functionality
- **Transaction History**: View payment results and transaction hashes

## Technical Architecture

### Payment Service (`lib/paymentService.ts`)
```typescript
export class X402PaymentService {
  // Initializes x402-axios with wallet client
  public initialize(walletClient: WalletClient, account: Account): void
  
  // Makes paid requests to x402-enabled services
  public async makePaidRequest<T>(endpoint: string, method?: string, data?: any)
  
  // Tests the payment flow
  public async testPaymentFlow(): Promise<PaymentResult>
  
  // Discovers available paid services
  public async getAvailableServices(): Promise<PaidService[]>
}
```

### React Hook (`lib/hooks/useX402Payment.ts`)
```typescript
export function useX402Payment(): UseX402PaymentReturn {
  // Auto-initializes when wallet is connected
  // Provides payment functions and state management
  // Handles errors and loading states
}
```

### Payment Dashboard Component (`components/PaymentDashboard.tsx`)
- Wallet connection status
- Payment system initialization
- Service browsing and purchasing
- Payment testing interface
- Transaction result display

## Setup Instructions

### 1. Install Dependencies
```bash
npm install x402-axios @coinbase/cdp-sdk dotenv
```

### 2. Environment Configuration
Copy `.env.example` to `.env.local` and configure:
```env
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key
CDP_API_KEY_ID=your_cdp_api_key_id
CDP_API_KEY_SECRET=your_cdp_api_key_secret
CDP_WALLET_SECRET=your_cdp_wallet_secret
```

### 3. Wallet Setup
- Connect a wallet with USDC on Base network
- Ensure sufficient USDC balance for payments
- The system automatically initializes when wallet is connected

## Usage Flow

### 1. Connect Wallet
- User connects their wallet via the header
- System automatically detects Base network
- Payment service initializes automatically

### 2. Access Payment Dashboard
- Navigate to "Payments" tab in the main navigation
- View payment system status and configuration
- See available premium services

### 3. Test Payment Flow
- Use the "Test Payment Flow" button to verify setup
- System makes a small test payment to verify functionality
- View transaction results and confirmation

### 4. Purchase Services
- Browse available premium services
- Click "Use Service" to make a payment
- System automatically handles payment and service access
- View transaction hash and payment confirmation

## Error Handling

The implementation includes comprehensive error handling for:

- **Wallet Connection Issues**: Clear messaging when wallet is not connected
- **Insufficient Funds**: Proper error messages for low USDC balance
- **Network Issues**: Handling of network connectivity problems
- **Payment Failures**: Detailed error reporting for failed transactions
- **Service Unavailability**: Graceful handling of service downtime

## Security Features

- **Maximum Payment Limits**: Configurable maximum payment amounts
- **Transaction Verification**: All payments are verified on-chain
- **Secure Signing**: Uses wagmi's secure signing methods
- **Error Boundaries**: Prevents payment errors from crashing the app

## Testing

### Manual Testing Checklist
- [ ] Wallet connection and disconnection
- [ ] Payment system initialization
- [ ] Test payment flow execution
- [ ] Service discovery and listing
- [ ] Individual service payments
- [ ] Error handling scenarios
- [ ] Transaction confirmation display

### Test Scenarios
1. **Happy Path**: Connect wallet → Initialize payments → Test payment → Purchase service
2. **Error Cases**: No wallet → Insufficient funds → Network issues → Service failures
3. **Edge Cases**: Wallet disconnection during payment → Multiple rapid payments

## Integration Points

### With Existing Game Features
- **Battle System**: Premium AI battles with enhanced difficulty
- **NFT System**: Temporary stat boosts for owned NFTs
- **Tournament System**: Access to exclusive high-reward tournaments
- **Analytics**: Advanced battle performance insights

### With Base Network
- **USDC Payments**: Native USDC token support
- **Fast Transactions**: ~2 second transaction confirmations
- **Low Fees**: Minimal gas fees on Base network
- **Wallet Compatibility**: Works with all Base-compatible wallets

## Future Enhancements

### Planned Features
- **Subscription Services**: Monthly/weekly premium subscriptions
- **Bulk Payments**: Discounted rates for multiple service purchases
- **Payment History**: Complete transaction history and receipts
- **Service Ratings**: User ratings and reviews for premium services
- **Dynamic Pricing**: Market-based pricing for premium services

### Technical Improvements
- **Caching**: Service discovery result caching
- **Retry Logic**: Automatic retry for failed payments
- **Batch Payments**: Multiple service purchases in single transaction
- **Payment Scheduling**: Scheduled recurring payments

## Troubleshooting

### Common Issues

**Payment Service Not Initializing**
- Ensure wallet is connected to Base network
- Check USDC balance in wallet
- Verify OnchainKit API key is configured

**Test Payment Failing**
- Confirm sufficient USDC balance
- Check network connectivity
- Verify Base network is selected in wallet

**Service Payments Not Working**
- Ensure payment service is initialized
- Check service endpoint availability
- Verify payment amount limits

### Debug Information
The implementation includes extensive console logging for debugging:
- Payment service initialization status
- Transaction hashes and confirmations
- Error messages with detailed context
- Service discovery results

## Support

For issues with the x402 implementation:
1. Check the browser console for error messages
2. Verify wallet connection and network selection
3. Ensure sufficient USDC balance
4. Review the troubleshooting section above

For x402 protocol questions, refer to:
- [x402 Documentation](https://docs.cdp.coinbase.com/x402/)
- [x402 GitHub Repository](https://github.com/coinbase/x402)
- [Coinbase Developer Discord](https://discord.gg/cdp)
