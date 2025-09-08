/**
 * Animation utilities for Crypto Combat Arena
 * Centralized animation functions and configurations
 */

// Animation configuration
export const animationConfig = {
  // Duration presets
  duration: {
    instant: 0,
    fast: 150,
    normal: 200,
    slow: 300,
    slower: 500,
    slowest: 1000,
  },
  
  // Easing presets
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
} as const;

// Battle animation utilities
export const battleAnimations = {
  // Damage number animation
  showDamageNumber: (element: HTMLElement, damage: number, type: 'damage' | 'heal' | 'critical' = 'damage') => {
    const damageEl = document.createElement('div');
    damageEl.textContent = type === 'heal' ? `+${damage}` : `-${damage}`;
    damageEl.className = `damage-number ${
      type === 'heal' ? 'text-green-400' : 
      type === 'critical' ? 'text-red-400 text-3xl' : 'text-red-300'
    }`;
    
    // Position relative to the target element
    const rect = element.getBoundingClientRect();
    damageEl.style.left = `${rect.left + rect.width / 2}px`;
    damageEl.style.top = `${rect.top}px`;
    
    document.body.appendChild(damageEl);
    
    // Remove after animation
    setTimeout(() => {
      if (damageEl.parentNode) {
        damageEl.parentNode.removeChild(damageEl);
      }
    }, 1000);
  },

  // Screen shake effect
  screenShake: (intensity: number = 1, duration: number = 500) => {
    const body = document.body;
    body.style.animation = `shake ${duration}ms ease-in-out`;
    body.style.setProperty('--shake-intensity', `${intensity * 2}px`);
    
    setTimeout(() => {
      body.style.animation = '';
      body.style.removeProperty('--shake-intensity');
    }, duration);
  },

  // Flash effect for actions
  flashEffect: (element: HTMLElement, color: string = 'rgba(255, 255, 255, 0.3)', duration: number = 300) => {
    const flashEl = document.createElement('div');
    flashEl.className = 'action-feedback';
    flashEl.style.backgroundColor = color;
    flashEl.style.animationDuration = `${duration}ms`;
    
    element.style.position = 'relative';
    element.appendChild(flashEl);
    
    setTimeout(() => {
      if (flashEl.parentNode) {
        flashEl.parentNode.removeChild(flashEl);
      }
    }, duration);
  },

  // Pulse effect for important elements
  pulseEffect: (element: HTMLElement, duration: number = 1000) => {
    element.style.animation = `pulse ${duration}ms ease-in-out infinite`;
    
    return () => {
      element.style.animation = '';
    };
  },
};

// UI animation utilities
export const uiAnimations = {
  // Slide in from direction
  slideIn: (element: HTMLElement, direction: 'up' | 'down' | 'left' | 'right' = 'up', duration: number = 300) => {
    const animations = {
      up: 'slide-up',
      down: 'slide-down',
      left: 'slide-left',
      right: 'slide-right',
    };
    
    element.style.animation = `${animations[direction]} ${duration}ms ease-out`;
  },

  // Fade in/out
  fadeIn: (element: HTMLElement, duration: number = 200) => {
    element.style.animation = `fade-in ${duration}ms ease-out`;
  },

  fadeOut: (element: HTMLElement, duration: number = 200) => {
    element.style.animation = `fade-out ${duration}ms ease-out`;
    
    setTimeout(() => {
      element.style.display = 'none';
    }, duration);
  },

  // Scale in/out
  scaleIn: (element: HTMLElement, duration: number = 200) => {
    element.style.animation = `scale-in ${duration}ms ease-out`;
  },

  // Bounce effect
  bounce: (element: HTMLElement, duration: number = 600) => {
    element.style.animation = `bounce ${duration}ms ease-out`;
  },

  // Glow effect
  glow: (element: HTMLElement, color: string = '#00d4ff', intensity: number = 1) => {
    element.style.boxShadow = `0 0 ${20 * intensity}px ${color}`;
    element.style.transition = 'box-shadow 0.3s ease-out';
  },

  removeGlow: (element: HTMLElement) => {
    element.style.boxShadow = '';
  },
};

// Particle system for visual effects
export const particleEffects = {
  // Create floating particles
  createParticles: (
    container: HTMLElement, 
    count: number = 10, 
    color: string = '#00d4ff',
    duration: number = 2000
  ) => {
    const particles: HTMLElement[] = [];
    
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute w-1 h-1 rounded-full pointer-events-none';
      particle.style.backgroundColor = color;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animation = `float ${duration}ms ease-out forwards`;
      particle.style.animationDelay = `${Math.random() * 500}ms`;
      
      container.appendChild(particle);
      particles.push(particle);
    }
    
    // Clean up particles after animation
    setTimeout(() => {
      particles.forEach(particle => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      });
    }, duration + 500);
  },

  // Victory celebration effect
  celebrationEffect: (container: HTMLElement) => {
    const colors = ['#00d4ff', '#ff0080', '#8000ff', '#00ffff', '#00ff80'];
    
    // Create multiple bursts of particles
    for (let burst = 0; burst < 3; burst++) {
      setTimeout(() => {
        particleEffects.createParticles(
          container, 
          15, 
          colors[Math.floor(Math.random() * colors.length)],
          1500
        );
      }, burst * 200);
    }
  },
};

// Loading animation utilities
export const loadingAnimations = {
  // Create skeleton loader
  createSkeleton: (element: HTMLElement, lines: number = 3) => {
    element.innerHTML = '';
    element.className += ' animate-pulse';
    
    for (let i = 0; i < lines; i++) {
      const line = document.createElement('div');
      line.className = 'h-4 bg-surface rounded mb-2';
      line.style.width = `${60 + Math.random() * 40}%`;
      element.appendChild(line);
    }
  },

  // Remove skeleton and show content
  removeSkeleton: (element: HTMLElement, content: string) => {
    element.className = element.className.replace('animate-pulse', '');
    element.innerHTML = content;
    uiAnimations.fadeIn(element);
  },

  // Spinner with custom colors
  createSpinner: (size: number = 24, color: string = '#00d4ff') => {
    const spinner = document.createElement('div');
    spinner.className = 'animate-spin rounded-full border-2 border-transparent';
    spinner.style.width = `${size}px`;
    spinner.style.height = `${size}px`;
    spinner.style.borderTopColor = color;
    spinner.style.borderRightColor = color;
    
    return spinner;
  },
};

// Transition utilities for page/component changes
export const transitions = {
  // Page transition
  pageTransition: async (
    outElement: HTMLElement, 
    inElement: HTMLElement, 
    direction: 'forward' | 'backward' = 'forward'
  ) => {
    // Animate out
    outElement.style.animation = direction === 'forward' 
      ? 'slide-out-left 300ms ease-in forwards'
      : 'slide-out-right 300ms ease-in forwards';
    
    // Wait for out animation
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Hide out element and show in element
    outElement.style.display = 'none';
    inElement.style.display = 'block';
    
    // Animate in
    inElement.style.animation = direction === 'forward'
      ? 'slide-in-right 300ms ease-out forwards'
      : 'slide-in-left 300ms ease-out forwards';
  },

  // Modal transitions
  modalTransition: {
    enter: (element: HTMLElement) => {
      element.style.animation = 'scale-in 200ms ease-out forwards';
    },
    
    exit: (element: HTMLElement) => {
      element.style.animation = 'scale-out 200ms ease-in forwards';
      
      return new Promise(resolve => {
        setTimeout(() => {
          element.style.display = 'none';
          resolve(void 0);
        }, 200);
      });
    },
  },
};

// Export all animation utilities
export const animations = {
  config: animationConfig,
  battle: battleAnimations,
  ui: uiAnimations,
  particles: particleEffects,
  loading: loadingAnimations,
  transitions,
} as const;

export default animations;
