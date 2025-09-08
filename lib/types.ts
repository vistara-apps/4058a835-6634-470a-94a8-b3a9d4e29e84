// User entity
export interface User {
  userId: string;
  walletAddress: string;
  farcasterId?: string;
  ranking: number;
  battlePassLevel: number;
  xp: number;
  wins: number;
  losses: number;
}

// NFT entity
export interface NFT {
  tokenId: string;
  contractAddress: string;
  name: string;
  imageUrl: string;
  stats: NFTStats;
  abilities: NFTAbility[];
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface NFTStats {
  attack: number;
  defense: number;
  speed: number;
  health: number;
  energy: number;
}

export interface NFTAbility {
  id: string;
  name: string;
  description: string;
  cooldown: number;
  energyCost: number;
  damage?: number;
  effect?: string;
}

// Game Match entity
export interface GameMatch {
  matchId: string;
  player1Id: string;
  player2Id?: string; // undefined for AI matches
  winnerId?: string;
  timestamp: number;
  matchType: 'ai' | 'pvp';
  matchOutcomeDetails: MatchOutcome;
  duration: number;
}

export interface MatchOutcome {
  player1Score: number;
  player2Score: number;
  rounds: BattleRound[];
  xpGained: number;
  rewardsEarned: string[];
}

export interface BattleRound {
  roundNumber: number;
  player1Action: BattleAction;
  player2Action: BattleAction;
  damage: number;
  winner: 'player1' | 'player2';
}

export interface BattleAction {
  type: 'attack' | 'defend' | 'ability';
  abilityId?: string;
  damage: number;
  energyUsed: number;
}

// Battle Pass entity
export interface BattlePass {
  level: number;
  xp: number;
  maxXp: number;
  rewardsClaimed: string[];
  availableRewards: BattlePassReward[];
}

export interface BattlePassReward {
  id: string;
  level: number;
  type: 'cosmetic' | 'currency' | 'nft' | 'boost';
  name: string;
  description: string;
  imageUrl: string;
  claimed: boolean;
  requiresNFT?: string; // NFT contract address if required
}

// Game State
export interface GameState {
  currentMatch?: GameMatch;
  selectedNFT?: NFT;
  battleState?: BattleState;
  isInBattle: boolean;
  isSearchingMatch: boolean;
}

export interface BattleState {
  player1: BattleCharacter;
  player2: BattleCharacter;
  currentRound: number;
  phase: 'preparation' | 'action' | 'resolution' | 'finished';
  timer: number;
}

export interface BattleCharacter {
  nft: NFT;
  currentHealth: number;
  currentEnergy: number;
  statusEffects: StatusEffect[];
  cooldowns: Record<string, number>;
}

export interface StatusEffect {
  id: string;
  name: string;
  duration: number;
  effect: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface MatchmakingResponse {
  matchId: string;
  opponent: User;
  estimatedWaitTime: number;
}

// Payment types for x402 integration
export interface PaymentConfig {
  maxAmount: string; // Maximum amount willing to pay in USDC
  network: 'base' | 'base-sepolia';
  token: 'USDC';
}

export interface PaymentResult {
  success: boolean;
  transactionHash?: string;
  amount?: string;
  error?: string;
}

export interface PaidService {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  pricePerRequest: string; // USDC amount
  category: 'ai-battle' | 'nft-enhancement' | 'tournament' | 'analytics';
}
