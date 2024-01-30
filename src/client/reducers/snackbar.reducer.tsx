import { AlertColor } from '@mui/material/Alert';
import { ReactNode } from 'react';

type SnackbarSeverity = AlertColor;

interface SnackbarData {
  message: ReactNode;
  severity?: SnackbarSeverity;
  title?: ReactNode;
}

interface SnackbarQueueItem {
  key: number;
  snackbar: SnackbarData;
}

export interface SnackbarState {
  currentSnackbar: SnackbarQueueItem | null;
  isSnackbarOpen: boolean;
  snackbarQueueItems: SnackbarQueueItem[];
}

export function createInitialSnackbarState(
  initialState: Partial<SnackbarState> | null = null
): SnackbarState {
  return {
    currentSnackbar: initialState?.currentSnackbar ?? null,
    isSnackbarOpen: initialState?.isSnackbarOpen ?? false,
    snackbarQueueItems: initialState?.snackbarQueueItems ?? [],
  };
}

enum SnackbarActionType {
  CloseSnackbar,
  DiscardCurrentSnackbar,
  EnqueueSnackbar,
  ProcessNextSnackbar,
}

export abstract class SnackbarAction {
  public type: SnackbarActionType;

  public constructor(type: SnackbarActionType) {
    this.type = type;
  }
}

export class CloseSnackbarAction extends SnackbarAction {
  public constructor() {
    super(SnackbarActionType.CloseSnackbar);
  }
}

export class DiscardCurrentSnackbarAction extends SnackbarAction {
  public constructor() {
    super(SnackbarActionType.DiscardCurrentSnackbar);
  }
}

export class EnqueueSnackbarAction extends SnackbarAction {
  public snackbar: SnackbarData;

  public constructor(snackbar: SnackbarData) {
    super(SnackbarActionType.EnqueueSnackbar);

    this.snackbar = snackbar;
  }
}

export class ProcessNextSnackbarAction extends SnackbarAction {
  public constructor() {
    super(SnackbarActionType.ProcessNextSnackbar);
  }
}

export function snackbarReducer(state: SnackbarState, action: SnackbarAction): SnackbarState {
  if (action.type === SnackbarActionType.CloseSnackbar) {
    return {
      ...state,
      isSnackbarOpen: false,
    };
  } else if (action.type === SnackbarActionType.DiscardCurrentSnackbar) {
    return {
      ...state,
      currentSnackbar: null,
    };
  } else if (action.type === SnackbarActionType.EnqueueSnackbar) {
    const enqueueSnackbarAction = action as EnqueueSnackbarAction;

    return {
      ...state,
      snackbarQueueItems: state.snackbarQueueItems.concat([
        {
          key: new Date().getTime(),
          snackbar: enqueueSnackbarAction.snackbar,
        },
      ]),
    };
  } else if (action.type === SnackbarActionType.ProcessNextSnackbar) {
    return {
      ...state,
      currentSnackbar: state.snackbarQueueItems[0],
      snackbarQueueItems: state.snackbarQueueItems.slice(1),
      isSnackbarOpen: true,
    };
  } else {
    return state;
  }
}
