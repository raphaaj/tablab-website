import { useEffect, useState } from 'react';

export interface WindowSize {
  height: number | null;
  width: number | null;
}

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState<WindowSize>({ height: null, width: null });

  useEffect(() => {
    function syncWindowSize() {
      setWindowSize({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    }

    syncWindowSize();

    window.addEventListener('resize', syncWindowSize);

    return () => window.removeEventListener('resize', syncWindowSize);
  }, []);

  return windowSize;
}
