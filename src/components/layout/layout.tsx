import { FC } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from '@mui/material/styles';
import { Box, useMediaQuery } from '@mui/material';
import TopAppBar from '@components/layout/top-app-bar';
import BottomAppBar from '@components/layout/bottom-app-bar';

const Layout: FC = ({ children }) => {
  const theme = useTheme();
  const router = useRouter();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <TopAppBar showMenu={!isMobile} currentPath={router.asPath} currentLocale={router.locale} />

      <Box sx={{ ml: 2, mr: 2 }}>
        <main>{children}</main>
      </Box>

      {isMobile && <BottomAppBar currentPath={router.asPath} currentLocale={router.locale} />}
    </>
  );
};

export default Layout;
