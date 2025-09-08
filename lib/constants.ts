export const GAME_CONFIG = {
  BATTLE_TIMER: 30, // seconds per turn
  MAX_ENERGY: 100,
  ENERGY_REGEN: 20, // per turn
  MAX_HEALTH: 1000,
  XP_PER_WIN: 100,
  XP_PER_LOSS: 25,
  BATTLE_PASS_XP_PER_LEVEL: 1000,
} as const;

export const RARITY_COLORS = {
  common: 'text-gray-400',
  rare: 'text-blue-400',
  epic: 'text-purple-400',
  legendary: 'text-yellow-400',
} as const;

export const RARITY_GLOWS = {
  common: 'shadow-gray-500/20',
  rare: 'shadow-blue-500/30',
  epic: 'shadow-purple-500/30',
  legendary: 'shadow-yellow-500/40',
} as const;

export const MOCK_NFTS: NFT[] = [
  {
    tokenId: '1',
    contractAddress: '0x123...',
    name: 'Cyber Warrior',
    imageUrl: '/api/placeholder/200/200',
    rarity: 'legendary',
    stats: {
      attack: 95,
      defense: 80,
      speed: 75,
      health: 900,
      energy: 100,
    },
    abilities: [
      {
        id: 'cyber-slash',
        name: 'Cyber Slash',
        description: 'A devastating energy blade attack',
        cooldown: 3,
        energyCost: 40,
        damage: 150,
      },
      {
        id: 'shield-matrix',
        name: 'Shield Matrix',
        description: 'Creates a protective energy barrier',
        cooldown: 4,
        energyCost: 30,
        effect: 'defense_boost',
      },
    ],
  },
  {
    tokenId: '2',
    contractAddress: '0x123...',
    name: 'Neon Assassin',
    imageUrl: '/api/placeholder/200/200',
    rarity: 'epic',
    stats: {
      attack: 85,
      defense: 60,
      speed: 95,
      health: 750,
      energy: 100,
    },
    abilities: [
      {
        id: 'stealth-strike',
        name: 'Stealth Strike',
        description: 'Invisible attack with critical damage',
        cooldown: 2,
        energyCost: 35,
        damage: 120,
      },
    ],
  },
  {
    tokenId: '3',
    contractAddress: '0x123...',
    name: 'Plasma Guardian',
    imageUrl: '/api/placeholder/200/200',
    rarity: 'rare',
    stats: {
      attack: 70,
      defense: 90,
      speed: 60,
      health: 950,
      energy: 100,
    },
    abilities: [
      {
        id: 'plasma-barrier',
        name: 'Plasma Barrier',
        description: 'Absorbs incoming damage',
        cooldown: 3,
        energyCost: 25,
        effect: 'damage_absorption',
      },
    ],
  },
];

export const MOCK_USER: User = {
  userId: '1',
  walletAddress: '0xabc...',
  farcasterId: 'user123',
  ranking: 1250,
  battlePassLevel: 15,
  xp: 2500,
  wins: 45,
  losses: 23,
};

export const MOCK_BATTLE_PASS: BattlePass = {
  level: 15,
  xp: 2500,
  maxXp: 3000,
  rewardsClaimed: ['reward_1', 'reward_2'],
  availableRewards: [
    {
      id: 'reward_16',
      level: 16,
      type: 'cosmetic',
      name: 'Neon Trail Effect',
      description: 'Glowing trail for your character',
      imageUrl: '/api/placeholder/100/100',
      claimed: false,
    },
    {
      id: 'reward_20',
      level: 20,
      type: 'nft',
      name: 'Elite Combat Skin',
      description: 'Exclusive NFT skin for top players',
      imageUrl: '/api/placeholder/100/100',
      claimed: false,
      requiresNFT: '0x123...',
    },
  ],
};
