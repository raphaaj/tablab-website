import BottomAppBar from '@components/layout/bottom-app-bar';
import TopAppBar from '@components/layout/top-app-bar';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useRouter } from 'next/router';
import { FC } from 'react';

type LayoutProps = {
  children?: React.ReactNode;
};

const Layout: FC<LayoutProps> = ({ children }) => {
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

export default Layout;
