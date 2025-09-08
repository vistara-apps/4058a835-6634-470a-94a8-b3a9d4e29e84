/**
 * Accessibility utilities for Crypto Combat Arena
 * WCAG 2.1 AA compliant accessibility helpers and utilities
 */

// ARIA live region announcements
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Focus management utilities
export const focusManagement = {
  // Trap focus within an element (for modals, dropdowns)
  trapFocus: (element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    };
    
    element.addEventListener('keydown', handleTabKey);
    
    // Focus first element
    firstFocusable?.focus();
    
    // Return cleanup function
    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  },

  // Save and restore focus
  saveFocus: () => {
    const activeElement = document.activeElement as HTMLElement;
    return () => {
      activeElement?.focus();
    };
  },

  // Focus first error in a form
  focusFirstError: (container: HTMLElement) => {
    const firstError = container.querySelector('[aria-invalid="true"]') as HTMLElement;
    firstError?.focus();
  },
};

// Keyboard navigation utilities
export const keyboardNavigation = {
  // Handle arrow key navigation for lists/grids
  handleArrowKeys: (
    container: HTMLElement,
    items: NodeListOf<HTMLElement> | HTMLElement[],
    orientation: 'horizontal' | 'vertical' | 'grid' = 'vertical',
    columns?: number
  ) => {
    let currentIndex = 0;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      const itemsArray = Array.from(items);
      
      switch (e.key) {
        case 'ArrowDown':
          if (orientation === 'vertical' || orientation === 'grid') {
            e.preventDefault();
            currentIndex = orientation === 'grid' && columns
              ? Math.min(currentIndex + columns, itemsArray.length - 1)
              : Math.min(currentIndex + 1, itemsArray.length - 1);
            itemsArray[currentIndex]?.focus();
          }
          break;
          
        case 'ArrowUp':
          if (orientation === 'vertical' || orientation === 'grid') {
            e.preventDefault();
            currentIndex = orientation === 'grid' && columns
              ? Math.max(currentIndex - columns, 0)
              : Math.max(currentIndex - 1, 0);
            itemsArray[currentIndex]?.focus();
          }
          break;
          
        case 'ArrowRight':
          if (orientation === 'horizontal' || orientation === 'grid') {
            e.preventDefault();
            currentIndex = Math.min(currentIndex + 1, itemsArray.length - 1);
            itemsArray[currentIndex]?.focus();
          }
          break;
          
        case 'ArrowLeft':
          if (orientation === 'horizontal' || orientation === 'grid') {
            e.preventDefault();
            currentIndex = Math.max(currentIndex - 1, 0);
            itemsArray[currentIndex]?.focus();
          }
          break;
          
        case 'Home':
          e.preventDefault();
          currentIndex = 0;
          itemsArray[currentIndex]?.focus();
          break;
          
        case 'End':
          e.preventDefault();
          currentIndex = itemsArray.length - 1;
          itemsArray[currentIndex]?.focus();
          break;
      }
    };
    
    container.addEventListener('keydown', handleKeyDown);
    
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  },

  // Handle escape key for closing modals/dropdowns
  handleEscapeKey: (callback: () => void) => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        callback();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  },
};

// Color contrast utilities
export const colorContrast = {
  // Calculate contrast ratio between two colors
  getContrastRatio: (color1: string, color2: string): number => {
    const getLuminance = (color: string): number => {
      // Convert hex to RGB
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16) / 255;
      const g = parseInt(hex.substr(2, 2), 16) / 255;
      const b = parseInt(hex.substr(4, 2), 16) / 255;
      
      // Calculate relative luminance
      const sRGB = [r, g, b].map(c => {
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      
      return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
    };
    
    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    
    return (brightest + 0.05) / (darkest + 0.05);
  },

  // Check if contrast meets WCAG standards
  meetsWCAG: (color1: string, color2: string, level: 'AA' | 'AAA' = 'AA'): boolean => {
    const ratio = colorContrast.getContrastRatio(color1, color2);
    return level === 'AA' ? ratio >= 4.5 : ratio >= 7;
  },
};

// Screen reader utilities
export const screenReader = {
  // Create visually hidden text for screen readers
  createSROnlyText: (text: string): HTMLElement => {
    const element = document.createElement('span');
    element.className = 'sr-only';
    element.textContent = text;
    return element;
  },

  // Describe complex UI elements
  describeGameState: (state: {
    playerHealth: number;
    enemyHealth: number;
    playerEnergy: number;
    round: number;
  }): string => {
    return `Round ${state.round}. Your health: ${state.playerHealth}%. Enemy health: ${state.enemyHealth}%. Your energy: ${state.playerEnergy}%.`;
  },

  // Describe battle actions
  describeBattleAction: (action: string, damage?: number, target?: string): string => {
    const actionDescriptions = {
      attack: `You attacked${target ? ` ${target}` : ''}${damage ? ` for ${damage} damage` : ''}.`,
      defend: 'You defended, reducing incoming damage.',
      ability: `You used a special ability${damage ? ` dealing ${damage} damage` : ''}.`,
    };
    
    return actionDescriptions[action as keyof typeof actionDescriptions] || `You performed ${action}.`;
  },

  // Describe NFT stats for screen readers
  describeNFTStats: (nft: {
    name: string;
    rarity: string;
    stats: {
      attack: number;
      defense: number;
      speed: number;
      health: number;
    };
  }): string => {
    return `${nft.name}, ${nft.rarity} rarity. Stats: Attack ${nft.stats.attack}, Defense ${nft.stats.defense}, Speed ${nft.stats.speed}, Health ${nft.stats.health}.`;
  },
};

// Form accessibility utilities
export const formAccessibility = {
  // Associate labels with form controls
  associateLabel: (input: HTMLElement, label: HTMLElement) => {
    const inputId = input.id || `input-${Date.now()}`;
    input.id = inputId;
    label.setAttribute('for', inputId);
  },

  // Add error messages to form controls
  addErrorMessage: (input: HTMLElement, message: string) => {
    const errorId = `${input.id}-error`;
    let errorElement = document.getElementById(errorId);
    
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.id = errorId;
      errorElement.className = 'text-destructive text-sm mt-1';
      errorElement.setAttribute('role', 'alert');
      input.parentNode?.insertBefore(errorElement, input.nextSibling);
    }
    
    errorElement.textContent = message;
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', errorId);
  },

  // Remove error messages
  removeErrorMessage: (input: HTMLElement) => {
    const errorId = `${input.id}-error`;
    const errorElement = document.getElementById(errorId);
    
    if (errorElement) {
      errorElement.remove();
    }
    
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
  },
};

// Reduced motion utilities
export const reducedMotion = {
  // Check if user prefers reduced motion
  prefersReducedMotion: (): boolean => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  // Apply reduced motion styles
  applyReducedMotion: (element: HTMLElement) => {
    if (reducedMotion.prefersReducedMotion()) {
      element.style.animation = 'none';
      element.style.transition = 'none';
    }
  },

  // Conditional animation based on user preference
  conditionalAnimation: (element: HTMLElement, animation: string, duration: number = 300) => {
    if (!reducedMotion.prefersReducedMotion()) {
      element.style.animation = `${animation} ${duration}ms ease-out`;
    }
  },
};

// Export all accessibility utilities
export const accessibility = {
  announce: announceToScreenReader,
  focus: focusManagement,
  keyboard: keyboardNavigation,
  contrast: colorContrast,
  screenReader,
  form: formAccessibility,
  motion: reducedMotion,
} as const;

export default accessibility;
