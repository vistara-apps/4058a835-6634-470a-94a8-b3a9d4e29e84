'use client';

import { NFT } from '@/lib/types';
import { getRarityColor, getRarityGlow } from '@/lib/utils';
import { Sword, Shield, Zap, Heart } from 'lucide-react';

interface NFTAvatarProps {
  nft: NFT;
  variant?: 'small' | 'large';
  selected?: boolean;
  onClick?: () => void;
}

export function NFTAvatar({ nft, variant = 'small', selected = false, onClick }: NFTAvatarProps) {
  const isLarge = variant === 'large';
  const sizeClasses = isLarge ? 'w-32 h-32' : 'w-16 h-16';
  const rarityColor = getRarityColor(nft.rarity);
  const rarityGlow = getRarityGlow(nft.rarity);

  return (
    <div 
      className={`relative group cursor-pointer transition-all duration-200 ${
        selected ? 'scale-105' : 'hover:scale-105'
      }`}
      onClick={onClick}
    >
      {/* NFT Image */}
      <div className={`${sizeClasses} relative rounded-lg overflow-hidden ${rarityGlow} ${
        selected ? 'ring-2 ring-neon-blue' : ''
      }`}>
        <div className="w-full h-full bg-gradient-to-br from-surface to-gray-800 flex items-center justify-center">
          <div className="text-4xl">🤖</div>
        </div>
        
        {/* Rarity Border */}
        <div className={`absolute inset-0 rounded-lg border-2 ${
          nft.rarity === 'legendary' ? 'border-yellow-400' :
          nft.rarity === 'epic' ? 'border-purple-400' :
          nft.rarity === 'rare' ? 'border-blue-400' : 'border-gray-400'
        }`} />
      </div>

      {/* NFT Info */}
      <div className="mt-2 text-center">
        <h3 className={`font-semibold ${isLarge ? 'text-lg' : 'text-sm'} ${rarityColor}`}>
          {nft.name}
        </h3>
        <p className="text-xs text-text-secondary capitalize">{nft.rarity}</p>
      </div>

      {/* Stats (Large variant only) */}
      {isLarge && (
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-1">
            <Sword className="w-3 h-3 text-red-400" />
            <span className="text-text-secondary">ATK:</span>
            <span className="text-red-400 font-semibold">{nft.stats.attack}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Shield className="w-3 h-3 text-blue-400" />
            <span className="text-text-secondary">DEF:</span>
            <span className="text-blue-400 font-semibold">{nft.stats.defense}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Zap className="w-3 h-3 text-yellow-400" />
            <span className="text-text-secondary">SPD:</span>
            <span className="text-yellow-400 font-semibold">{nft.stats.speed}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Heart className="w-3 h-3 text-green-400" />
            <span className="text-text-secondary">HP:</span>
            <span className="text-green-400 font-semibold">{nft.stats.health}</span>
          </div>
        </div>
      )}

      {/* Selection Indicator */}
      {selected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-neon-blue rounded-full flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-full" />
        </div>
      )}
    </div>
  );
}
