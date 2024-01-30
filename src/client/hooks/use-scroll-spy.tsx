import { useLayoutEffect } from '@client/hooks/use-isomorphic-layout-effect';
import { useCallback, useEffect, useState } from 'react';

interface SpiedElementBoundingClientRectData<TElement extends HTMLElement> {
  boundingClientRect: DOMRect;
  element: TElement;
}

export function useScrollSpy<TElement extends HTMLElement>(elementsToSpy: (TElement | null)[]) {
  const [activeElement, setActiveElement] = useState<TElement | null>(null);

  const syncActiveElement = useCallback(() => {
    let activeElementCandidateBoundingClientRectData: SpiedElementBoundingClientRectData<TElement> | null =
      null;

    for (const spiedElement of elementsToSpy) {
      if (spiedElement) {
        const spiedElementBoundingClientRectData = {
          boundingClientRect: spiedElement.getBoundingClientRect(),
          element: spiedElement,
        };

        if (
          !activeElementCandidateBoundingClientRectData ||
          Math.abs(spiedElementBoundingClientRectData.boundingClientRect.top) <
            Math.abs(activeElementCandidateBoundingClientRectData.boundingClientRect.top)
        ) {
          activeElementCandidateBoundingClientRectData = spiedElementBoundingClientRectData;
        }
      }
    }

    setActiveElement(activeElementCandidateBoundingClientRectData?.element ?? null);
  }, [elementsToSpy]);

  useLayoutEffect(syncActiveElement, [syncActiveElement]);

  useEffect(() => {
    syncActiveElement();

    window.addEventListener('resize', syncActiveElement);
    window.addEventListener('scroll', syncActiveElement);

    return () => {
      window.removeEventListener('resize', syncActiveElement);
      window.removeEventListener('scroll', syncActiveElement);
    };
  }, [syncActiveElement]);

  return activeElement;
}
