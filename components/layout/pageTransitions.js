import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

// Spring animation preset for natural feel
const springConfig = {
  type: 'spring',
  stiffness: 300,
  damping: 30
};

// Slide transitions
export const slideTransition = {
  initial: { opacity: 0, x: -20 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: springConfig
  },
  exit: { 
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.2
    }
  }
};

// Fade transitions
export const fadeTransition = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      duration: 0.3
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: 0.2
    }
  }
};

// Scale transitions
export const scaleTransition = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: springConfig
  },
  exit: { 
    opacity: 0,
    scale: 1.05,
    transition: {
      duration: 0.2
    }
  }
};

// Custom hook for page transition direction
export const usePageTransition = () => {
  const router = useRouter();
  const [direction, setDirection] = useState('forward');
  const [lastPath, setLastPath] = useState(router.pathname);

  useEffect(() => {
    const handleRouteChange = (url) => {
      const newDirection = navigationConfig.findIndex(item => item.path === url) >
        navigationConfig.findIndex(item => item.path === lastPath)
          ? 'forward'
          : 'backward';
      
      setDirection(newDirection);
      setLastPath(url);
    };

    router.events.on('routeChangeStart', handleRouteChange);
    return () => router.events.off('routeChangeStart', handleRouteChange);
  }, [router, lastPath]);

  return {
    transition: {
      initial: { 
        opacity: 0,
        x: direction === 'forward' ? 20 : -20
      },
      animate: {
        opacity: 1,
        x: 0,
        transition: springConfig
      },
      exit: {
        opacity: 0,
        x: direction === 'forward' ? -20 : 20,
        transition: {
          duration: 0.2
        }
      }
    }
  };
};

