import React, { createContext, useContext, useEffect, useState } from 'react';
import { Orientation, getOrientation } from '@/utils/layout';

interface OrientationContextType {
  orientation: Orientation;
}

const OrientationContext = createContext<OrientationContextType>({ orientation: 'portrait' });

export const useOrientation = () => useContext(OrientationContext);

export function OrientationProvider({ children }: { children: React.ReactNode }) {
  const [orientation, setOrientation] = useState<Orientation>('portrait');

  useEffect(() => {
    const updateOrientation = () => {
      setOrientation(getOrientation(window.innerWidth, window.innerHeight));
    };

    // Initial orientation
    updateOrientation();

    // Listen for orientation changes
    window.addEventListener('resize', updateOrientation);
    if (typeof window.screen.orientation !== 'undefined') {
      window.screen.orientation.addEventListener('change', updateOrientation);
    }

    return () => {
      window.removeEventListener('resize', updateOrientation);
      if (typeof window.screen.orientation !== 'undefined') {
        window.screen.orientation.removeEventListener('change', updateOrientation);
      }
    };
  }, []);

  return (
    <OrientationContext.Provider value={{ orientation }}>
      {children}
    </OrientationContext.Provider>
  );
}
