/**
 * Guide for integration of MUI 5 with a nextjs app:
 * * https://mui.com/pt/material-ui/getting-started/example-projects/
 * * https://github.com/mui/material-ui/blob/master/examples/material-ui-nextjs-pages-router-ts/pages/_document.tsx
 */
import createTheme from '@client/styles/theme/create-theme';
import createEmotionCache from '@common/utils/create-emotion-cache';
import { EmotionCache } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import { AppType } from 'next/app';
import Document, {
  DocumentContext,
  DocumentInitialProps,
  DocumentProps,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';
import { useMemo } from 'react';

export default function MyDocument(props: DocumentProps & DocumentHeadTagsProps) {
  const theme = useMemo(() => createTheme(props.locale), [props.locale]);

  return (
    <Html>
      <Head>
        {/* PWA primary color */}
        <meta name="theme-color" content={theme.palette.primary.main} />
        <link rel="shortcut icon" href="/favicon.ico" />
        <DocumentHeadTags {...props} />

        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Gloria+Hallelujah&display=swap"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono&display=swap"
          rel="stylesheet"
        ></link>
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

MyDocument.getInitialProps = async (documentContext: DocumentContext) => {
  const finalProps = await documentGetInitialProps(documentContext);
  return finalProps;
};

/**
 * Structures required for integration of MUI 5
 */

interface Plugin {
  enhanceApp: (
    App: React.ComponentType<React.ComponentProps<AppType>>
  ) => (props: any) => JSX.Element;
  resolveProps: (initialProps: DocumentInitialProps) => Promise<DocumentInitialProps>;
}

function createGetInitialProps(plugins: Plugin[]) {
  return async function getInitialProps(ctx: DocumentContext) {
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => plugins.reduce((result, plugin) => plugin.enhanceApp(result), App),
      });

    const initialProps = await Document.getInitialProps(ctx);

    const finalProps = await plugins.reduce(
      async (result, plugin) => plugin.resolveProps(await result),
      Promise.resolve(initialProps)
    );

    return finalProps;
  };
}

interface DocumentHeadTagsProps {
  emotionStyleTags: React.ReactElement[];
}

function DocumentHeadTags(props: DocumentHeadTagsProps) {
  return (
    <>
      <meta name="emotion-insertion-point" content="" />
      {props.emotionStyleTags}
    </>
  );
}

interface EmotionCacheProviderProps {
  emotionCache?: EmotionCache;
}

async function documentGetInitialProps(
  ctx: DocumentContext,
  options?: {
    emotionCache?: EmotionCache;
    plugins?: Plugin[];
  }
) {
  const cache = options?.emotionCache ?? createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  return createGetInitialProps([
    {
      enhanceApp: (
        App: React.ComponentType<React.ComponentProps<AppType> & EmotionCacheProviderProps>
      ) =>
        function EnhanceApp(props) {
          return <App emotionCache={cache} {...props} />;
        },
      resolveProps: async (initialProps) => {
        const { styles } = extractCriticalToChunks(initialProps.html);
        return {
          ...initialProps,
          emotionStyleTags: styles.map((style) => (
            <style
              data-emotion={`${style.key} ${style.ids.join(' ')}`}
              key={style.key}
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: style.css }}
            />
          )),
        };
      },
    },
    ...(options?.plugins ?? []),
  ])(ctx) as Promise<DocumentInitialProps & DocumentHeadTagsProps>;
}
