
import { useState, useEffect } from 'react';

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface ScreenSize {
  width: number;
  height: number;
  lessThan: (breakpoint: Breakpoint) => boolean;
  moreThan: (breakpoint: Breakpoint) => boolean;
}

const breakpoints: Record<Breakpoint, number> = {
  'sm': 640,
  'md': 768,
  'lg': 1024,
  'xl': 1280,
  '2xl': 1536
};

export function useScreenSize(): ScreenSize {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    ...dimensions,
    lessThan: (breakpoint: Breakpoint) => dimensions.width < breakpoints[breakpoint],
    moreThan: (breakpoint: Breakpoint) => dimensions.width > breakpoints[breakpoint]
  };
}
