import { createTheme as createMuiTheme, Theme } from '@mui/material/styles';

const typography = {
  fontFamily: 'sans-serif',
};

const fontFamilies = {
  default: 'sans-serif',
  monospace: 'monospace',
  brand: 'cursive',
};

export function createThemeMock(): Theme {
  let theme = createMuiTheme({ typography, fontFamilies });

  return theme;
}
