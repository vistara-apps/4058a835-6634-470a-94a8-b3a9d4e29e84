'use client';

import { User, NFT } from '@/lib/types';
import { NFTAvatar } from './NFTAvatar';
import { Trophy, Target, Zap } from 'lucide-react';

interface CompetitiveCardProps {
  variant: 'player' | 'enemy' | 'ai';
  user?: User;
  nft?: NFT;
  isCurrentTurn?: boolean;
  health?: number;
  maxHealth?: number;
  energy?: number;
  maxEnergy?: number;
}

export function CompetitiveCard({ 
  variant, 
  user, 
  nft, 
  isCurrentTurn = false,
  health = 100,
  maxHealth = 100,
  energy = 100,
  maxEnergy = 100
}: CompetitiveCardProps) {
  const isAI = variant === 'ai';
  const isEnemy = variant === 'enemy';
  
  const displayName = isAI ? 'AI Opponent' : user?.farcasterId || 'Player';
  const displayRank = isAI ? 'Elite AI' : `#${user?.ranking || 0}`;

  return (
    <div className={`glass-card p-4 transition-all duration-200 ${
      isCurrentTurn ? 'ring-2 ring-neon-blue shadow-neon-blue' : ''
    }`}>
      <div className="flex items-center space-x-4">
        {/* NFT Avatar */}
        {nft && <NFTAvatar nft={nft} variant="small" />}
        
        {/* Player Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-semibold text-text-primary truncate">{displayName}</h3>
            {isCurrentTurn && (
              <Target className="w-4 h-4 text-neon-blue animate-pulse" />
            )}
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-text-secondary">
            <Trophy className="w-3 h-3" />
            <span>{displayRank}</span>
            {user && (
              <>
                <span>•</span>
                <span>{user.wins}W / {user.losses}L</span>
              </>
            )}
          </div>

          {/* Health Bar */}
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-red-400">Health</span>
              <span className="text-text-secondary">{health}/{maxHealth}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-red-500 to-red-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(health / maxHealth) * 100}%` }}
              />
            </div>
          </div>

          {/* Energy Bar */}
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-blue-400">Energy</span>
              <span className="text-text-secondary">{energy}/{maxEnergy}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(energy / maxEnergy) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Status Effects */}
      {isCurrentTurn && (
        <div className="mt-3 flex items-center space-x-2">
          <Zap className="w-4 h-4 text-accent" />
          <span className="text-sm text-accent font-medium">Your Turn</span>
        </div>
      )}
    </div>
  );
}
