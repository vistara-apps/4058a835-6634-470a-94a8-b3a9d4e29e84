import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

export function calculateBattlePassProgress(xp: number, maxXp: number): number {
  return Math.min((xp / maxXp) * 100, 100);
}

export function getRarityColor(rarity: string): string {
  const colors = {
    common: 'text-gray-400',
    rare: 'text-blue-400',
    epic: 'text-purple-400',
    legendary: 'text-yellow-400',
  };
  return colors[rarity as keyof typeof colors] || colors.common;
}

export function getRarityGlow(rarity: string): string {
  const glows = {
    common: 'shadow-gray-500/20',
    rare: 'shadow-blue-500/30',
    epic: 'shadow-purple-500/30',
    legendary: 'shadow-yellow-500/40',
  };
  return glows[rarity as keyof typeof glows] || glows.common;
}

export function simulateAIBattle(playerNFT: any, aiNFT: any) {
  // Simple battle simulation
  const playerPower = playerNFT.stats.attack + playerNFT.stats.defense + playerNFT.stats.speed;
  const aiPower = aiNFT.stats.attack + aiNFT.stats.defense + aiNFT.stats.speed;
  
  // Add some randomness
  const playerScore = playerPower + Math.random() * 100;
  const aiScore = aiPower + Math.random() * 100;
  
  return {
    winner: playerScore > aiScore ? 'player' : 'ai',
    playerScore: Math.floor(playerScore),
    aiScore: Math.floor(aiScore),
    xpGained: playerScore > aiScore ? 100 : 25,
  };
}
