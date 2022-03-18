import Layout from '@components/layout/layout';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import StyledLink from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import type { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

const Home: NextPage = () => {
  const router = useRouter();
  const { t } = useTranslation('common');

  let localeOptions;
  if (router.locales) {
    localeOptions = (
      <Box component="nav">
        {router.locales.map((locale) => (
          <NextLink key={locale} href={router.asPath} locale={locale} passHref>
            <StyledLink sx={{ margin: 1 }}>{locale}</StyledLink>
          </NextLink>
        ))}
      </Box>
    );
  }

  return (
    <Layout>
      <Container maxWidth="md">
        <Box component="main" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            {router.locale}
          </Typography>

          <Typography variant="body1" gutterBottom>
            {t('common:app-description')}
          </Typography>

          {localeOptions}
        </Box>
      </Container>
    </Layout>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale || '', ['common', 'layout'])),
    },
  };
};
