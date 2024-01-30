import { useLayoutEffect } from '@client/hooks/use-isomorphic-layout-effect';
import { useCallback, useEffect, useState } from 'react';

export interface WindowSize {
  height: number;
  width: number;
}

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState<WindowSize>({ height: 0, width: 0 });

  const updateWindowSize = useCallback(() => {
    setWindowSize({
      height: window.innerHeight,
      width: window.innerWidth,
    });
  }, []);

  useLayoutEffect(updateWindowSize, [updateWindowSize]);

  useEffect(() => {
    window.addEventListener('resize', updateWindowSize);
    return () => window.removeEventListener('resize', updateWindowSize);
  }, [updateWindowSize]);

  return windowSize;
}
