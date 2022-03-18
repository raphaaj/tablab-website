import { FC, useState } from 'react';
import { useTranslation } from 'next-i18next';
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Link as MuiLink,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { GitHub as GitHubIcon, Translate as TranslateIcon } from '@mui/icons-material';
import { NextLinkComposed } from '@components/next-link-composed';

export interface TopAppBarProps {
  currentLocale?: string;
  currentPath: string;
  showMenu: boolean;
}

const TopAppBar: FC<TopAppBarProps> = ({ showMenu, currentPath, currentLocale }) => {
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
          <Typography variant="h5" component="div">
            Tablab
          </Typography>
        </MuiLink>

        {showMenu && (
          <>
            <Box sx={{ flexGrow: 1 }}></Box>

            <Box component="nav">
              <Button
                sx={{ opacity: currentPath === '/' ? 1 : 0.6 }}
                color="inherit"
                component={NextLinkComposed}
                to="/"
                aria-label={t('navigation.homeLink.descriptiveLabel')}
              >
                {t('navigation.homeLink.shortLabel')}
              </Button>

              <Button
                sx={{ opacity: currentPath === '/about' ? 1 : 0.6 }}
                color="inherit"
                component={NextLinkComposed}
                to="/about"
                aria-label={t('navigation.aboutLink.descriptiveLabel')}
              >
                {t('navigation.aboutLink.shortLabel')}
              </Button>

              <Tooltip title={t<string>('navigation.gitHubRepositoryLink.descriptiveLabel')} arrow>
                <IconButton
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
                  selected={currentLocale !== 'pt-BR'}
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
