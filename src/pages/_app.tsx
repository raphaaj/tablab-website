/**
 * Guide for integration of MUI 5 with a nextjs app:
 * * https://mui.com/pt/material-ui/getting-started/example-projects/
 * * https://github.com/mui/material-ui/blob/master/examples/nextjs-with-typescript/pages/_app.tsx
 */
import {
  SnackbarReducerContext,
  SnackbarReducerContextProvider,
} from '@client/contexts/snackbar-reducer.context';
import { createInitialSnackbarState, snackbarReducer } from '@client/reducers/snackbar.reducer';
import createTheme from '@client/styles/theme/create-theme';
import createEmotionCache from '@client/utils/create-emotion-cache';
import { CacheProvider, EmotionCache } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { appWithTranslation } from 'next-i18next';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useReducer } from 'react';

const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

function MyApp({ Component, emotionCache = clientSideEmotionCache, pageProps }: MyAppProps) {
  const router = useRouter();

  const theme = createTheme(router.locale);

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
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarReducerContextProvider value={snackbarReducerContext}>
          <Component {...pageProps} />
        </SnackbarReducerContextProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default appWithTranslation(MyApp);
