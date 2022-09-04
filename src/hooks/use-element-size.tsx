import { useEffect, useState } from 'react';
import { useWindowSize } from 'src/hooks/use-window-size';

export type ElementSize = {
  height: number | null;
  width: number | null;
};

export function useElementSize<T extends HTMLElement = HTMLDivElement>(element: T | null) {
  const [elementSize, setElementSize] = useState<ElementSize>({ height: null, width: null });

  const windowSize = useWindowSize();

  useEffect(() => {
    if (element)
      setElementSize({
        height: element.clientHeight,
        width: element.clientWidth,
      });
  }, [element, element?.clientHeight, element?.clientWidth, windowSize.width, windowSize.height]);

  return elementSize;
}
