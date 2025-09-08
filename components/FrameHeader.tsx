'use client';

import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import { Name, Avatar } from '@coinbase/onchainkit/identity';
import { Trophy, Zap } from 'lucide-react';
import { MOCK_USER } from '@/lib/constants';

export function FrameHeader() {
  return (
    <header className="glass-card p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <h1 className="text-xl font-bold bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent animate-glow">
              CRYPTO COMBAT
            </h1>
            <div className="text-sm text-accent font-semibold">ARENA</div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* User Stats */}
          <div className="hidden sm:flex items-center space-x-3 text-sm">
            <div className="flex items-center space-x-1">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-text-secondary">Rank:</span>
              <span className="text-neon-blue font-semibold">#{MOCK_USER.ranking}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-text-secondary">Level:</span>
              <span className="text-accent font-semibold">{MOCK_USER.battlePassLevel}</span>
            </div>
          </div>

          {/* Wallet Connection */}
          <Wallet>
            <ConnectWallet className="btn-primary">
              <Avatar className="w-6 h-6" />
              <Name className="text-sm font-medium" />
            </ConnectWallet>
          </Wallet>
        </div>
      </div>
    </header>
  );
}
