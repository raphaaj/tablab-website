import { useEffect, useLayoutEffect as useLayoutEffectOriginal } from 'react';

export const useLayoutEffect = typeof window !== 'undefined' ? useLayoutEffectOriginal : useEffect;
