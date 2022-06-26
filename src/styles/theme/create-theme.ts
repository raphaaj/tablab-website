import { lime, red } from '@mui/material/colors';
import { enUS, Localization, ptBR } from '@mui/material/locale';
import { createTheme as createMuiTheme, responsiveFontSizes, Theme } from '@mui/material/styles';

const LOCALE_TO_LOCALIZATION_MAP = new Map<string, Localization>([
  ['en-US', enUS],
  ['pt-BR', ptBR],
]);

const COLOR_PRIMARY_MAIN = red[900];
const COLOR_SECONDARY_MAIN = lime[500];

const FONT_FAMILY_DEFAULT = ['"Montserrat"', 'sans-serif'].join(',');
const FONT_FAMILY_MONOSPACE = ['"JetBrains Mono"', 'monospace'].join(',');
const FONT_FAMILY_BRAND = ['"Gloria Hallelujah"', 'cursive'].join(',');

const palette = {
  primary: {
    main: COLOR_PRIMARY_MAIN,
  },
  secondary: {
    main: COLOR_SECONDARY_MAIN,
  },
};

const typography = {
  fontFamily: FONT_FAMILY_DEFAULT,
  fontFamilies: {
    default: FONT_FAMILY_DEFAULT,
    monospace: FONT_FAMILY_MONOSPACE,
    brand: FONT_FAMILY_BRAND,
  },
};

export default function createTheme(locale = ''): Theme {
  let localization = LOCALE_TO_LOCALIZATION_MAP.get(locale);
  if (!localization) localization = enUS;

  let theme = createMuiTheme({ palette, typography }, localization);
  theme = responsiveFontSizes(theme);

  return theme;
}
