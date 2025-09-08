'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ActionButton } from './ActionButton';
import { 
  ChevronRight, 
  ChevronLeft, 
  Sword, 
  Shield, 
  Zap, 
  Trophy, 
  Users, 
  Gamepad2,
  CheckCircle,
  Play,
  X
} from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface OnboardingFlowProps {
  onComplete: () => void;
  onSkip?: () => void;
  className?: string;
}

export function OnboardingFlow({ onComplete, onSkip, className }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Crypto Combat Arena!',
      description: 'Get ready to battle with your NFT characters in epic combat scenarios.',
      icon: <Gamepad2 className="w-8 h-8" />,
      content: (
        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-neon-blue to-neon-purple rounded-full flex items-center justify-center mb-6">
            <Gamepad2 className="w-12 h-12 text-white" />
          </div>
          <p className="text-text-secondary">
            Experience thrilling battles, collect rewards, and climb the leaderboards in this 
            cyberpunk-themed combat arena.
          </p>
        </div>
      ),
    },
    {
      id: 'nft-selection',
      title: 'Choose Your Fighter',
      description: 'Select an NFT character to represent you in battle.',
      icon: <Users className="w-8 h-8" />,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card p-4 text-center hover:border-neon-blue/50 transition-colors cursor-pointer">
                <div className="w-16 h-16 bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <Users className="w-8 h-8 text-neon-blue" />
                </div>
                <p className="text-sm text-text-secondary">Fighter #{i}</p>
              </div>
            ))}
          </div>
          <p className="text-text-secondary text-sm text-center">
            Each NFT has unique stats and abilities that affect battle performance.
          </p>
        </div>
      ),
    },
    {
      id: 'battle-basics',
      title: 'Battle Mechanics',
      description: 'Learn the core combat system and action types.',
      icon: <Sword className="w-8 h-8" />,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-4 text-center">
              <Sword className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <h4 className="font-semibold text-text-primary mb-1">Attack</h4>
              <p className="text-xs text-text-secondary">Deal damage to your opponent (20 Energy)</p>
            </div>
            <div className="glass-card p-4 text-center">
              <Shield className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h4 className="font-semibold text-text-primary mb-1">Defend</h4>
              <p className="text-xs text-text-secondary">Reduce incoming damage (10 Energy)</p>
            </div>
            <div className="glass-card p-4 text-center">
              <Zap className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <h4 className="font-semibold text-text-primary mb-1">Special</h4>
              <p className="text-xs text-text-secondary">Powerful ability (40 Energy)</p>
            </div>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <p className="text-yellow-400 text-sm">
              💡 <strong>Tip:</strong> Energy regenerates each turn, so manage it wisely!
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'battle-pass',
      title: 'Battle Pass & Rewards',
      description: 'Earn XP, unlock rewards, and progress through tiers.',
      icon: <Trophy className="w-8 h-8" />,
      content: (
        <div className="space-y-4">
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-text-secondary text-sm">Battle Pass Progress</span>
              <span className="text-accent font-semibold">Level 1</span>
            </div>
            <div className="w-full h-2 bg-surface rounded-full overflow-hidden mb-2">
              <div className="h-full bg-gradient-to-r from-accent to-accent-600 w-1/3 transition-all duration-500" />
            </div>
            <p className="text-xs text-text-secondary">250 / 1000 XP to next level</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-card p-3 text-center">
              <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
              <p className="text-xs text-text-secondary">Exclusive NFTs</p>
            </div>
            <div className="glass-card p-3 text-center">
              <Zap className="w-6 h-6 text-purple-400 mx-auto mb-1" />
              <p className="text-xs text-text-secondary">Special Abilities</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'ready-to-battle',
      title: 'Ready to Battle!',
      description: 'You\'re all set to start your combat journey.',
      icon: <CheckCircle className="w-8 h-8" />,
      content: (
        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <p className="text-text-secondary">
            You've completed the tutorial! Time to put your skills to the test in real battles.
          </p>
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <p className="text-green-400 text-sm">
              🎉 <strong>Bonus:</strong> You've earned 100 XP for completing the tutorial!
            </p>
          </div>
        </div>
      ),
      action: {
        label: 'Start First Battle',
        onClick: onComplete,
      },
    },
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex <= currentStep || completedSteps.has(stepIndex)) {
      setCurrentStep(stepIndex);
    }
  };

  return (
    <div className={cn('fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4', className)}>
      <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-border/30">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-text-primary">Getting Started</h2>
            {onSkip && (
              <button
                onClick={onSkip}
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center space-x-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => handleStepClick(index)}
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all',
                    index === currentStep
                      ? 'bg-primary text-white'
                      : index < currentStep || completedSteps.has(index)
                      ? 'bg-green-500 text-white'
                      : 'bg-surface text-text-secondary hover:bg-surface-hover'
                  )}
                  disabled={index > currentStep && !completedSteps.has(index)}
                >
                  {index < currentStep || completedSteps.has(index) ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </button>
                {index < steps.length - 1 && (
                  <div className={cn(
                    'w-8 h-0.5 mx-1 transition-colors',
                    index < currentStep ? 'bg-green-500' : 'bg-surface'
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mb-4">
              {currentStepData.icon}
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">
              {currentStepData.title}
            </h3>
            <p className="text-text-secondary">
              {currentStepData.description}
            </p>
          </div>

          <div className="mb-8">
            {currentStepData.content}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border/30">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={isFirstStep}
              className={cn(
                'flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors',
                isFirstStep
                  ? 'text-text-secondary cursor-not-allowed'
                  : 'text-text-primary hover:bg-surface'
              )}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center space-x-3">
              {onSkip && !isLastStep && (
                <button
                  onClick={onSkip}
                  className="text-text-secondary hover:text-text-primary transition-colors"
                >
                  Skip Tutorial
                </button>
              )}
              
              {currentStepData.action ? (
                <ActionButton
                  variant="primary"
                  onClick={currentStepData.action.onClick}
                  icon={<Play className="w-4 h-4" />}
                  iconPosition="left"
                  glow
                >
                  {currentStepData.action.label}
                </ActionButton>
              ) : (
                <ActionButton
                  variant="primary"
                  onClick={handleNext}
                  icon={<ChevronRight className="w-4 h-4" />}
                  iconPosition="right"
                >
                  {isLastStep ? 'Complete' : 'Next'}
                </ActionButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Tutorial Tooltip Component
interface TutorialTooltipProps {
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  onNext?: () => void;
  onSkip?: () => void;
  step?: number;
  totalSteps?: number;
  className?: string;
}

export function TutorialTooltip({
  title,
  description,
  position = 'bottom',
  onNext,
  onSkip,
  step,
  totalSteps,
  className,
}: TutorialTooltipProps) {
  const positionClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2',
  };

  return (
    <div className={cn(
      'absolute z-50 w-64 glass-card p-4 rounded-lg shadow-lg',
      positionClasses[position],
      className
    )}>
      {/* Arrow */}
      <div className={cn(
        'absolute w-2 h-2 bg-surface border border-border/30 rotate-45',
        position === 'top' && 'top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2',
        position === 'bottom' && 'bottom-full left-1/2 transform -translate-x-1/2 translate-y-1/2',
        position === 'left' && 'left-full top-1/2 transform -translate-y-1/2 -translate-x-1/2',
        position === 'right' && 'right-full top-1/2 transform -translate-y-1/2 translate-x-1/2'
      )} />

      <div className="space-y-3">
        {step && totalSteps && (
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span>Step {step} of {totalSteps}</span>
            <div className="flex space-x-1">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'w-1.5 h-1.5 rounded-full',
                    i < step ? 'bg-primary' : 'bg-surface'
                  )}
                />
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 className="font-semibold text-text-primary mb-1">{title}</h4>
          <p className="text-sm text-text-secondary">{description}</p>
        </div>

        <div className="flex items-center justify-between">
          {onSkip && (
            <button
              onClick={onSkip}
              className="text-xs text-text-secondary hover:text-text-primary transition-colors"
            >
              Skip
            </button>
          )}
          
          {onNext && (
            <ActionButton
              variant="primary"
              size="sm"
              onClick={onNext}
              icon={<ChevronRight className="w-3 h-3" />}
              iconPosition="right"
            >
              Next
            </ActionButton>
          )}
        </div>
      </div>
    </div>
  );
}

export default OnboardingFlow;
