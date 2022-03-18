import Layout from '@components/layout/layout';
import Typography from '@mui/material/Typography';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function About() {
  return (
    <Layout>
      <Typography variant="h4">About</Typography>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale || '', ['common', 'layout'])),
    },
  };
};
