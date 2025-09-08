'use client';

import { useState, useEffect } from 'react';
import { NFT, BattleState, BattleCharacter } from '@/lib/types';
import { MOCK_NFTS, GAME_CONFIG } from '@/lib/constants';
import { CompetitiveCard } from './CompetitiveCard';
import { ActionButton } from './ActionButton';
import { simulateAIBattle } from '@/lib/utils';
import { Sword, Shield, Zap, RotateCcw } from 'lucide-react';

interface BattleArenaProps {
  playerNFT: NFT;
  mode: 'ai' | 'pvp';
  onBattleEnd: (result: any) => void;
}

export function BattleArena({ playerNFT, mode, onBattleEnd }: BattleArenaProps) {
  const [battleState, setBattleState] = useState<BattleState | null>(null);
  const [timer, setTimer] = useState<number>(GAME_CONFIG.BATTLE_TIMER);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  // Initialize battle
  useEffect(() => {
    const aiNFT = MOCK_NFTS[Math.floor(Math.random() * MOCK_NFTS.length)];
    
    const initialState: BattleState = {
      player1: {
        nft: playerNFT,
        currentHealth: playerNFT.stats.health,
        currentEnergy: GAME_CONFIG.MAX_ENERGY,
        statusEffects: [],
        cooldowns: {},
      },
      player2: {
        nft: aiNFT,
        currentHealth: aiNFT.stats.health,
        currentEnergy: GAME_CONFIG.MAX_ENERGY,
        statusEffects: [],
        cooldowns: {},
      },
      currentRound: 1,
      phase: 'action',
      timer: GAME_CONFIG.BATTLE_TIMER,
    };

    setBattleState(initialState);
  }, [playerNFT]);

  // Timer countdown
  useEffect(() => {
    if (!battleState || battleState.phase !== 'action') return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          // Auto-select basic attack if no action chosen
          if (!selectedAction) {
            handleAction('attack');
          }
          return GAME_CONFIG.BATTLE_TIMER;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [battleState, selectedAction]);

  const handleAction = (action: string) => {
    if (!battleState) return;

    setSelectedAction(action);
    
    // Simulate battle round
    setTimeout(() => {
      const result = simulateAIBattle(battleState.player1.nft, battleState.player2.nft);
      
      // Update battle state based on action
      const newState = { ...battleState };
      
      if (action === 'attack') {
        newState.player2.currentHealth -= 100;
        newState.player1.currentEnergy -= 20;
      } else if (action === 'defend') {
        newState.player1.currentEnergy -= 10;
      }

      // AI action
      newState.player1.currentHealth -= 80;
      newState.player2.currentEnergy -= 15;

      // Check for battle end
      if (newState.player1.currentHealth <= 0 || newState.player2.currentHealth <= 0) {
        const winner = newState.player1.currentHealth > 0 ? 'player' : 'ai';
        onBattleEnd({
          winner,
          xpGained: winner === 'player' ? 100 : 25,
          playerHealth: newState.player1.currentHealth,
          aiHealth: newState.player2.currentHealth,
        });
        return;
      }

      // Continue battle
      newState.currentRound += 1;
      newState.player1.currentEnergy = Math.min(newState.player1.currentEnergy + GAME_CONFIG.ENERGY_REGEN, GAME_CONFIG.MAX_ENERGY);
      newState.player2.currentEnergy = Math.min(newState.player2.currentEnergy + GAME_CONFIG.ENERGY_REGEN, GAME_CONFIG.MAX_ENERGY);
      
      setBattleState(newState);
      setSelectedAction(null);
      setTimer(GAME_CONFIG.BATTLE_TIMER);
    }, 1000);
  };

  if (!battleState) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Initializing battle arena...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Battle Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-neon-blue mb-2">ROUND {battleState.currentRound}</h2>
        <div className="flex items-center justify-center space-x-4">
          <div className="text-lg font-semibold text-accent">
            {timer}s
          </div>
          <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-accent to-red-500 transition-all duration-1000"
              style={{ width: `${(timer / GAME_CONFIG.BATTLE_TIMER) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Battle Arena */}
      <div className="relative">
        {/* Arena Background */}
        <div className="arena-glow absolute inset-0 rounded-2xl" />
        
        <div className="glass-card p-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Player */}
            <CompetitiveCard
              variant="player"
              nft={battleState.player1.nft}
              isCurrentTurn={battleState.phase === 'action'}
              health={battleState.player1.currentHealth}
              maxHealth={battleState.player1.nft.stats.health}
              energy={battleState.player1.currentEnergy}
              maxEnergy={GAME_CONFIG.MAX_ENERGY}
            />

            {/* VS Indicator */}
            <div className="md:absolute md:left-1/2 md:top-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2 md:z-20">
              <div className="w-16 h-16 bg-gradient-to-r from-neon-blue to-neon-pink rounded-full flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-lg">VS</span>
              </div>
            </div>

            {/* Opponent */}
            <CompetitiveCard
              variant={mode === 'ai' ? 'ai' : 'enemy'}
              nft={battleState.player2.nft}
              health={battleState.player2.currentHealth}
              maxHealth={battleState.player2.nft.stats.health}
              energy={battleState.player2.currentEnergy}
              maxEnergy={GAME_CONFIG.MAX_ENERGY}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4 text-center">
          Choose Your Action
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ActionButton
            variant={selectedAction === 'attack' ? 'primary' : 'secondary'}
            disabled={battleState.player1.currentEnergy < 20 || selectedAction !== null}
            onClick={() => handleAction('attack')}
          >
            <Sword className="w-4 h-4" />
            Attack (20 Energy)
          </ActionButton>

          <ActionButton
            variant={selectedAction === 'defend' ? 'primary' : 'secondary'}
            disabled={battleState.player1.currentEnergy < 10 || selectedAction !== null}
            onClick={() => handleAction('defend')}
          >
            <Shield className="w-4 h-4" />
            Defend (10 Energy)
          </ActionButton>

          <ActionButton
            variant={selectedAction === 'ability' ? 'primary' : 'secondary'}
            disabled={battleState.player1.currentEnergy < 40 || selectedAction !== null}
            onClick={() => handleAction('ability')}
          >
            <Zap className="w-4 h-4" />
            Special (40 Energy)
          </ActionButton>
        </div>

        {selectedAction && (
          <div className="mt-4 text-center">
            <div className="inline-flex items-center space-x-2 text-accent">
              <RotateCcw className="w-4 h-4 animate-spin" />
              <span>Executing {selectedAction}...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
