import {
  SnackbarAction,
  SnackbarState,
  createInitialSnackbarState,
} from '@client/reducers/snackbar.reducer';
import { Dispatch, createContext, useContext } from 'react';

export interface SnackbarReducerContext {
  dispatchSnackbarAction: Dispatch<SnackbarAction>;
  snackbarState: SnackbarState;
}

const snackbarReducerContext = createContext<SnackbarReducerContext>({
  dispatchSnackbarAction: () => undefined,
  snackbarState: createInitialSnackbarState(),
});

export function useSnackbarReducerContext() {
  return useContext(snackbarReducerContext);
}

export const SnackbarReducerContextProvider = snackbarReducerContext.Provider;
