import { NextLinkComposed } from '@client/components/ui/next-link-composed';
import TypographyFontBrand from '@client/components/ui/typography-font-brand';
import GitHubIcon from '@mui/icons-material/GitHub';
import TranslateIcon from '@mui/icons-material/Translate';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MuiLink from '@mui/material/Link';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from 'next-i18next';
import { FC, useState } from 'react';

export interface TopAppBarProps {
  currentLocale?: string;
  currentPath: string;
  showMenu?: boolean;
}

export const HIGHLIGHT_OPACITY = 1;

export const LOWLIGHT_OPACITY = 0.6;

const TopAppBar: FC<TopAppBarProps> = ({ showMenu = false, currentPath, currentLocale }) => {
  const { t } = useTranslation('layout');

  const [translationMenuAnchorElement, setTranslationMenuAnchorElement] =
    useState<null | HTMLElement>(null);

  const handleOpenTranslationMenuAction = (event: React.MouseEvent<HTMLElement>) => {
    setTranslationMenuAnchorElement(event.currentTarget);
  };

  const handleCloseTranslationMenuAction = () => {
    setTranslationMenuAnchorElement(null);
  };

  return (
    <AppBar position="static" sx={{ flexGrow: 1, mb: 2 }}>
      <Toolbar
        sx={(theme) => ({
          [theme.breakpoints.up('md')]: {
            marginLeft: '16.66%',
            marginRight: '16.66%',
          },
          [theme.breakpoints.down('sm')]: {
            justifyContent: 'center',
          },
        })}
      >
        <MuiLink color="inherit" underline="none" component={NextLinkComposed} to="/">
          <TypographyFontBrand variant="h4" noWrap>
            Tablab
          </TypographyFontBrand>
        </MuiLink>

        {showMenu && (
          <>
            <Box sx={{ flexGrow: 1 }}></Box>

            <Box component="nav">
              <Button
                sx={{ opacity: currentPath === '/' ? HIGHLIGHT_OPACITY : LOWLIGHT_OPACITY }}
                color="inherit"
                component={NextLinkComposed}
                to="/"
                aria-label={t('navigation.homeLink.descriptiveLabel')}
              >
                {t('navigation.homeLink.shortLabel')}
              </Button>

              <Button
                sx={{ opacity: currentPath === '/editor' ? HIGHLIGHT_OPACITY : LOWLIGHT_OPACITY }}
                color="inherit"
                component={NextLinkComposed}
                to="/editor"
                aria-label={t('navigation.editorLink.descriptiveLabel')}
              >
                {t('navigation.editorLink.shortLabel')}
              </Button>

              <Button
                sx={{ opacity: currentPath === '/about' ? HIGHLIGHT_OPACITY : LOWLIGHT_OPACITY }}
                color="inherit"
                component={NextLinkComposed}
                to="/about"
                aria-label={t('navigation.aboutLink.descriptiveLabel')}
              >
                {t('navigation.aboutLink.shortLabel')}
              </Button>

              <Tooltip title={t<string>('navigation.gitHubRepositoryLink.descriptiveLabel')} arrow>
                <IconButton
                  sx={{ marginLeft: '1rem' }}
                  color="inherit"
                  target="_blank"
                  rel="noreferrer"
                  component={NextLinkComposed}
                  to="https://github.com/raphael-jorge/tablab-website"
                  aria-label={t('navigation.gitHubRepositoryLink.descriptiveLabel')}
                >
                  <GitHubIcon />
                </IconButton>
              </Tooltip>
            </Box>

            <Box>
              <Tooltip title={t<string>('options.language.descriptiveLabel')} arrow>
                <IconButton
                  color="inherit"
                  aria-label={t('options.language.descriptiveLabel')}
                  aria-controls="translation-menu-options"
                  aria-haspopup="true"
                  onClick={handleOpenTranslationMenuAction}
                >
                  <TranslateIcon />
                </IconButton>
              </Tooltip>
              <Menu
                id="translation-menu-options"
                anchorEl={translationMenuAnchorElement}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                open={Boolean(translationMenuAnchorElement)}
                onClose={handleCloseTranslationMenuAction}
              >
                <MenuItem
                  selected={currentLocale === 'en-US'}
                  component={NextLinkComposed}
                  to={currentPath}
                  locale="en-US"
                >
                  {t('options.language.localeToLanguage.en-US')}
                </MenuItem>
                <MenuItem
                  selected={currentLocale === 'pt-BR'}
                  component={NextLinkComposed}
                  to={currentPath}
                  locale="pt-BR"
                >
                  {t('options.language.localeToLanguage.pt-BR')}
                </MenuItem>
              </Menu>
            </Box>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default TopAppBar;
