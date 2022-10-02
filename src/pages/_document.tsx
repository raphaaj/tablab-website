/**
 * Guide for integration of MUI 5 with a nextjs app:
 * * https://mui.com/pt/material-ui/getting-started/example-projects/
 * * https://github.com/mui/material-ui/blob/master/examples/nextjs-with-typescript/pages/_document.tsx
 */
import createTheme from '@client/styles/theme/create-theme';
import createEmotionCache from '@client/utils/create-emotion-cache';
import createEmotionServer from '@emotion/server/create-instance';
import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  public static async getInitialProps(context: DocumentContext) {
    const originalRenderPage = context.renderPage;

    const cache = createEmotionCache();
    const { extractCriticalToChunks } = createEmotionServer(cache);

    context.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App: any) =>
          function EnhanceApp(props) {
            return <App emotionCache={cache} {...props} />;
          },
      });

    const initialProps = await Document.getInitialProps(context);
    const emotionStyles = extractCriticalToChunks(initialProps.html);
    const emotionStyleTags = emotionStyles.styles.map((style) => (
      <style
        data-emotion={`${style.key} ${style.ids.join(' ')}`}
        key={style.key}
        dangerouslySetInnerHTML={{ __html: style.css }}
      />
    ));

    return {
      ...initialProps,
      emotionStyleTags,
    };
  }

  public render() {
    const theme = createTheme(this.props.locale);

    return (
      <Html>
        <Head>
          <meta name="theme-color" content={theme.palette.primary.main} />
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
          {(this.props as any).emotionStyleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
