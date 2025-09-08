import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { User, NFT, GameMatch, MatchmakingResponse, ApiResponse } from './types';

// Base Minikit API Service
export class MiniKitAPI {
  private static instance: MiniKitAPI;
  private minikit: any;

  private constructor() {
    // Initialize in component with useMiniKit hook
  }

  static getInstance(): MiniKitAPI {
    if (!MiniKitAPI.instance) {
      MiniKitAPI.instance = new MiniKitAPI();
    }
    return MiniKitAPI.instance;
  }

  setMiniKit(minikit: any) {
    this.minikit = minikit;
  }

  // Wallet Integration
  async connectWallet(): Promise<ApiResponse<{ address: string; isConnected: boolean }>> {
    try {
      const walletState = await this.minikit.request('/getWalletState');
      return {
        data: {
          address: walletState.address,
          isConnected: walletState.isConnected,
        },
        success: true,
      };
    } catch (error) {
      return {
        data: { address: '', isConnected: false },
        success: false,
        error: 'Failed to connect wallet',
      };
    }
  }

  // Frame Actions
  async postFrame(frameData: any): Promise<ApiResponse<any>> {
    try {
      const result = await this.minikit.request('/frame', {
        url: `${window.location.origin}/api/frame`,
        data: frameData,
      });
      return {
        data: result,
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        success: false,
        error: 'Failed to post frame',
      };
    }
  }

  // Chat Agent Integration
  async sendChatMessage(message: string): Promise<ApiResponse<string>> {
    try {
      const response = await this.minikit.request('/chat', {
        message,
        context: 'crypto-combat-arena',
      });
      return {
        data: response.message,
        success: true,
      };
    } catch (error) {
      return {
        data: '',
        success: false,
        error: 'Failed to send chat message',
      };
    }
  }
}

// Game API Service
export class GameAPI {
  private static baseUrl = '/api';

  // User Management
  static async createUser(walletAddress: string, farcasterId?: string): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(`${this.baseUrl}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress, farcasterId }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        data: {} as User,
        success: false,
        error: 'Failed to create user',
      };
    }
  }

  static async getUser(userId: string): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        data: {} as User,
        success: false,
        error: 'Failed to get user',
      };
    }
  }

  static async updateUser(userId: string, updates: Partial<User>): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        data: {} as User,
        success: false,
        error: 'Failed to update user',
      };
    }
  }

  // NFT Management
  static async getUserNFTs(walletAddress: string): Promise<ApiResponse<NFT[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/nfts/${walletAddress}`);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        data: [],
        success: false,
        error: 'Failed to get user NFTs',
      };
    }
  }

  static async getNFTStats(contractAddress: string, tokenId: string): Promise<ApiResponse<NFT>> {
    try {
      const response = await fetch(`${this.baseUrl}/nfts/${contractAddress}/${tokenId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        data: {} as NFT,
        success: false,
        error: 'Failed to get NFT stats',
      };
    }
  }

  // Matchmaking
  static async findMatch(userId: string, nftId: string): Promise<ApiResponse<MatchmakingResponse>> {
    try {
      const response = await fetch(`${this.baseUrl}/matchmaking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, nftId }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        data: {} as MatchmakingResponse,
        success: false,
        error: 'Failed to find match',
      };
    }
  }

  static async cancelMatchmaking(userId: string): Promise<ApiResponse<boolean>> {
    try {
      const response = await fetch(`${this.baseUrl}/matchmaking/${userId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        data: false,
        success: false,
        error: 'Failed to cancel matchmaking',
      };
    }
  }

  // Battle Management
  static async createMatch(player1Id: string, player2Id: string, matchType: 'ai' | 'pvp'): Promise<ApiResponse<GameMatch>> {
    try {
      const response = await fetch(`${this.baseUrl}/matches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player1Id, player2Id, matchType }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        data: {} as GameMatch,
        success: false,
        error: 'Failed to create match',
      };
    }
  }

  static async updateMatch(matchId: string, updates: Partial<GameMatch>): Promise<ApiResponse<GameMatch>> {
    try {
      const response = await fetch(`${this.baseUrl}/matches/${matchId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        data: {} as GameMatch,
        success: false,
        error: 'Failed to update match',
      };
    }
  }

  static async getMatchHistory(userId: string, limit = 10): Promise<ApiResponse<GameMatch[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/matches/history/${userId}?limit=${limit}`);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        data: [],
        success: false,
        error: 'Failed to get match history',
      };
    }
  }

  // Battle Pass
  static async getBattlePass(userId: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/battlepass/${userId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        data: null,
        success: false,
        error: 'Failed to get battle pass',
      };
    }
  }

  static async claimReward(userId: string, rewardId: string): Promise<ApiResponse<boolean>> {
    try {
      const response = await fetch(`${this.baseUrl}/battlepass/${userId}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rewardId }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        data: false,
        success: false,
        error: 'Failed to claim reward',
      };
    }
  }

  // Leaderboard
  static async getLeaderboard(limit = 50): Promise<ApiResponse<User[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/leaderboard?limit=${limit}`);
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        data: [],
        success: false,
        error: 'Failed to get leaderboard',
      };
    }
  }
}

// Utility hooks for API integration
export function useGameAPI() {
  return {
    createUser: GameAPI.createUser,
    getUser: GameAPI.getUser,
    updateUser: GameAPI.updateUser,
    getUserNFTs: GameAPI.getUserNFTs,
    getNFTStats: GameAPI.getNFTStats,
    findMatch: GameAPI.findMatch,
    cancelMatchmaking: GameAPI.cancelMatchmaking,
    createMatch: GameAPI.createMatch,
    updateMatch: GameAPI.updateMatch,
    getMatchHistory: GameAPI.getMatchHistory,
    getBattlePass: GameAPI.getBattlePass,
    claimReward: GameAPI.claimReward,
    getLeaderboard: GameAPI.getLeaderboard,
  };
}

export function useMiniKitAPI() {
  const minikit = useMiniKit();
  const api = MiniKitAPI.getInstance();
  api.setMiniKit(minikit);

  return {
    connectWallet: api.connectWallet.bind(api),
    postFrame: api.postFrame.bind(api),
    sendChatMessage: api.sendChatMessage.bind(api),
  };
}
