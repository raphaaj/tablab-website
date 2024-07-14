/**
 * Guide for integration of MUI 5 with a nextjs app:
 * * https://mui.com/pt/material-ui/getting-started/example-projects/
 * * https://github.com/mui/material-ui/blob/master/examples/material-ui-nextjs-pages-router-ts/pages/_app.tsx
 */
import 'reflect-metadata';

import {
  SnackbarReducerContext,
  SnackbarReducerContextProvider,
} from '@client/contexts/snackbar-reducer.context';
import { createInitialSnackbarState, snackbarReducer } from '@client/reducers/snackbar.reducer';
import createTheme from '@client/styles/theme/create-theme';
import createEmotionCache from '@common/utils/create-emotion-cache';
import { CacheProvider, EmotionCache } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { appWithTranslation } from 'next-i18next';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useMemo, useReducer } from 'react';

import { setupContainer } from '@client/container';

import '@client/styles/global.css';

setupContainer();

function MyApp(props: AppProps) {
  const { Component, pageProps } = props;

  const router = useRouter();

  const theme = useMemo(() => createTheme(router.locale), [router.locale]);

  const [snackbarState, dispatchSnackbarAction] = useReducer(
    snackbarReducer,
    null,
    createInitialSnackbarState
  );

  const snackbarReducerContext: SnackbarReducerContext = {
    snackbarState,
    dispatchSnackbarAction,
  };

  return (
    <AppCacheProvider {...props}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarReducerContextProvider value={snackbarReducerContext}>
          <Component {...pageProps} />
        </SnackbarReducerContextProvider>
      </ThemeProvider>
    </AppCacheProvider>
  );
}

export default appWithTranslation(MyApp);

/**
 * Structures required for integration of MUI 5
 */

interface EmotionCacheProviderProps {
  emotionCache?: EmotionCache;
}

const defaultEmotionCache = createEmotionCache();

function AppCacheProvider({
  emotionCache = defaultEmotionCache,
  children,
}: React.PropsWithChildren<EmotionCacheProviderProps>) {
  return <CacheProvider value={emotionCache}>{children}</CacheProvider>;
}
