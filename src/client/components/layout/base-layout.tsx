import BottomAppBar from '@client/components/layout/bottom-app-bar';
import TopAppBar from '@client/components/layout/top-app-bar';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useRouter } from 'next/router';
import { FC } from 'react';

export interface BaseLayoutProps {
  children?: React.ReactNode;
}

const BaseLayout: FC<BaseLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const router = useRouter();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <TopAppBar showMenu={!isMobile} currentPath={router.asPath} currentLocale={router.locale} />

      <Box mx={2} mb="4rem">
        <main>{children}</main>
      </Box>

      {isMobile && <BottomAppBar currentPath={router.asPath} currentLocale={router.locale} />}
    </>
  );
};

export default BaseLayout;
