'use client';

import { useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { useGameAPI } from '@/lib/api';
import { formatAddress, formatNumber } from '@/lib/utils';
import { Trophy, Medal, Award, Crown, TrendingUp, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface LeaderboardProps {
  currentUser?: User;
}

export function Leaderboard({ currentUser }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'all' | 'weekly' | 'monthly'>('all');
  const { getLeaderboard } = useGameAPI();

  useEffect(() => {
    loadLeaderboard();
  }, [timeframe]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const result = await getLeaderboard(50);
      if (result.success) {
        setLeaderboard(result.data);
      }
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-text-secondary">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-400 to-yellow-600';
      case 2:
        return 'from-gray-300 to-gray-500';
      case 3:
        return 'from-amber-500 to-amber-700';
      default:
        return 'from-gray-600 to-gray-800';
    }
  };

  const getWinRate = (user: User) => {
    const totalGames = user.wins + user.losses;
    return totalGames > 0 ? Math.round((user.wins / totalGames) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="glass-card p-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-text-secondary">Loading leaderboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Trophy className="w-8 h-8 text-accent" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent">
            Arena Champions
          </h2>
        </div>
        <p className="text-text-secondary">The most skilled fighters in Crypto Combat Arena</p>
      </div>

      {/* Timeframe Selector */}
      <div className="flex justify-center">
        <div className="glass-card p-1 inline-flex rounded-lg">
          {(['all', 'weekly', 'monthly'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                timeframe === period
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface'
              }`}
            >
              {period === 'all' ? 'All Time' : period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium */}
      {leaderboard.length >= 3 && (
        <div className="glass-card p-6">
          <div className="flex items-end justify-center space-x-4 mb-6">
            {/* 2nd Place */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-r from-gray-300 to-gray-500 rounded-full flex items-center justify-center">
                <Medal className="w-10 h-10 text-white" />
              </div>
              <div className="bg-gradient-to-r from-gray-300 to-gray-500 rounded-lg p-4 h-24 flex flex-col justify-center">
                <div className="text-white font-bold text-sm truncate">
                  {formatAddress(leaderboard[1].walletAddress)}
                </div>
                <div className="text-gray-100 text-xs">{formatNumber(leaderboard[1].ranking)} pts</div>
              </div>
            </motion.div>

            {/* 1st Place */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="w-24 h-24 mx-auto mb-3 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center animate-glow">
                <Crown className="w-12 h-12 text-white" />
              </div>
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg p-4 h-32 flex flex-col justify-center">
                <div className="text-white font-bold truncate">
                  {formatAddress(leaderboard[0].walletAddress)}
                </div>
                <div className="text-yellow-100 text-sm">{formatNumber(leaderboard[0].ranking)} pts</div>
                <div className="text-yellow-100 text-xs">{leaderboard[0].wins}W / {leaderboard[0].losses}L</div>
              </div>
            </motion.div>

            {/* 3rd Place */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-r from-amber-500 to-amber-700 rounded-full flex items-center justify-center">
                <Award className="w-10 h-10 text-white" />
              </div>
              <div className="bg-gradient-to-r from-amber-500 to-amber-700 rounded-lg p-4 h-24 flex flex-col justify-center">
                <div className="text-white font-bold text-sm truncate">
                  {formatAddress(leaderboard[2].walletAddress)}
                </div>
                <div className="text-amber-100 text-xs">{formatNumber(leaderboard[2].ranking)} pts</div>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Full Leaderboard */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-text-primary flex items-center space-x-2">
            <Users className="w-5 h-5 text-accent" />
            <span>Full Rankings</span>
          </h3>
          <div className="text-sm text-text-secondary">
            {leaderboard.length} fighters
          </div>
        </div>

        <div className="space-y-2">
          {leaderboard.map((user, index) => {
            const rank = index + 1;
            const isCurrentUser = currentUser && user.userId === currentUser.userId;
            const winRate = getWinRate(user);

            return (
              <motion.div
                key={user.userId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center space-x-4 p-4 rounded-lg transition-all duration-200 ${
                  isCurrentUser
                    ? 'bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 border border-neon-blue/30'
                    : rank <= 3
                    ? 'bg-gradient-to-r from-surface to-gray-800/50'
                    : 'bg-surface hover:bg-gray-700/50'
                }`}
              >
                {/* Rank */}
                <div className="flex items-center justify-center w-12">
                  {getRankIcon(rank)}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-text-primary truncate">
                      {formatAddress(user.walletAddress)}
                    </span>
                    {isCurrentUser && (
                      <span className="px-2 py-1 bg-neon-blue/20 text-neon-blue text-xs rounded-full">
                        You
                      </span>
                    )}
                    {user.farcasterId && (
                      <span className="px-2 py-1 bg-neon-purple/20 text-neon-purple text-xs rounded-full">
                        FC
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-text-secondary">
                    Level {user.battlePassLevel} • {user.wins}W / {user.losses}L
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center space-x-6 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-accent">{formatNumber(user.ranking)}</div>
                    <div className="text-text-secondary text-xs">Points</div>
                  </div>
                  <div className="text-center">
                    <div className={`font-bold ${winRate >= 70 ? 'text-green-400' : winRate >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {winRate}%
                    </div>
                    <div className="text-text-secondary text-xs">Win Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-text-primary">{formatNumber(user.xp)}</div>
                    <div className="text-text-secondary text-xs">XP</div>
                  </div>
                </div>

                {/* Trend Indicator */}
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {leaderboard.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">No Rankings Yet</h3>
            <p className="text-text-secondary">
              Be the first to battle and claim your spot on the leaderboard!
            </p>
          </div>
        )}
      </div>

      {/* Current User Rank (if not in top visible) */}
      {currentUser && !leaderboard.some(u => u.userId === currentUser.userId) && (
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-neon-blue rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">?</span>
              </div>
              <div>
                <div className="font-semibold text-text-primary">Your Rank</div>
                <div className="text-sm text-text-secondary">
                  {formatNumber(currentUser.ranking)} points • Level {currentUser.battlePassLevel}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-text-secondary">Win Rate</div>
              <div className="font-bold text-accent">{getWinRate(currentUser)}%</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
