'use client';

import { useState, useEffect } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { FrameHeader } from '@/components/FrameHeader';
import { GameLobby } from '@/components/GameLobby';
import { BattleArena } from '@/components/BattleArena';
import { BattlePassTracker } from '@/components/BattlePassTracker';
import { PaymentDashboard } from '@/components/PaymentDashboard';
import { ActionButton } from '@/components/ActionButton';
import { NFT } from '@/lib/types';
import { MOCK_BATTLE_PASS } from '@/lib/constants';
import { Trophy, Home, Star, CreditCard } from 'lucide-react';

type GameState = 'lobby' | 'battle' | 'results' | 'payments';

interface BattleResult {
  winner: 'player' | 'ai';
  xpGained: number;
  playerHealth: number;
  aiHealth: number;
}

export default function CryptoCombatArena() {
  const [gameState, setGameState] = useState<GameState>('lobby');
  const [currentBattle, setCurrentBattle] = useState<{
    nft: NFT;
    mode: 'ai' | 'pvp';
  } | null>(null);
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const { setFrameReady } = useMiniKit();

  useEffect(() => {
    setFrameReady();
  }, [setFrameReady]);

  const handleStartBattle = (nft: NFT, mode: 'ai' | 'pvp') => {
    setCurrentBattle({ nft, mode });
    setGameState('battle');
  };

  const handleBattleEnd = (result: BattleResult) => {
    setBattleResult(result);
    setGameState('results');
  };

  const handleReturnToLobby = () => {
    setGameState('lobby');
    setCurrentBattle(null);
    setBattleResult(null);
  };

  const renderContent = () => {
    switch (gameState) {
      case 'lobby':
        return (
          <div className="space-y-6">
            <GameLobby onStartBattle={handleStartBattle} />
            <BattlePassTracker battlePass={MOCK_BATTLE_PASS} variant="detailed" />
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

      case 'payments':
        return <PaymentDashboard />;

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
        <FrameHeader />
        
        {/* Navigation */}
        <div className="mb-6">
          {gameState !== 'lobby' && gameState !== 'payments' && (
            <ActionButton
              variant="secondary"
              size="sm"
              onClick={handleReturnToLobby}
            >
              <Home className="w-4 h-4" />
              Back to Lobby
            </ActionButton>
          )}
          
          {/* Main Navigation */}
          <div className="flex items-center justify-center space-x-2 mt-4">
            <ActionButton
              variant={gameState === 'lobby' ? 'primary' : 'secondary'}
              size="sm"
              onClick={handleReturnToLobby}
            >
              <Home className="w-4 h-4" />
              Arena
            </ActionButton>
            
            <ActionButton
              variant={gameState === 'payments' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setGameState('payments')}
            >
              <CreditCard className="w-4 h-4" />
              Payments
            </ActionButton>
          </div>
        </div>

        {/* Main Content */}
        <main>
          {renderContent()}
        </main>

        {/* Footer */}
        <footer className="mt-12 text-center text-text-secondary text-sm">
          <p>Crypto Combat Arena - Master your NFT collection in real-time blockchain battles</p>
          <div className="flex items-center justify-center space-x-4 mt-2">
            <span>Powered by Base</span>
            <span>•</span>
            <span>Built with OnchainKit</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
