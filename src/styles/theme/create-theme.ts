import {
  createTheme as createMuiTheme,
  PaletteOptions,
  Theme,
  responsiveFontSizes,
} from '@mui/material/styles';
import { enUS, Localization, ptBR } from '@mui/material/locale';
import { lime, red } from '@mui/material/colors';

const localeToLocalizationMap = new Map<string, Localization>([
  ['en-US', enUS],
  ['pt-BR', ptBR],
]);

const palette: PaletteOptions = {
  primary: {
    main: red[900],
  },
  secondary: {
    main: lime[500],
  },
};

const typography = {
  fontFamily: ['"Montserrat"', 'sans-serif'].join(','),
};

export default function createTheme(locale = ''): Theme {
  let localization = localeToLocalizationMap.get(locale);
  if (!localization) localization = enUS;

  let theme = createMuiTheme({ palette, typography }, localization);
  theme = responsiveFontSizes(theme);

  return theme;
}
