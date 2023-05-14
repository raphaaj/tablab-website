import BottomAppBar from '@client/components/layout/bottom-app-bar';
import TopAppBar from '@client/components/layout/top-app-bar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
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

      <Box
        sx={(theme) => ({
          mx: 2,
          [theme.breakpoints.up('md')]: {
            mt: '3rem',
            mb: '7rem',
          },
          [theme.breakpoints.down('md')]: {
            mt: '1.5rem',
            mb: '4.5rem',
          },
        })}
      >
        <Grid container justifyContent="center">
          <Grid item xs={12} md={10} lg={8}>
            <main>{children}</main>
          </Grid>
        </Grid>
      </Box>

      {isMobile && <BottomAppBar currentPath={router.asPath} currentLocale={router.locale} />}
    </>
  );
};

export default BaseLayout;
