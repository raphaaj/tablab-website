import BottomAppBar from '@client/components/layout/bottom-app-bar';
import TopAppBar from '@client/components/layout/top-app-bar';
import { useSnackbarReducerContext } from '@client/contexts/snackbar-reducer.context';
import {
  CloseSnackbarAction,
  DiscardCurrentSnackbarAction,
  ProcessNextSnackbarAction,
} from '@client/reducers/snackbar.reducer';
import { RoutePathHelper } from '@common/helpers/route-path-helper';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Slide, { SlideProps } from '@mui/material/Slide';
import Snackbar from '@mui/material/Snackbar';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useRouter } from 'next/router';
import React, { FC, ReactNode, useCallback, useEffect } from 'react';

export interface BaseLayoutProps {
  children?: ReactNode;
}

type SlideTransitionProps = Omit<SlideProps, 'direction'>;

const SlideLeft: FC<SlideTransitionProps> = (props) => <Slide {...props} direction="left" />;

const SlideDown: FC<SlideTransitionProps> = (props) => <Slide {...props} direction="down" />;

const BaseLayout: FC<BaseLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const router = useRouter();
  const currentPathHelper = new RoutePathHelper(router.asPath);
  const currentPath = currentPathHelper.removeQueryParameters().removeFragments().routePath;

  const { snackbarState, dispatchSnackbarAction } = useSnackbarReducerContext();

  useEffect(() => {
    if (snackbarState.snackbarQueueItems.length && !snackbarState.currentSnackbar) {
      dispatchSnackbarAction(new ProcessNextSnackbarAction());
    } else if (
      snackbarState.snackbarQueueItems.length &&
      snackbarState.currentSnackbar &&
      snackbarState.isSnackbarOpen
    ) {
      dispatchSnackbarAction(new CloseSnackbarAction());
    }
  }, [snackbarState, dispatchSnackbarAction]);

  const handleSnackbarCloseEvent = useCallback(
    (_event: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') return;

      dispatchSnackbarAction(new CloseSnackbarAction());
    },
    [dispatchSnackbarAction]
  );

  const handleSnackbarClosed = useCallback(() => {
    dispatchSnackbarAction(new DiscardCurrentSnackbarAction());
  }, [dispatchSnackbarAction]);

  return (
    <>
      <TopAppBar showMenu={!isMobile} currentPath={currentPath} currentLocale={router.locale} />

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

      <Snackbar
        key={snackbarState.currentSnackbar?.key}
        open={snackbarState.isSnackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarCloseEvent}
        anchorOrigin={{ vertical: isMobile ? 'top' : 'bottom', horizontal: 'right' }}
        TransitionProps={{ onExited: handleSnackbarClosed }}
        TransitionComponent={isMobile ? SlideDown : SlideLeft}
      >
        <Alert
          onClose={handleSnackbarCloseEvent}
          severity={snackbarState.currentSnackbar?.snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbarState.currentSnackbar?.snackbar.title && (
            <AlertTitle>{snackbarState.currentSnackbar?.snackbar.title}</AlertTitle>
          )}
          {snackbarState.currentSnackbar?.snackbar.message}
        </Alert>
      </Snackbar>

      {isMobile && <BottomAppBar currentPath={currentPath} currentLocale={router.locale} />}
    </>
  );
};

export default BaseLayout;
