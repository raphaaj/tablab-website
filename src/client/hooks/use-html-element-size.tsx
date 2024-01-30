import { useLayoutEffect } from '@client/hooks/use-isomorphic-layout-effect';
import { useCallback, useEffect, useState } from 'react';

export interface HtmlElementSize {
  height: number;
  width: number;
}

export function useHtmlElementSize<THtmlElement extends HTMLElement>(element: THtmlElement | null) {
  const [htmlElementSize, setHtmlElementSize] = useState<HtmlElementSize>({ height: 0, width: 0 });

  const updateHtmlElementSize = useCallback(() => {
    setHtmlElementSize({
      height: element?.offsetHeight ?? 0,
      width: element?.offsetWidth ?? 0,
    });
  }, [element]);

  useLayoutEffect(updateHtmlElementSize, [updateHtmlElementSize]);

  useEffect(() => {
    window.addEventListener('resize', updateHtmlElementSize);
    return () => window.removeEventListener('resize', updateHtmlElementSize);
  }, [updateHtmlElementSize]);

  return htmlElementSize;
}
