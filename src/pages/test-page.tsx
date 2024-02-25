import BaseLayout from '@client/components/layout/base-layout';
import Button from '@mui/material/Button';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Test: NextPage = () => {
  const handleDownload = async () => {
    try {
      const response = await fetch('/api/tabs-pdf');
      console.log(response);

      if (!response.ok) {
        throw new Error('Failed to fetch file');
      }

      const fileBlob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(fileBlob);
      link.download = 'teste.pdf';
      link.click();
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <BaseLayout>
      <>
        <Button variant="text" onClick={handleDownload}>
          Text
        </Button>
      </>
    </BaseLayout>
  );
};

export default Test;

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale || '', [
        'common',
        'home',
        'layout',
        'tablature',
      ])),
    },
  };
};
