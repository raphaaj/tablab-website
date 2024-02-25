/**
 * Guide for integration of MUI 5 with a nextjs app:
 * * https://mui.com/pt/material-ui/getting-started/example-projects/
 * * https://github.com/mui/material-ui/blob/master/packages/mui-material-nextjs/src/v13-pagesRouter/createCache.ts
 */

import createCache from '@emotion/cache';

const isBrowser = typeof document !== 'undefined';

// On the client side, Create a meta tag at the top of the <head> and set it as insertionPoint.
// This assures that MUI styles are loaded first.
// It allows developers to easily override MUI styles with other styling solutions, like CSS modules.
export default function createEmotionCache() {
  let insertionPoint;

  if (isBrowser) {
    const emotionInsertionPoint = document.querySelector<HTMLMetaElement>(
      'meta[name="emotion-insertion-point"]'
    );
    insertionPoint = emotionInsertionPoint ?? undefined;
  }

  return createCache({ key: 'mui', insertionPoint });
}
