import BaseLayout from '@client/components/layout/base-layout';
import TablatureBlock from '@client/components/tablature/tablature-block';
import NextLinkComposed from '@client/components/ui/next-link-composed';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { TablatureCompilationOptionsDTO } from '@server/services/tablature-compiler-service/dtos/tablature-compilation-options.dto';
import {
  ITablatureCompilerService,
  ITablatureCompilerServiceInjectionToken,
} from '@server/services/tablature-compiler-service/interfaces/tablature-compiler-service.interface';

import type { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useState } from 'react';

const NUMBER_OF_RIFFS_ON_HOMEPAGE = 3;

const RIFFS_TAB_RENDERIZATION_INITIAL_SPACING = 3;

const RIFFS_TAB_RENDERIZATION_NUMBER_OF_STRINGS = 6;

const RIFFS_TAB_RENDERIZATION_ROWS_LENGTH = 68;

const RIFFS_TAB_RENDERIZATION_INSTRUCTIONS: string[] = [
  `
  header (Black Sabbath - Paranoid Riff)
  repeat(3) { merge{ 6-12 5-12h14 } }
  5-12 spacing(2) 5-14 4-12 4-14 5-12 5-14 4-12 5-14
  spacing(3) footer(x4)
  `,
  `
  header (Black Sabbath - Iron Man Riff)
  merge { 6-7 5-9 } spacing(4) merge { 6-10 5-12 }
  merge { 6-10 5-12 } spacing (2) repeat(2) { merge { 6-12 5-14 } } 
  repeat(3) { merge { 6-15/14 5-17/16 } }
  merge { 6-10 5-12 } merge { 6-10/12 5-12/14 } merge { 6-12 5-14 }
  `,
  `
  header (AC/DC - Back In Black Riff)
  merge { 6-0 5-2 }
  merge { 4-0 3-2 2-3 } spacing(1) repeat(2) { merge { 4-0 3-2 2-3 } } spacing(4)
  merge { 5-0 4-2 } spacing(1) repeat(2) { merge { 5-0 4-2 } } spacing(4)
  1-3 spacing(2) 1-0 2-3 2-0 3-2b1r 3-2 merge { 6-0 5-2 }
  `,
  `
  header (Deep Purple - Smoke On The Water Riff)
  merge { 4-5 5-5 } merge { 3-3 4-3 } merge { 3-5 4-5 }
  merge { 4-5 5-5 } merge { 3-3 4-3 } merge { 3-6 4-6 } spacing(2) merge { 3-5 4-5 } spacing(3)
  merge { 4-5 5-5 } merge { 3-3 4-3 } merge { 3-5 4-5 } spacing(4)
  merge { 3-3 4-3 } spacing(3) merge { 4-5 5-5 }
  `,
  `
  header (Survivor - Eye Of The Tiger Riff)
  merge { 5-3 4-5 3-5 } spacing(4) 
  repeat(2) { merge { 5-3 4-5 3-5 } spacing(2) merge { 5-1 4-3 3-3 } merge { 5-3 4-5 3-5 } spacing(4) }
  merge { 5-3 4-5 3-5 } spacing(2) merge { 6-3 5-5 4-5 } merge { 6-4 5-6 4-6 }
  spacing(3) footer(x2)
  `,
  `
  header (Pink Floyd - Money Riff)
  merge { 5-3 4-5 3-5 } spacing(4) 
  repeat(2) { merge { 5-3 4-5 3-5 } spacing(2) merge { 5-1 4-3 3-3 } merge { 5-3 4-5 3-5 } spacing(4) }
  merge { 5-3 4-5 3-5 } spacing(2) merge { 6-3 5-5 4-5 } merge { 6-4 5-6 4-6 }
  spacing(3) footer(x2)
  `,
].map((instruction) => instruction.replace(/[\r\n]/g, '').trim());

export interface HomeProps {
  riffsRenderedTabs: string[][][];
}

const Home: NextPage<HomeProps> = ({ riffsRenderedTabs }) => {
  const { t } = useTranslation('home');

  const [riffsIndexesToRender, setRiffsIndexesToRender] = useState<number[]>([]);

  useEffect(() => {
    if (NUMBER_OF_RIFFS_ON_HOMEPAGE >= riffsRenderedTabs.length) {
      setRiffsIndexesToRender(riffsRenderedTabs.map((_, i) => i));
    } else {
      const riffsIndexesToRender = new Set<number>();
      while (riffsIndexesToRender.size < NUMBER_OF_RIFFS_ON_HOMEPAGE) {
        const riffIndexToRender = Math.floor(Math.random() * riffsRenderedTabs.length);
        if (!riffsIndexesToRender.has(riffIndexToRender)) {
          riffsIndexesToRender.add(riffIndexToRender);
        }
      }

      setRiffsIndexesToRender(Array.from(riffsIndexesToRender));
    }
  }, [riffsRenderedTabs, riffsRenderedTabs.length]);

  return (
    <BaseLayout>
      <Grid container rowSpacing={6}>
        <Grid item xs={12}>
          <Grid container textAlign="center" justifyContent="center">
            <Grid item xs={12} md={9} xl={6}>
              <Typography variant="h3" component="h1" gutterBottom>
                {t('home:title')}
              </Typography>
              <Typography variant="h5" component="h2" gutterBottom>
                {t('home:description')}
              </Typography>
              <Stack mt={3} spacing={2} alignItems="center">
                <Button
                  to="/editor"
                  variant="contained"
                  color="secondary"
                  size="large"
                  component={NextLinkComposed}
                >
                  {t('home:button-go-to-editor')}
                </Button>
                <Button
                  to="/about"
                  variant="outlined"
                  color="primary"
                  size="large"
                  component={NextLinkComposed}
                >
                  {t('home:button-go-to-about')}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Divider variant="middle" />
        </Grid>

        {riffsIndexesToRender.map((riffIndexToRender, riffIndex) => (
          <Grid item xs={12} key={riffIndex}>
            {riffsRenderedTabs[riffIndexToRender].map(
              (riffRenderedBlock, riffRenderedBlockIndex) => (
                <TablatureBlock
                  key={riffRenderedBlockIndex}
                  block={riffRenderedBlock}
                  label={t('tablature:block-label', { blockNumber: riffRenderedBlockIndex + 1 })}
                  fullWidth={false}
                />
              )
            )}
          </Grid>
        ))}
      </Grid>
    </BaseLayout>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async (context) => {
  const { container } = await import('@server/container');

  const tablatureCompilerService = container.resolve<ITablatureCompilerService>(
    ITablatureCompilerServiceInjectionToken
  );

  const riffsRenderedTabs: string[][][] = [];

  for (const riffTabRenderizationInstructions of RIFFS_TAB_RENDERIZATION_INSTRUCTIONS) {
    const tablatureCompilationOptions = new TablatureCompilationOptionsDTO({
      numberOfStrings: RIFFS_TAB_RENDERIZATION_NUMBER_OF_STRINGS,
      initialSpacing: RIFFS_TAB_RENDERIZATION_INITIAL_SPACING,
      rowsLength: RIFFS_TAB_RENDERIZATION_ROWS_LENGTH,
    });

    const riffTabCreationResult = await tablatureCompilerService.compileTablaure(
      riffTabRenderizationInstructions,
      tablatureCompilationOptions
    );

    if (tablatureCompilerService.isSuccessfulTablatureCompilationResult(riffTabCreationResult)) {
      riffsRenderedTabs.push(riffTabCreationResult.compiledTablature.tablature);
    }
  }

  return {
    props: {
      ...(await serverSideTranslations(context.locale || '', [
        'common',
        'home',
        'layout',
        'tablature',
      ])),
      riffsRenderedTabs,
    },
  };
};
