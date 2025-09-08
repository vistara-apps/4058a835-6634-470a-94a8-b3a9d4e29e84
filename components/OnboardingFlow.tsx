'use client';

import { useState, useEffect } from 'react';
import { useMiniKitAPI } from '@/lib/api';
import { ActionButton } from './ActionButton';
import { NFTAvatar } from './NFTAvatar';
import { MOCK_NFTS } from '@/lib/constants';
import { Wallet, Users, Gamepad2, Trophy, ArrowRight, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingFlowProps {
  onComplete: (userData: {
    walletAddress: string;
    farcasterId?: string;
    selectedNFT?: any;
  }) => void;
}

type OnboardingStep = 'welcome' | 'wallet' | 'farcaster' | 'tutorial' | 'complete';

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [farcasterId, setFarcasterId] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const { connectWallet } = useMiniKitAPI();

  const handleWalletConnect = async () => {
    setIsConnecting(true);
    try {
      const result = await connectWallet();
      if (result.success && result.data.isConnected) {
        setWalletAddress(result.data.address);
        setCurrentStep('farcaster');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleFarcasterConnect = () => {
    // In a real implementation, this would integrate with Farcaster
    setFarcasterId('user123');
    setCurrentStep('tutorial');
  };

  const handleSkipFarcaster = () => {
    setCurrentStep('tutorial');
  };

  const handleTutorialComplete = () => {
    setCurrentStep('complete');
    setTimeout(() => {
      onComplete({
        walletAddress,
        farcasterId: farcasterId || undefined,
        selectedNFT: MOCK_NFTS[0],
      });
    }, 2000);
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  const renderWelcomeStep = () => (
    <motion.div
      key="welcome"
      variants={stepVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="text-center space-y-6"
    >
      <div className="relative">
        <div className="w-32 h-32 mx-auto bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink rounded-full flex items-center justify-center animate-pulse-neon">
          <Gamepad2 className="w-16 h-16 text-white" />
        </div>
      </div>

      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent mb-4">
          Welcome to Crypto Combat Arena
        </h1>
        <p className="text-text-secondary text-lg max-w-md mx-auto">
          Master your NFT collection in real-time blockchain battles. Fight AI opponents, climb the ranks, and earn exclusive rewards.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
        <div className="glass-card p-4 text-center">
          <Wallet className="w-8 h-8 text-neon-blue mx-auto mb-2" />
          <h3 className="font-semibold text-text-primary">Connect Wallet</h3>
          <p className="text-sm text-text-secondary">Link your Base wallet to get started</p>
        </div>
        <div className="glass-card p-4 text-center">
          <Users className="w-8 h-8 text-neon-purple mx-auto mb-2" />
          <h3 className="font-semibold text-text-primary">Join Community</h3>
          <p className="text-sm text-text-secondary">Connect with Farcaster for social features</p>
        </div>
        <div className="glass-card p-4 text-center">
          <Trophy className="w-8 h-8 text-neon-pink mx-auto mb-2" />
          <h3 className="font-semibold text-text-primary">Battle & Earn</h3>
          <p className="text-sm text-text-secondary">Fight with your NFTs and earn rewards</p>
        </div>
      </div>

      <ActionButton
        variant="primary"
        size="lg"
        onClick={() => setCurrentStep('wallet')}
        className="animate-glow"
      >
        Get Started
        <ArrowRight className="w-5 h-5 ml-2" />
      </ActionButton>
    </motion.div>
  );

  const renderWalletStep = () => (
    <motion.div
      key="wallet"
      variants={stepVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="text-center space-y-6"
    >
      <div className="w-24 h-24 mx-auto bg-gradient-to-r from-neon-blue to-primary rounded-full flex items-center justify-center">
        <Wallet className="w-12 h-12 text-white" />
      </div>

      <div>
        <h2 className="text-3xl font-bold text-text-primary mb-4">Connect Your Base Wallet</h2>
        <p className="text-text-secondary max-w-md mx-auto">
          Connect your Base wallet to access your NFTs and start battling in the arena. Your wallet is required to play and earn rewards.
        </p>
      </div>

      <div className="glass-card p-6 max-w-md mx-auto">
        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-sm text-text-secondary">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>Secure wallet connection via Base Minikit</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-text-secondary">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>Access your NFT collection</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-text-secondary">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>Earn and track battle rewards</span>
          </div>
        </div>
      </div>

      <ActionButton
        variant="primary"
        size="lg"
        loading={isConnecting}
        onClick={handleWalletConnect}
      >
        <Wallet className="w-5 h-5 mr-2" />
        {isConnecting ? 'Connecting...' : 'Connect Base Wallet'}
      </ActionButton>
    </motion.div>
  );

  const renderFarcasterStep = () => (
    <motion.div
      key="farcaster"
      variants={stepVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="text-center space-y-6"
    >
      <div className="w-24 h-24 mx-auto bg-gradient-to-r from-neon-purple to-neon-pink rounded-full flex items-center justify-center">
        <Users className="w-12 h-12 text-white" />
      </div>

      <div>
        <h2 className="text-3xl font-bold text-text-primary mb-4">Connect to Farcaster</h2>
        <p className="text-text-secondary max-w-md mx-auto">
          Link your Farcaster profile to share battle results, join tournaments, and connect with other players in the community.
        </p>
      </div>

      <div className="glass-card p-6 max-w-md mx-auto">
        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-sm text-text-secondary">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>Share battle victories on your feed</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-text-secondary">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>Join community tournaments</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-text-secondary">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>Challenge friends to battles</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <ActionButton
          variant="primary"
          onClick={handleFarcasterConnect}
        >
          <Users className="w-4 h-4 mr-2" />
          Connect Farcaster
        </ActionButton>
        <ActionButton
          variant="secondary"
          onClick={handleSkipFarcaster}
        >
          Skip for Now
        </ActionButton>
      </div>
    </motion.div>
  );

  const renderTutorialStep = () => (
    <motion.div
      key="tutorial"
      variants={stepVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-text-primary mb-4">How to Battle</h2>
        <p className="text-text-secondary">Learn the basics of combat in Crypto Combat Arena</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* NFT Selection */}
        <div className="glass-card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-neon-blue rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
            <h3 className="text-lg font-semibold text-text-primary">Choose Your Fighter</h3>
          </div>
          <p className="text-text-secondary mb-4">Select an NFT from your collection to use as your battle character. Each NFT has unique stats and abilities.</p>
          <div className="flex justify-center">
            <NFTAvatar nft={MOCK_NFTS[0]} variant="large" />
          </div>
        </div>

        {/* Battle Mechanics */}
        <div className="glass-card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-neon-purple rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
            <h3 className="text-lg font-semibold text-text-primary">Battle Actions</h3>
          </div>
          <p className="text-text-secondary mb-4">Choose from Attack, Defend, or Special abilities each turn. Manage your energy wisely!</p>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <span className="text-text-secondary">Attack: Deal damage (20 energy)</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span className="text-text-secondary">Defend: Reduce incoming damage (10 energy)</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span className="text-text-secondary">Special: Unique NFT abilities (varies)</span>
            </div>
          </div>
        </div>

        {/* Battle Pass */}
        <div className="glass-card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-neon-pink rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
            <h3 className="text-lg font-semibold text-text-primary">Earn Rewards</h3>
          </div>
          <p className="text-text-secondary mb-4">Win battles to gain XP and progress through the Battle Pass. Unlock exclusive rewards and cosmetics!</p>
          <div className="bg-surface rounded-lg p-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-text-secondary">Battle Pass Level 15</span>
              <span className="text-accent">2500/3000 XP</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-accent to-yellow-500 h-2 rounded-full" style={{ width: '83%' }}></div>
            </div>
          </div>
        </div>

        {/* Game Modes */}
        <div className="glass-card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
            <h3 className="text-lg font-semibold text-text-primary">Game Modes</h3>
          </div>
          <p className="text-text-secondary mb-4">Practice against AI or challenge real players in ranked matches.</p>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 bg-neon-blue rounded-full"></div>
              <span className="text-text-secondary">AI Battle: Practice and earn XP</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 bg-neon-pink rounded-full"></div>
              <span className="text-text-secondary">PvP: Ranked matches with other players</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <ActionButton
          variant="primary"
          size="lg"
          onClick={handleTutorialComplete}
        >
          Enter the Arena
          <ArrowRight className="w-5 h-5 ml-2" />
        </ActionButton>
      </div>
    </motion.div>
  );

  const renderCompleteStep = () => (
    <motion.div
      key="complete"
      variants={stepVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="text-center space-y-6"
    >
      <div className="relative">
        <div className="w-32 h-32 mx-auto bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center animate-float">
          <CheckCircle className="w-16 h-16 text-white" />
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-green-400 mb-4">Welcome to the Arena!</h2>
        <p className="text-text-secondary max-w-md mx-auto">
          You're all set up and ready to battle. Your journey in Crypto Combat Arena begins now!
        </p>
      </div>

      <div className="glass-card p-6 max-w-md mx-auto">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">Wallet Connected</span>
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          {farcasterId && (
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Farcaster Linked</span>
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">Tutorial Complete</span>
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
        </div>
      </div>

      <div className="text-text-secondary">
        Redirecting to the arena...
      </div>
    </motion.div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'welcome':
        return renderWelcomeStep();
      case 'wallet':
        return renderWalletStep();
      case 'farcaster':
        return renderFarcasterStep();
      case 'tutorial':
        return renderTutorialStep();
      case 'complete':
        return renderCompleteStep();
      default:
        return renderWelcomeStep();
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress Indicator */}
        {currentStep !== 'welcome' && currentStep !== 'complete' && (
          <div className="mb-8">
            <div className="flex justify-center space-x-2">
              {['wallet', 'farcaster', 'tutorial'].map((step, index) => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                    ['wallet', 'farcaster', 'tutorial'].indexOf(currentStep) >= index
                      ? 'bg-neon-blue'
                      : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {renderCurrentStep()}
        </AnimatePresence>
      </div>
    </div>
  );
}
