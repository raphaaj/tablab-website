import Layout from '@components/layout/layout';
import NextLinkComposed from '@components/next-link-composed';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';

const Home: NextPage = () => {
  const { t } = useTranslation('home');

  return (
    <Layout>
      <Grid
        container
        spacing={2}
        alignItems="center"
        textAlign="center"
        justifyContent="center"
        sx={(theme) => ({
          [theme.breakpoints.up('md')]: {
            padding: '3rem 0',
          },
          [theme.breakpoints.down('md')]: {
            padding: '1.25rem 0',
          },
        })}
      >
        <Grid item xs={12} md={6} lg={4}>
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
        <Grid item xs={12} md={6} lg={4}>
          <Image
            src="https://dummyimage.com/400x600/cfcfcf/fff.jpg"
            alt="Tablab"
            width={400}
            height={600}
          />
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale || '', ['common', 'home', 'layout'])),
    },
  };
};
