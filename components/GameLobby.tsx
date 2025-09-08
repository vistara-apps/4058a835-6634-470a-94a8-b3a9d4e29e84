'use client';

import { useState } from 'react';
import { NFT } from '@/lib/types';
import { MOCK_NFTS } from '@/lib/constants';
import { NFTAvatar } from './NFTAvatar';
import { ActionButton } from './ActionButton';
import { Swords, Bot, Users, Zap } from 'lucide-react';

interface GameLobbyProps {
  onStartBattle: (nft: NFT, mode: 'ai' | 'pvp') => void;
}

export function GameLobby({ onStartBattle }: GameLobbyProps) {
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(MOCK_NFTS[0]);
  const [isSearching, setIsSearching] = useState(false);

  const handleStartBattle = async (mode: 'ai' | 'pvp') => {
    if (!selectedNFT) return;
    
    if (mode === 'pvp') {
      setIsSearching(true);
      // Simulate matchmaking delay
      setTimeout(() => {
        setIsSearching(false);
        onStartBattle(selectedNFT, mode);
      }, 2000);
    } else {
      onStartBattle(selectedNFT, mode);
    }
  };

  return (
    <div className="space-y-6">
      {/* Arena Title */}
      <div className="text-center">
        <div className="relative inline-block">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent">
            COMBAT ARENA
          </h2>
          <div className="absolute inset-0 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink opacity-20 blur-xl" />
        </div>
        <p className="text-text-secondary mt-2">Choose your fighter and enter the arena</p>
      </div>

      {/* NFT Selection */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center space-x-2">
          <Swords className="w-5 h-5 text-accent" />
          <span>Select Your Fighter</span>
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {MOCK_NFTS.map((nft) => (
            <NFTAvatar
              key={nft.tokenId}
              nft={nft}
              variant="large"
              selected={selectedNFT?.tokenId === nft.tokenId}
              onClick={() => setSelectedNFT(nft)}
            />
          ))}
        </div>

        {selectedNFT && (
          <div className="mt-6 p-4 bg-surface rounded-lg border border-gray-600">
            <h4 className="font-semibold text-text-primary mb-2">Selected Fighter</h4>
            <div className="flex items-center space-x-4">
              <NFTAvatar nft={selectedNFT} variant="small" />
              <div className="flex-1">
                <h5 className="font-medium text-text-primary">{selectedNFT.name}</h5>
                <p className="text-sm text-text-secondary capitalize">{selectedNFT.rarity}</p>
                <div className="flex items-center space-x-4 mt-2 text-xs">
                  <span className="text-red-400">ATK: {selectedNFT.stats.attack}</span>
                  <span className="text-blue-400">DEF: {selectedNFT.stats.defense}</span>
                  <span className="text-yellow-400">SPD: {selectedNFT.stats.speed}</span>
                  <span className="text-green-400">HP: {selectedNFT.stats.health}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Battle Mode Selection */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Choose Battle Mode</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* AI Battle */}
          <div className="bg-surface rounded-lg p-4 border border-gray-600 hover:border-neon-blue transition-colors duration-200">
            <div className="flex items-center space-x-3 mb-3">
              <Bot className="w-6 h-6 text-neon-blue" />
              <h4 className="font-semibold text-text-primary">AI Battle</h4>
            </div>
            <p className="text-sm text-text-secondary mb-4">
              Practice against AI opponents to improve your skills and earn XP.
            </p>
            <div className="flex items-center justify-between">
              <div className="text-xs text-accent">
                <Zap className="w-3 h-3 inline mr-1" />
                Quick Match
              </div>
              <ActionButton
                variant="primary"
                size="sm"
                disabled={!selectedNFT}
                onClick={() => handleStartBattle('ai')}
              >
                Fight AI
              </ActionButton>
            </div>
          </div>

          {/* PvP Battle */}
          <div className="bg-surface rounded-lg p-4 border border-gray-600 hover:border-neon-pink transition-colors duration-200">
            <div className="flex items-center space-x-3 mb-3">
              <Users className="w-6 h-6 text-neon-pink" />
              <h4 className="font-semibold text-text-primary">Player vs Player</h4>
            </div>
            <p className="text-sm text-text-secondary mb-4">
              Battle against real players in ranked matches for glory and rewards.
            </p>
            <div className="flex items-center justify-between">
              <div className="text-xs text-neon-pink">
                <Swords className="w-3 h-3 inline mr-1" />
                Ranked Match
              </div>
              <ActionButton
                variant="secondary"
                size="sm"
                disabled={!selectedNFT}
                loading={isSearching}
                onClick={() => handleStartBattle('pvp')}
              >
                {isSearching ? 'Finding Match...' : 'Find Match'}
              </ActionButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
