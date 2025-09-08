'use client';

import { useState, useEffect } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { FrameHeader } from '@/components/FrameHeader';
import { GameLobby } from '@/components/GameLobby';
import { BattleArena } from '@/components/BattleArena';
import { BattlePassTracker } from '@/components/BattlePassTracker';
import { OnboardingFlow } from '@/components/OnboardingFlow';
import { Leaderboard } from '@/components/Leaderboard';
import { ActionButton } from '@/components/ActionButton';
import { NFT, User } from '@/lib/types';
import { MOCK_BATTLE_PASS, MOCK_USER } from '@/lib/constants';
import { Trophy, Home, Star, Users, BarChart3 } from 'lucide-react';
import { useMiniKitAPI, useGameAPI } from '@/lib/api';
import toast, { Toaster } from 'react-hot-toast';

type GameState = 'onboarding' | 'lobby' | 'battle' | 'results';
type AppTab = 'lobby' | 'battlepass' | 'leaderboard';

interface BattleResult {
  winner: 'player' | 'ai';
  xpGained: number;
  playerHealth: number;
  aiHealth: number;
}

export default function CryptoCombatArena() {
  const [gameState, setGameState] = useState<GameState>('onboarding');
  const [currentBattle, setCurrentBattle] = useState<{
    nft: NFT;
    mode: 'ai' | 'pvp';
  } | null>(null);
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const [activeTab, setActiveTab] = useState<AppTab>('lobby');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { setFrameReady } = useMiniKit();
  const { connectWallet } = useMiniKitAPI();
  const { createUser, getUser } = useGameAPI();

  useEffect(() => {
    setFrameReady();
  }, [setFrameReady]);

  const handleOnboardingComplete = async (userData: {
    walletAddress: string;
    farcasterId?: string;
    selectedNFT?: any;
  }) => {
    setIsLoading(true);
    try {
      // Create or get user
      const userResult = await createUser(userData.walletAddress, userData.farcasterId);
      if (userResult.success) {
        setCurrentUser(userResult.data);
        setGameState('lobby');
        toast.success('Welcome to Crypto Combat Arena!');
      } else {
        // Try to get existing user
        const existingUser = await getUser(userData.walletAddress);
        if (existingUser.success) {
          setCurrentUser(existingUser.data);
          setGameState('lobby');
          toast.success('Welcome back to the Arena!');
        } else {
          toast.error('Failed to set up your account');
        }
      }
    } catch (error) {
      console.error('Onboarding error:', error);
      toast.error('Something went wrong during setup');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartBattle = (nft: NFT, mode: 'ai' | 'pvp') => {
    setCurrentBattle({ nft, mode });
    setGameState('battle');
  };

  const handleBattleEnd = (result: BattleResult) => {
    setBattleResult(result);
    setGameState('results');
    
    // Update user stats
    if (currentUser) {
      const updatedUser = { ...currentUser };
      if (result.winner === 'player') {
        updatedUser.wins += 1;
        updatedUser.xp += result.xpGained;
        toast.success(`Victory! +${result.xpGained} XP`);
      } else {
        updatedUser.losses += 1;
        toast.error('Defeat! Better luck next time.');
      }
      setCurrentUser(updatedUser);
    }
  };

  const handleReturnToLobby = () => {
    setGameState('lobby');
    setCurrentBattle(null);
    setBattleResult(null);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'lobby':
        return <GameLobby onStartBattle={handleStartBattle} />;
      case 'battlepass':
        return <BattlePassTracker battlePass={MOCK_BATTLE_PASS} variant="detailed" />;
      case 'leaderboard':
        return <Leaderboard currentUser={currentUser || undefined} />;
      default:
        return <GameLobby onStartBattle={handleStartBattle} />;
    }
  };

  const renderContent = () => {
    switch (gameState) {
      case 'onboarding':
        return <OnboardingFlow onComplete={handleOnboardingComplete} />;

      case 'lobby':
        return (
          <div className="space-y-6">
            {/* Navigation Tabs */}
            <div className="flex justify-center">
              <div className="glass-card p-1 inline-flex rounded-lg">
                <button
                  onClick={() => setActiveTab('lobby')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === 'lobby'
                      ? 'bg-primary text-white shadow-lg'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>Arena</span>
                </button>
                <button
                  onClick={() => setActiveTab('battlepass')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === 'battlepass'
                      ? 'bg-primary text-white shadow-lg'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                  }`}
                >
                  <Star className="w-4 h-4" />
                  <span>Battle Pass</span>
                </button>
                <button
                  onClick={() => setActiveTab('leaderboard')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === 'leaderboard'
                      ? 'bg-primary text-white shadow-lg'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                  }`}
                >
                  <Trophy className="w-4 h-4" />
                  <span>Leaderboard</span>
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {renderTabContent()}
          </div>
        );

      case 'battle':
        return currentBattle ? (
          <BattleArena
            playerNFT={currentBattle.nft}
            mode={currentBattle.mode}
            onBattleEnd={handleBattleEnd}
          />
        ) : null;

      case 'results':
        return battleResult ? (
          <div className="space-y-6">
            {/* Battle Results */}
            <div className="glass-card p-8 text-center">
              <div className={`text-6xl mb-4 ${
                battleResult.winner === 'player' ? 'text-green-400' : 'text-red-400'
              }`}>
                {battleResult.winner === 'player' ? '🏆' : '💀'}
              </div>
              
              <h2 className={`text-3xl font-bold mb-2 ${
                battleResult.winner === 'player' ? 'text-green-400' : 'text-red-400'
              }`}>
                {battleResult.winner === 'player' ? 'VICTORY!' : 'DEFEAT!'}
              </h2>
              
              <p className="text-text-secondary mb-6">
                {battleResult.winner === 'player' 
                  ? 'Congratulations! You emerged victorious from the arena!'
                  : 'Better luck next time! Learn from this battle and come back stronger!'
                }
              </p>

              {/* Battle Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-surface rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-400">
                    {battleResult.playerHealth}
                  </div>
                  <div className="text-sm text-text-secondary">Your Health</div>
                </div>
                <div className="bg-surface rounded-lg p-4">
                  <div className="text-2xl font-bold text-red-400">
                    {battleResult.aiHealth}
                  </div>
                  <div className="text-sm text-text-secondary">Enemy Health</div>
                </div>
              </div>

              {/* XP Gained */}
              <div className="bg-gradient-to-r from-accent to-yellow-500 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center space-x-2">
                  <Star className="w-6 h-6 text-white" />
                  <span className="text-white font-bold text-lg">
                    +{battleResult.xpGained} XP Gained!
                  </span>
                </div>
              </div>

              <ActionButton
                variant="primary"
                size="lg"
                onClick={handleReturnToLobby}
              >
                <Home className="w-5 h-5" />
                Return to Arena
              </ActionButton>
            </div>

            {/* Updated Battle Pass */}
            <BattlePassTracker battlePass={MOCK_BATTLE_PASS} variant="simple" />
          </div>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <div className="container mx-auto px-4 py-4 max-w-4xl">
        {gameState !== 'onboarding' && <FrameHeader />}
        
        {/* Navigation */}
        {gameState !== 'lobby' && gameState !== 'onboarding' && (
          <div className="mb-6">
            <ActionButton
              variant="secondary"
              size="sm"
              onClick={handleReturnToLobby}
            >
              <Home className="w-4 h-4" />
              Back to Lobby
            </ActionButton>
          </div>
        )}

        {/* Main Content */}
        <main>
          {renderContent()}
        </main>

        {/* Footer */}
        {gameState !== 'onboarding' && (
          <footer className="mt-12 text-center text-text-secondary text-sm">
            <p>Crypto Combat Arena - Master your NFT collection in real-time blockchain battles</p>
            <div className="flex items-center justify-center space-x-4 mt-2">
              <span>Powered by Base</span>
              <span>•</span>
              <span>Built with OnchainKit</span>
            </div>
          </footer>
        )}
      </div>

      {/* Toast Notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'hsl(220 20% 15%)',
            color: 'hsl(0 0% 95%)',
            border: '1px solid hsl(220 20% 25%)',
          },
        }}
      />
    </div>
  );
}
