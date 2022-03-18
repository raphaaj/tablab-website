import BottomAppBar from '@components/layout/bottom-app-bar';
import TopAppBar from '@components/layout/top-app-bar';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useRouter } from 'next/router';
import { FC } from 'react';

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
