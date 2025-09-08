/**
 * Mobile utilities for enhanced mobile experience
 */

// Device detection utilities
export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 768;
};

export const isTablet = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth > 768 && window.innerWidth <= 1024;
};

export const isDesktop = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth > 1024;
};

export const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

export const isIOS = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

export const isAndroid = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /Android/.test(navigator.userAgent);
};

// Viewport utilities
export const getViewportHeight = (): number => {
  if (typeof window === 'undefined') return 0;
  return window.innerHeight;
};

export const getViewportWidth = (): number => {
  if (typeof window === 'undefined') return 0;
  return window.innerWidth;
};

export const getDevicePixelRatio = (): number => {
  if (typeof window === 'undefined') return 1;
  return window.devicePixelRatio || 1;
};

// Touch gesture utilities
export interface TouchGesture {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  deltaX: number;
  deltaY: number;
  distance: number;
  direction: 'left' | 'right' | 'up' | 'down' | 'none';
  duration: number;
}

export const detectSwipeGesture = (
  startTouch: Touch,
  endTouch: Touch,
  startTime: number,
  endTime: number,
  minDistance: number = 50
): TouchGesture => {
  const deltaX = endTouch.clientX - startTouch.clientX;
  const deltaY = endTouch.clientY - startTouch.clientY;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const duration = endTime - startTime;

  let direction: TouchGesture['direction'] = 'none';
  
  if (distance >= minDistance) {
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      direction = deltaX > 0 ? 'right' : 'left';
    } else {
      direction = deltaY > 0 ? 'down' : 'up';
    }
  }

  return {
    startX: startTouch.clientX,
    startY: startTouch.clientY,
    endX: endTouch.clientX,
    endY: endTouch.clientY,
    deltaX,
    deltaY,
    distance,
    direction,
    duration,
  };
};

// Haptic feedback utilities
export const triggerHapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'light'): void => {
  if (typeof window === 'undefined') return;
  
  // Check if the device supports haptic feedback
  if ('vibrate' in navigator) {
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30],
    };
    navigator.vibrate(patterns[type]);
  }
  
  // For iOS devices with haptic feedback support
  if ('hapticFeedback' in window) {
    try {
      (window as any).hapticFeedback(type);
    } catch (error) {
      console.warn('Haptic feedback not supported:', error);
    }
  }
};

// Screen orientation utilities
export const getScreenOrientation = (): 'portrait' | 'landscape' => {
  if (typeof window === 'undefined') return 'portrait';
  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
};

export const lockScreenOrientation = (orientation: 'portrait' | 'landscape'): Promise<void> => {
  if (typeof window === 'undefined') return Promise.resolve();
  
  if ('screen' in window && 'orientation' in window.screen && 'lock' in window.screen.orientation) {
    return window.screen.orientation.lock(orientation);
  }
  
  return Promise.reject(new Error('Screen orientation lock not supported'));
};

// Safe area utilities (for devices with notches)
export const getSafeAreaInsets = () => {
  if (typeof window === 'undefined') return { top: 0, right: 0, bottom: 0, left: 0 };
  
  const style = getComputedStyle(document.documentElement);
  return {
    top: parseInt(style.getPropertyValue('--safe-area-inset-top') || '0', 10),
    right: parseInt(style.getPropertyValue('--safe-area-inset-right') || '0', 10),
    bottom: parseInt(style.getPropertyValue('--safe-area-inset-bottom') || '0', 10),
    left: parseInt(style.getPropertyValue('--safe-area-inset-left') || '0', 10),
  };
};

// Performance utilities for mobile
export const requestIdleCallback = (callback: () => void, timeout: number = 5000): void => {
  if (typeof window === 'undefined') return;
  
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(callback, { timeout });
  } else {
    // Fallback for browsers that don't support requestIdleCallback
    setTimeout(callback, 1);
  }
};

// Mobile-specific event handlers
export const addTouchEventListeners = (
  element: HTMLElement,
  handlers: {
    onTouchStart?: (e: TouchEvent) => void;
    onTouchMove?: (e: TouchEvent) => void;
    onTouchEnd?: (e: TouchEvent) => void;
    onSwipe?: (gesture: TouchGesture) => void;
  }
) => {
  let startTouch: Touch | null = null;
  let startTime: number = 0;

  const handleTouchStart = (e: TouchEvent) => {
    startTouch = e.touches[0];
    startTime = Date.now();
    handlers.onTouchStart?.(e);
  };

  const handleTouchMove = (e: TouchEvent) => {
    handlers.onTouchMove?.(e);
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (startTouch && handlers.onSwipe) {
      const endTouch = e.changedTouches[0];
      const endTime = Date.now();
      const gesture = detectSwipeGesture(startTouch, endTouch, startTime, endTime);
      
      if (gesture.direction !== 'none') {
        handlers.onSwipe(gesture);
      }
    }
    
    handlers.onTouchEnd?.(e);
    startTouch = null;
  };

  element.addEventListener('touchstart', handleTouchStart, { passive: true });
  element.addEventListener('touchmove', handleTouchMove, { passive: true });
  element.addEventListener('touchend', handleTouchEnd, { passive: true });

  // Return cleanup function
  return () => {
    element.removeEventListener('touchstart', handleTouchStart);
    element.removeEventListener('touchmove', handleTouchMove);
    element.removeEventListener('touchend', handleTouchEnd);
  };
};

// Mobile-optimized scroll utilities
export const smoothScrollTo = (element: HTMLElement, top: number, duration: number = 300) => {
  const start = element.scrollTop;
  const change = top - start;
  const startTime = performance.now();

  const animateScroll = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function (ease-out)
    const easeOut = 1 - Math.pow(1 - progress, 3);
    
    element.scrollTop = start + change * easeOut;

    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  };

  requestAnimationFrame(animateScroll);
};

// Battery status utilities
export const getBatteryStatus = async (): Promise<{
  level: number;
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
} | null> => {
  if (typeof navigator === 'undefined' || !('getBattery' in navigator)) {
    return null;
  }

  try {
    const battery = await (navigator as any).getBattery();
    return {
      level: battery.level,
      charging: battery.charging,
      chargingTime: battery.chargingTime,
      dischargingTime: battery.dischargingTime,
    };
  } catch (error) {
    console.warn('Battery API not supported:', error);
    return null;
  }
};

// Network status utilities
export const getNetworkStatus = (): {
  online: boolean;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
} => {
  if (typeof navigator === 'undefined') {
    return { online: true };
  }

  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  
  return {
    online: navigator.onLine,
    effectiveType: connection?.effectiveType,
    downlink: connection?.downlink,
    rtt: connection?.rtt,
  };
};

// Mobile-specific CSS utilities
export const addMobileCSS = () => {
  if (typeof document === 'undefined') return;

  const style = document.createElement('style');
  style.textContent = `
    /* Mobile-specific styles */
    @media (max-width: 768px) {
      /* Prevent zoom on input focus */
      input, select, textarea {
        font-size: 16px !important;
      }
      
      /* Improve touch targets */
      button, a, [role="button"] {
        min-height: 44px;
        min-width: 44px;
      }
      
      /* Optimize scrolling */
      * {
        -webkit-overflow-scrolling: touch;
      }
      
      /* Prevent text selection on touch */
      .no-select {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-touch-callout: none;
      }
      
      /* Safe area support */
      .safe-area-top {
        padding-top: env(safe-area-inset-top);
      }
      
      .safe-area-bottom {
        padding-bottom: env(safe-area-inset-bottom);
      }
      
      .safe-area-left {
        padding-left: env(safe-area-inset-left);
      }
      
      .safe-area-right {
        padding-right: env(safe-area-inset-right);
      }
    }
  `;
  
  document.head.appendChild(style);
};

// Initialize mobile optimizations
export const initializeMobileOptimizations = () => {
  if (typeof window === 'undefined') return;

  // Add mobile CSS
  addMobileCSS();

  // Prevent zoom on double tap
  let lastTouchEnd = 0;
  document.addEventListener('touchend', (event) => {
    const now = new Date().getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, false);

  // Prevent context menu on long press
  document.addEventListener('contextmenu', (event) => {
    if (isTouchDevice()) {
      event.preventDefault();
    }
  });

  // Add viewport meta tag if not present
  if (!document.querySelector('meta[name="viewport"]')) {
    const viewport = document.createElement('meta');
    viewport.name = 'viewport';
    viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    document.head.appendChild(viewport);
  }
};

export default {
  isMobile,
  isTablet,
  isDesktop,
  isTouchDevice,
  isIOS,
  isAndroid,
  getViewportHeight,
  getViewportWidth,
  getDevicePixelRatio,
  detectSwipeGesture,
  triggerHapticFeedback,
  getScreenOrientation,
  lockScreenOrientation,
  getSafeAreaInsets,
  requestIdleCallback,
  addTouchEventListeners,
  smoothScrollTo,
  getBatteryStatus,
  getNetworkStatus,
  addMobileCSS,
  initializeMobileOptimizations,
};
