import { useLayoutEffect } from '@client/hooks/use-isomorphic-layout-effect';
import { useCallback, useEffect, useState } from 'react';

interface SpiedElementBoundingClientRectData<TElement extends HTMLElement> {
  boundingClientRect: DOMRect;
  element: TElement;
}

export function useScrollSpy<TElement extends HTMLElement>(elementsToSpy: (TElement | null)[]) {
  const [activeElement, setActiveElement] = useState<TElement | null>(null);

  const syncActiveElement = useCallback(() => {
    let activeElementCandidateData: SpiedElementBoundingClientRectData<TElement> | null = null;
    let closestElementToEndOfPageCandidateData: SpiedElementBoundingClientRectData<TElement> | null =
      null;

    for (const spiedElement of elementsToSpy) {
      if (spiedElement) {
        const spiedElementBoundingClientRectData = {
          boundingClientRect: spiedElement.getBoundingClientRect(),
          element: spiedElement,
        };

        if (
          !activeElementCandidateData ||
          Math.abs(spiedElementBoundingClientRectData.boundingClientRect.top) <
            Math.abs(activeElementCandidateData.boundingClientRect.top)
        ) {
          activeElementCandidateData = spiedElementBoundingClientRectData;
        }

        if (
          !closestElementToEndOfPageCandidateData ||
          spiedElementBoundingClientRectData.boundingClientRect.top >
            closestElementToEndOfPageCandidateData.boundingClientRect.top
        ) {
          closestElementToEndOfPageCandidateData = spiedElementBoundingClientRectData;
        }
      }
    }

    const isPageScrollable =
      document.documentElement.scrollHeight > document.documentElement.clientHeight;
    const isAtEndOfPage =
      isPageScrollable &&
      window.scrollY + document.documentElement.clientHeight >=
        document.documentElement.scrollHeight;

    if (isAtEndOfPage) {
      activeElementCandidateData = closestElementToEndOfPageCandidateData;
    }

    setActiveElement(activeElementCandidateData?.element ?? null);
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
