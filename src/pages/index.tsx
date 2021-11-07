import type { NextPage, GetStaticProps } from 'next';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Box, Container, Link as StyledLink, Typography } from '@mui/material';

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
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale || '', ['common'])),
    },
  };
};
