'use client';

import { BattlePass } from '@/lib/types';
import { calculateBattlePassProgress } from '@/lib/utils';
import { Star, Gift, Lock } from 'lucide-react';

interface BattlePassTrackerProps {
  battlePass: BattlePass;
  variant?: 'simple' | 'detailed';
}

export function BattlePassTracker({ battlePass, variant = 'simple' }: BattlePassTrackerProps) {
  const progress = calculateBattlePassProgress(battlePass.xp, battlePass.maxXp);
  const isDetailed = variant === 'detailed';

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Star className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-text-primary">Battle Pass</h3>
        </div>
        <div className="text-sm text-text-secondary">
          Level {battlePass.level}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-text-secondary">Progress</span>
          <span className="text-accent font-semibold">
            {battlePass.xp}/{battlePass.maxXp} XP
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-accent to-yellow-500 h-3 rounded-full transition-all duration-500 relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white bg-opacity-20 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Rewards Preview */}
      {isDetailed && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-text-primary">Upcoming Rewards</h4>
          <div className="grid grid-cols-3 gap-2">
            {battlePass.availableRewards.slice(0, 3).map((reward) => (
              <div 
                key={reward.id}
                className="relative bg-surface rounded-lg p-2 text-center border border-gray-600"
              >
                <div className="w-8 h-8 mx-auto mb-1 bg-gradient-to-br from-accent to-yellow-500 rounded flex items-center justify-center">
                  {reward.claimed ? (
                    <Gift className="w-4 h-4 text-white" />
                  ) : (
                    <Lock className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="text-xs text-text-secondary">Lv.{reward.level}</div>
                <div className="text-xs text-text-primary font-medium truncate">
                  {reward.name}
                </div>
                {reward.requiresNFT && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Simple Stats */}
      {!isDetailed && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">Next reward in:</span>
          <span className="text-accent font-semibold">
            {battlePass.maxXp - battlePass.xp} XP
          </span>
        </div>
      )}
    </div>
  );
}
