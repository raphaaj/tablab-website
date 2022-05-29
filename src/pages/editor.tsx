import Layout from '@components/layout/layout';
import Typography from '@mui/material/Typography';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function Editor() {
  const { t } = useTranslation('editor');

  return (
    <Layout>
      <Typography variant="h4">{t('name')}</Typography>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale || '', ['common', 'editor', 'layout'])),
    },
  };
};
