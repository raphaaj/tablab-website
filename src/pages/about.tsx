import BaseLayout from '@client/components/layout/base-layout';
import Typography from '@mui/material/Typography';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function About() {
  const { t } = useTranslation('about');

  return (
    <BaseLayout>
      <Typography variant="h4">{t('name')}</Typography>
    </BaseLayout>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale || '', ['common', 'about', 'layout'])),
    },
  };
};
