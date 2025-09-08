'use client';

import { useState, useEffect, useRef } from 'react';
import { NFT, BattleState, BattleCharacter } from '@/lib/types';
import { MOCK_NFTS, GAME_CONFIG } from '@/lib/constants';
import { CompetitiveCard } from './CompetitiveCard';
import { ActionButton } from './ActionButton';
import { simulateAIBattle } from '@/lib/utils';
import { battleAnimations, particleEffects } from '@/lib/animations';
import { announceToScreenReader } from '@/lib/accessibility';
import { isMobile, triggerHapticFeedback, addTouchEventListeners } from '@/lib/mobile-utils';
import { Sword, Shield, Zap, RotateCcw, Heart, Battery } from 'lucide-react';

interface BattleArenaProps {
  playerNFT: NFT;
  mode: 'ai' | 'pvp';
  onBattleEnd: (result: any) => void;
}

export function BattleArena({ playerNFT, mode, onBattleEnd }: BattleArenaProps) {
  const [battleState, setBattleState] = useState<BattleState | null>(null);
  const [timer, setTimer] = useState(GAME_CONFIG.BATTLE_TIMER);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const arenaRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const enemyRef = useRef<HTMLDivElement>(null);

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
    if (!battleState || isAnimating) return;

    setSelectedAction(action);
    setIsAnimating(true);
    
    // Trigger haptic feedback on mobile
    if (isMobile()) {
      const hapticType = action === 'ability' ? 'heavy' : action === 'attack' ? 'medium' : 'light';
      triggerHapticFeedback(hapticType);
    }
    
    // Add battle log entry
    const actionText = action === 'attack' ? 'launched an attack' : 
                     action === 'defend' ? 'took a defensive stance' : 
                     'used a special ability';
    setBattleLog(prev => [...prev, `${battleState.player1.nft.name} ${actionText}!`]);
    
    // Announce action to screen readers
    announceToScreenReader(`You ${actionText}`, 'assertive');
    
    // Simulate battle round with enhanced effects
    setTimeout(() => {
      const result = simulateAIBattle(battleState.player1.nft, battleState.player2.nft);
      
      // Update battle state based on action
      const newState = { ...battleState };
      let playerDamage = 0;
      let enemyDamage = 0;
      
      if (action === 'attack') {
        enemyDamage = Math.floor(Math.random() * 50) + 75; // 75-125 damage
        newState.player2.currentHealth = Math.max(0, newState.player2.currentHealth - enemyDamage);
        newState.player1.currentEnergy -= 20;
        
        // Visual effects for attack
        if (enemyRef.current) {
          battleAnimations.flashEffect(enemyRef.current, 'rgba(255, 0, 0, 0.4)');
          battleAnimations.showDamageNumber(enemyRef.current, enemyDamage, 'damage');
        }
        battleAnimations.screenShake(1, 300);
        
      } else if (action === 'defend') {
        newState.player1.currentEnergy -= 10;
        // Visual effect for defend
        if (playerRef.current) {
          battleAnimations.flashEffect(playerRef.current, 'rgba(0, 255, 255, 0.3)');
        }
        
      } else if (action === 'ability') {
        enemyDamage = Math.floor(Math.random() * 80) + 100; // 100-180 damage
        newState.player2.currentHealth = Math.max(0, newState.player2.currentHealth - enemyDamage);
        newState.player1.currentEnergy -= 40;
        
        // Enhanced visual effects for special ability
        if (enemyRef.current && arenaRef.current) {
          battleAnimations.flashEffect(enemyRef.current, 'rgba(128, 0, 255, 0.5)');
          battleAnimations.showDamageNumber(enemyRef.current, enemyDamage, 'critical');
          particleEffects.createParticles(arenaRef.current, 15, '#8000ff');
        }
        battleAnimations.screenShake(2, 500);
      }

      // AI counter-attack (if enemy is still alive)
      if (newState.player2.currentHealth > 0) {
        setTimeout(() => {
          const aiDamage = Math.floor(Math.random() * 40) + 60; // 60-100 damage
          const reducedDamage = action === 'defend' ? Math.floor(aiDamage * 0.5) : aiDamage;
          
          newState.player1.currentHealth = Math.max(0, newState.player1.currentHealth - reducedDamage);
          newState.player2.currentEnergy -= 15;
          
          setBattleLog(prev => [...prev, `${newState.player2.nft.name} counter-attacks for ${reducedDamage} damage!`]);
          announceToScreenReader(`Enemy dealt ${reducedDamage} damage to you`, 'assertive');
          
          // Visual effects for AI attack
          if (playerRef.current) {
            battleAnimations.flashEffect(playerRef.current, 'rgba(255, 100, 0, 0.4)');
            battleAnimations.showDamageNumber(playerRef.current, reducedDamage, 'damage');
          }
          
          // Check for battle end
          if (newState.player1.currentHealth <= 0 || newState.player2.currentHealth <= 0) {
            const winner = newState.player1.currentHealth > 0 ? 'player' : 'ai';
            
            // Victory/defeat effects
            if (arenaRef.current) {
              if (winner === 'player') {
                particleEffects.celebrationEffect(arenaRef.current);
                announceToScreenReader('Victory! You won the battle!', 'assertive');
              } else {
                announceToScreenReader('Defeat! You lost the battle.', 'assertive');
              }
            }
            
            setTimeout(() => {
              onBattleEnd({
                winner,
                xpGained: winner === 'player' ? 100 : 25,
                playerHealth: newState.player1.currentHealth,
                aiHealth: newState.player2.currentHealth,
              });
            }, 1500);
            return;
          }

          // Continue battle
          newState.currentRound += 1;
          newState.player1.currentEnergy = Math.min(newState.player1.currentEnergy + GAME_CONFIG.ENERGY_REGEN, GAME_CONFIG.MAX_ENERGY);
          newState.player2.currentEnergy = Math.min(newState.player2.currentEnergy + GAME_CONFIG.ENERGY_REGEN, GAME_CONFIG.MAX_ENERGY);
          
          // Announce new round
          announceToScreenReader(`Round ${newState.currentRound}. Your health: ${newState.player1.currentHealth}. Enemy health: ${newState.player2.currentHealth}.`, 'polite');
          
          setBattleState(newState);
          setSelectedAction(null);
          setIsAnimating(false);
          setTimer(GAME_CONFIG.BATTLE_TIMER);
        }, 800);
      } else {
        setBattleState(newState);
        setSelectedAction(null);
        setIsAnimating(false);
      }
    }, 1000);
  };

  if (!battleState) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-neon-purple border-b-transparent rounded-full animate-spin mx-auto" 
                 style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          </div>
          <p className="text-text-secondary mb-2">Initializing battle arena...</p>
          <div className="flex items-center justify-center space-x-1">
            <div className="w-2 h-2 bg-neon-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-neon-purple rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-neon-pink rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isMobile() ? 'safe-area-bottom' : ''}`}>
      {/* Battle Header */}
      <div className="text-center">
        <h2 className={`${isMobile() ? 'text-xl' : 'text-2xl'} font-bold text-neon-blue mb-2`}>
          ROUND {battleState.currentRound}
        </h2>
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
      <div className="relative" ref={arenaRef}>
        {/* Arena Background */}
        <div className="arena-glow absolute inset-0 rounded-2xl" />
        
        <div className={`glass-card ${isMobile() ? 'p-4' : 'p-6'} relative z-10`}>
          <div className={`grid grid-cols-1 ${isMobile() ? 'gap-4' : 'md:grid-cols-2 gap-6'}`}>
            {/* Player */}
            <div ref={playerRef} className="relative">
              <CompetitiveCard
                variant="player"
                nft={battleState.player1.nft}
                isCurrentTurn={battleState.phase === 'action' && !isAnimating}
                health={battleState.player1.currentHealth}
                maxHealth={battleState.player1.nft.stats.health}
                energy={battleState.player1.currentEnergy}
                maxEnergy={GAME_CONFIG.MAX_ENERGY}
              />
              
              {/* Enhanced Health Bar */}
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4 text-red-400" />
                    <span className="text-text-secondary">Health</span>
                  </div>
                  <span className="text-text-primary font-semibold">
                    {battleState.player1.currentHealth}/{battleState.player1.nft.stats.health}
                  </span>
                </div>
                <div className="health-bar">
                  <div 
                    className="health-bar-fill bg-gradient-to-r from-red-500 to-red-400"
                    style={{ 
                      width: `${(battleState.player1.currentHealth / battleState.player1.nft.stats.health) * 100}%` 
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <Battery className="w-4 h-4 text-blue-400" />
                    <span className="text-text-secondary">Energy</span>
                  </div>
                  <span className="text-text-primary font-semibold">
                    {battleState.player1.currentEnergy}/{GAME_CONFIG.MAX_ENERGY}
                  </span>
                </div>
                <div className="energy-bar">
                  <div 
                    className="energy-bar-fill"
                    style={{ 
                      width: `${(battleState.player1.currentEnergy / GAME_CONFIG.MAX_ENERGY) * 100}%` 
                    }}
                  />
                </div>
              </div>
            </div>

            {/* VS Indicator */}
            <div className="md:absolute md:left-1/2 md:top-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2 md:z-20">
              <div className={`w-16 h-16 bg-gradient-to-r from-neon-blue to-neon-pink rounded-full flex items-center justify-center mx-auto transition-all duration-300 ${
                isAnimating ? 'animate-pulse scale-110' : 'scale-100'
              }`}>
                <span className="text-white font-bold text-lg">VS</span>
              </div>
            </div>

            {/* Opponent */}
            <div ref={enemyRef} className="relative">
              <CompetitiveCard
                variant={mode === 'ai' ? 'ai' : 'enemy'}
                nft={battleState.player2.nft}
                health={battleState.player2.currentHealth}
                maxHealth={battleState.player2.nft.stats.health}
                energy={battleState.player2.currentEnergy}
                maxEnergy={GAME_CONFIG.MAX_ENERGY}
              />
              
              {/* Enhanced Health Bar */}
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4 text-red-400" />
                    <span className="text-text-secondary">Health</span>
                  </div>
                  <span className="text-text-primary font-semibold">
                    {battleState.player2.currentHealth}/{battleState.player2.nft.stats.health}
                  </span>
                </div>
                <div className="health-bar">
                  <div 
                    className="health-bar-fill bg-gradient-to-r from-red-500 to-red-400"
                    style={{ 
                      width: `${(battleState.player2.currentHealth / battleState.player2.nft.stats.health) * 100}%` 
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <Battery className="w-4 h-4 text-blue-400" />
                    <span className="text-text-secondary">Energy</span>
                  </div>
                  <span className="text-text-primary font-semibold">
                    {battleState.player2.currentEnergy}/{GAME_CONFIG.MAX_ENERGY}
                  </span>
                </div>
                <div className="energy-bar">
                  <div 
                    className="energy-bar-fill"
                    style={{ 
                      width: `${(battleState.player2.currentEnergy / GAME_CONFIG.MAX_ENERGY) * 100}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Action Buttons */}
        <div className="lg:col-span-2">
          <div className={`glass-card ${isMobile() ? 'p-4' : 'p-6'}`}>
            <h3 className={`${isMobile() ? 'text-base' : 'text-lg'} font-semibold text-text-primary mb-4 text-center`}>
              Choose Your Action
            </h3>
            
            <div className={`grid ${isMobile() ? 'grid-cols-1 gap-3' : 'grid-cols-1 sm:grid-cols-3 gap-4'}`}>
              <ActionButton
                variant={selectedAction === 'attack' ? 'primary' : 'secondary'}
                disabled={battleState.player1.currentEnergy < 20 || isAnimating}
                onClick={() => handleAction('attack')}
                icon={<Sword className="w-4 h-4" />}
                iconPosition="left"
                glow={battleState.player1.currentEnergy >= 20 && !isAnimating}
                className={isMobile() ? 'min-h-[48px] text-base' : ''}
              >
                Attack (20 Energy)
              </ActionButton>

              <ActionButton
                variant={selectedAction === 'defend' ? 'accent' : 'secondary'}
                disabled={battleState.player1.currentEnergy < 10 || isAnimating}
                onClick={() => handleAction('defend')}
                icon={<Shield className="w-4 h-4" />}
                iconPosition="left"
                glow={battleState.player1.currentEnergy >= 10 && !isAnimating}
                className={isMobile() ? 'min-h-[48px] text-base' : ''}
              >
                Defend (10 Energy)
              </ActionButton>

              <ActionButton
                variant={selectedAction === 'ability' ? 'destructive' : 'secondary'}
                disabled={battleState.player1.currentEnergy < 40 || isAnimating}
                className={isMobile() ? 'min-h-[48px] text-base' : ''}
                onClick={() => handleAction('ability')}
                icon={<Zap className="w-4 h-4" />}
                iconPosition="left"
                pulse={battleState.player1.currentEnergy >= 40 && !isAnimating}
                glow={battleState.player1.currentEnergy >= 40 && !isAnimating}
              >
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

            {/* Energy Warning */}
            {battleState.player1.currentEnergy < 20 && !isAnimating && (
              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-yellow-400 text-sm text-center">
                  ⚠️ Low energy! You can only defend or wait for energy regeneration.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Battle Log */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 h-full">
            <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
              <span className="w-2 h-2 bg-neon-blue rounded-full mr-2 animate-pulse" />
              Battle Log
            </h3>
            
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {battleLog.length === 0 ? (
                <p className="text-text-secondary text-sm italic">
                  Battle actions will appear here...
                </p>
              ) : (
                battleLog.slice(-8).map((log, index) => (
                  <div 
                    key={index} 
                    className="text-sm p-2 bg-surface/30 rounded border-l-2 border-neon-blue/50 animate-fade-in"
                  >
                    {log}
                  </div>
                ))
              )}
            </div>
            
            {/* Battle Stats */}
            <div className="mt-4 pt-4 border-t border-border/30">
              <div className="text-xs text-text-secondary space-y-1">
                <div className="flex justify-between">
                  <span>Round:</span>
                  <span className="text-accent font-semibold">{battleState.currentRound}</span>
                </div>
                <div className="flex justify-between">
                  <span>Mode:</span>
                  <span className="text-neon-blue font-semibold">{mode.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={`font-semibold ${
                    isAnimating ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {isAnimating ? 'Processing...' : 'Ready'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
