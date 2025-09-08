import { NFT, BattleState, BattleCharacter, BattleAction, BattleRound, NFTAbility } from './types';
import { GAME_CONFIG } from './constants';

export interface BattleEngine {
  initializeBattle(playerNFT: NFT, opponentNFT: NFT): BattleState;
  processRound(battleState: BattleState, playerAction: BattleAction, opponentAction: BattleAction): BattleState;
  calculateDamage(attacker: BattleCharacter, defender: BattleCharacter, action: BattleAction): number;
  applyStatusEffects(character: BattleCharacter): BattleCharacter;
  checkBattleEnd(battleState: BattleState): { isEnded: boolean; winner?: 'player1' | 'player2' };
}

export class CombatEngine implements BattleEngine {
  initializeBattle(playerNFT: NFT, opponentNFT: NFT): BattleState {
    const player1: BattleCharacter = {
      nft: playerNFT,
      currentHealth: playerNFT.stats.health,
      currentEnergy: GAME_CONFIG.MAX_ENERGY,
      statusEffects: [],
      cooldowns: {},
    };

    const player2: BattleCharacter = {
      nft: opponentNFT,
      currentHealth: opponentNFT.stats.health,
      currentEnergy: GAME_CONFIG.MAX_ENERGY,
      statusEffects: [],
      cooldowns: {},
    };

    return {
      player1,
      player2,
      currentRound: 1,
      phase: 'preparation',
      timer: GAME_CONFIG.BATTLE_TIMER,
    };
  }

  processRound(battleState: BattleState, playerAction: BattleAction, opponentAction: BattleAction): BattleState {
    const newState = { ...battleState };
    
    // Apply status effects at start of round
    newState.player1 = this.applyStatusEffects(newState.player1);
    newState.player2 = this.applyStatusEffects(newState.player2);

    // Determine action order based on speed
    const player1Speed = newState.player1.nft.stats.speed;
    const player2Speed = newState.player2.nft.stats.speed;
    
    const actions = player1Speed >= player2Speed 
      ? [
          { character: 'player1', action: playerAction, target: 'player2' },
          { character: 'player2', action: opponentAction, target: 'player1' }
        ]
      : [
          { character: 'player2', action: opponentAction, target: 'player1' },
          { character: 'player1', action: playerAction, target: 'player2' }
        ];

    // Process actions in order
    for (const { character, action, target } of actions) {
      const attacker = character === 'player1' ? newState.player1 : newState.player2;
      const defender = target === 'player1' ? newState.player1 : newState.player2;

      // Check if character has enough energy
      if (attacker.currentEnergy < action.energyUsed) {
        continue; // Skip action if not enough energy
      }

      // Process the action
      this.processAction(attacker, defender, action);

      // Deduct energy
      attacker.currentEnergy -= action.energyUsed;

      // Check if defender is defeated
      if (defender.currentHealth <= 0) {
        break; // End round early if someone is defeated
      }
    }

    // Regenerate energy
    newState.player1.currentEnergy = Math.min(
      newState.player1.currentEnergy + GAME_CONFIG.ENERGY_REGEN,
      GAME_CONFIG.MAX_ENERGY
    );
    newState.player2.currentEnergy = Math.min(
      newState.player2.currentEnergy + GAME_CONFIG.ENERGY_REGEN,
      GAME_CONFIG.MAX_ENERGY
    );

    // Update cooldowns
    this.updateCooldowns(newState.player1);
    this.updateCooldowns(newState.player2);

    // Increment round
    newState.currentRound += 1;
    newState.phase = 'action';
    newState.timer = GAME_CONFIG.BATTLE_TIMER;

    return newState;
  }

  private processAction(attacker: BattleCharacter, defender: BattleCharacter, action: BattleAction): void {
    switch (action.type) {
      case 'attack':
        this.processAttack(attacker, defender, action);
        break;
      case 'defend':
        this.processDefend(attacker);
        break;
      case 'ability':
        this.processAbility(attacker, defender, action);
        break;
    }
  }

  private processAttack(attacker: BattleCharacter, defender: BattleCharacter, action: BattleAction): void {
    const damage = this.calculateDamage(attacker, defender, action);
    defender.currentHealth = Math.max(0, defender.currentHealth - damage);
  }

  private processDefend(character: BattleCharacter): void {
    // Add defense boost status effect
    character.statusEffects.push({
      id: 'defense_boost',
      name: 'Defending',
      duration: 1,
      effect: 'defense_boost',
    });
  }

  private processAbility(attacker: BattleCharacter, defender: BattleCharacter, action: BattleAction): void {
    if (!action.abilityId) return;

    const ability = attacker.nft.abilities.find(a => a.id === action.abilityId);
    if (!ability) return;

    // Check cooldown
    if (attacker.cooldowns[ability.id] && attacker.cooldowns[ability.id] > 0) {
      return; // Ability on cooldown
    }

    // Apply ability effects
    if (ability.damage) {
      const damage = this.calculateAbilityDamage(attacker, defender, ability);
      defender.currentHealth = Math.max(0, defender.currentHealth - damage);
    }

    if (ability.effect) {
      this.applyAbilityEffect(attacker, defender, ability);
    }

    // Set cooldown
    attacker.cooldowns[ability.id] = ability.cooldown;
  }

  calculateDamage(attacker: BattleCharacter, defender: BattleCharacter, action: BattleAction): number {
    const baseAttack = attacker.nft.stats.attack;
    const defense = defender.nft.stats.defense;
    
    // Check for defense boost
    const defenseMultiplier = defender.statusEffects.some(e => e.effect === 'defense_boost') ? 1.5 : 1;
    const effectiveDefense = defense * defenseMultiplier;
    
    // Calculate damage with some randomness
    const baseDamage = Math.max(1, baseAttack - effectiveDefense * 0.5);
    const randomMultiplier = 0.8 + Math.random() * 0.4; // 80% to 120%
    
    return Math.floor(baseDamage * randomMultiplier);
  }

  private calculateAbilityDamage(attacker: BattleCharacter, defender: BattleCharacter, ability: NFTAbility): number {
    if (!ability.damage) return 0;

    const baseAttack = attacker.nft.stats.attack;
    const defense = defender.nft.stats.defense;
    
    // Abilities ignore some defense
    const effectiveDefense = defense * 0.3;
    const baseDamage = Math.max(1, ability.damage + baseAttack * 0.5 - effectiveDefense);
    const randomMultiplier = 0.9 + Math.random() * 0.2; // 90% to 110%
    
    return Math.floor(baseDamage * randomMultiplier);
  }

  private applyAbilityEffect(attacker: BattleCharacter, defender: BattleCharacter, ability: NFTAbility): void {
    switch (ability.effect) {
      case 'defense_boost':
        attacker.statusEffects.push({
          id: 'ability_defense_boost',
          name: 'Enhanced Defense',
          duration: 3,
          effect: 'defense_boost',
        });
        break;
      case 'damage_absorption':
        attacker.statusEffects.push({
          id: 'damage_absorption',
          name: 'Damage Shield',
          duration: 2,
          effect: 'damage_absorption',
        });
        break;
      case 'speed_boost':
        attacker.statusEffects.push({
          id: 'speed_boost',
          name: 'Enhanced Speed',
          duration: 2,
          effect: 'speed_boost',
        });
        break;
      case 'poison':
        defender.statusEffects.push({
          id: 'poison',
          name: 'Poisoned',
          duration: 3,
          effect: 'poison',
        });
        break;
    }
  }

  applyStatusEffects(character: BattleCharacter): BattleCharacter {
    const newCharacter = { ...character };
    
    // Apply effects and reduce duration
    newCharacter.statusEffects = character.statusEffects
      .map(effect => {
        // Apply effect
        switch (effect.effect) {
          case 'poison':
            newCharacter.currentHealth = Math.max(0, newCharacter.currentHealth - 50);
            break;
          case 'regeneration':
            newCharacter.currentHealth = Math.min(
              newCharacter.nft.stats.health,
              newCharacter.currentHealth + 30
            );
            break;
        }
        
        // Reduce duration
        return { ...effect, duration: effect.duration - 1 };
      })
      .filter(effect => effect.duration > 0); // Remove expired effects

    return newCharacter;
  }

  private updateCooldowns(character: BattleCharacter): void {
    Object.keys(character.cooldowns).forEach(abilityId => {
      if (character.cooldowns[abilityId] > 0) {
        character.cooldowns[abilityId] -= 1;
      }
    });
  }

  checkBattleEnd(battleState: BattleState): { isEnded: boolean; winner?: 'player1' | 'player2' } {
    if (battleState.player1.currentHealth <= 0) {
      return { isEnded: true, winner: 'player2' };
    }
    
    if (battleState.player2.currentHealth <= 0) {
      return { isEnded: true, winner: 'player1' };
    }
    
    // Check for timeout (optional)
    if (battleState.currentRound > 20) {
      // Determine winner by remaining health percentage
      const player1HealthPercent = battleState.player1.currentHealth / battleState.player1.nft.stats.health;
      const player2HealthPercent = battleState.player2.currentHealth / battleState.player2.nft.stats.health;
      
      return {
        isEnded: true,
        winner: player1HealthPercent > player2HealthPercent ? 'player1' : 'player2'
      };
    }
    
    return { isEnded: false };
  }
}

// AI Battle Logic
export class AIBattleEngine {
  private combatEngine: CombatEngine;

  constructor() {
    this.combatEngine = new CombatEngine();
  }

  generateAIAction(aiCharacter: BattleCharacter, playerCharacter: BattleCharacter): BattleAction {
    const availableActions: BattleAction[] = [];

    // Basic attack
    if (aiCharacter.currentEnergy >= 20) {
      availableActions.push({
        type: 'attack',
        damage: aiCharacter.nft.stats.attack,
        energyUsed: 20,
      });
    }

    // Defend
    if (aiCharacter.currentEnergy >= 10) {
      availableActions.push({
        type: 'defend',
        damage: 0,
        energyUsed: 10,
      });
    }

    // Abilities
    aiCharacter.nft.abilities.forEach(ability => {
      if (
        aiCharacter.currentEnergy >= ability.energyCost &&
        (!aiCharacter.cooldowns[ability.id] || aiCharacter.cooldowns[ability.id] <= 0)
      ) {
        availableActions.push({
          type: 'ability',
          abilityId: ability.id,
          damage: ability.damage || 0,
          energyUsed: ability.energyCost,
        });
      }
    });

    // AI decision making
    const playerHealthPercent = playerCharacter.currentHealth / playerCharacter.nft.stats.health;
    const aiHealthPercent = aiCharacter.currentHealth / aiCharacter.nft.stats.health;

    // Aggressive when player is low on health
    if (playerHealthPercent < 0.3) {
      const attackActions = availableActions.filter(a => a.type === 'attack' || a.type === 'ability');
      if (attackActions.length > 0) {
        return attackActions[Math.floor(Math.random() * attackActions.length)];
      }
    }

    // Defensive when AI is low on health
    if (aiHealthPercent < 0.3) {
      const defensiveActions = availableActions.filter(a => a.type === 'defend');
      if (defensiveActions.length > 0 && Math.random() < 0.6) {
        return defensiveActions[0];
      }
    }

    // Random action selection with weights
    const weights = {
      attack: 0.4,
      defend: 0.2,
      ability: 0.4,
    };

    const weightedActions = availableActions.filter(action => {
      const rand = Math.random();
      return rand < weights[action.type];
    });

    const selectedActions = weightedActions.length > 0 ? weightedActions : availableActions;
    return selectedActions[Math.floor(Math.random() * selectedActions.length)];
  }

  simulateBattle(playerNFT: NFT, aiNFT: NFT): {
    winner: 'player' | 'ai';
    rounds: BattleRound[];
    finalState: BattleState;
  } {
    let battleState = this.combatEngine.initializeBattle(playerNFT, aiNFT);
    const rounds: BattleRound[] = [];

    while (true) {
      const battleEnd = this.combatEngine.checkBattleEnd(battleState);
      if (battleEnd.isEnded) {
        return {
          winner: battleEnd.winner === 'player1' ? 'player' : 'ai',
          rounds,
          finalState: battleState,
        };
      }

      // Generate AI action
      const aiAction = this.generateAIAction(battleState.player2, battleState.player1);
      
      // Generate simple player action for simulation
      const playerAction: BattleAction = {
        type: 'attack',
        damage: battleState.player1.nft.stats.attack,
        energyUsed: 20,
      };

      // Process round
      const previousState = { ...battleState };
      battleState = this.combatEngine.processRound(battleState, playerAction, aiAction);

      // Record round
      rounds.push({
        roundNumber: previousState.currentRound,
        player1Action: playerAction,
        player2Action: aiAction,
        damage: Math.abs(battleState.player2.currentHealth - previousState.player2.currentHealth),
        winner: battleState.player1.currentHealth > battleState.player2.currentHealth ? 'player1' : 'player2',
      });

      // Safety check to prevent infinite loops
      if (rounds.length > 50) {
        break;
      }
    }

    // Fallback result
    return {
      winner: battleState.player1.currentHealth > battleState.player2.currentHealth ? 'player' : 'ai',
      rounds,
      finalState: battleState,
    };
  }
}

// Export singleton instances
export const combatEngine = new CombatEngine();
export const aiBattleEngine = new AIBattleEngine();
