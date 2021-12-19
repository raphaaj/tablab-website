import { FC, useState } from 'react';
import { useTranslation } from 'next-i18next';
import {
  AppBar,
  Box,
  Collapse,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Slide,
  Toolbar,
  Tooltip,
  useScrollTrigger,
} from '@mui/material';
import {
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  GitHub as GitHubIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  Menu as MenuIcon,
  Translate as TranslateIcon,
} from '@mui/icons-material';
import { NextLinkComposed } from '@components/next-link-composed';

export interface HideBottomAppBarOnScrollProps {
  children: React.ReactElement;
}

const HideBottomAppBarOnScroll: FC<HideBottomAppBarOnScrollProps> = ({ children }) => {
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="up" in={!trigger}>
      {children}
    </Slide>
  );
};

export interface BottomAppBarProps {
  currentPath: string;
  currentLocale?: string;
}

const BottomAppBar: FC<BottomAppBarProps> = ({ currentPath, currentLocale }) => {
  const { t } = useTranslation('layout');

  const [isDrawerMenuOpen, setIsDrawerMenuOpen] = useState<boolean>(false);
  const [isDrawerTranslationMenuOpen, setIsDrawerTranslationMenuOpen] = useState<boolean>(false);

  const handleOpenDrawerMenuAction = () => {
    setIsDrawerMenuOpen(true);
  };

  const handleCloseDrawerMenuAction = () => {
    setIsDrawerMenuOpen(false);
  };

  const handleDrawerTranslationMenuClick = () => {
    setIsDrawerTranslationMenuOpen(!isDrawerTranslationMenuOpen);
  };

  return (
    <HideBottomAppBarOnScroll>
      <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
        <Toolbar sx={{ justifyContent: 'space-around' }}>
          <Tooltip title={t<string>('navigation.homeLink.shortLabel')} arrow>
            <IconButton
              sx={{ opacity: currentPath === '/' ? 1 : 0.6 }}
              color="inherit"
              component={NextLinkComposed}
              to="/"
              aria-label={t('navigation.homeLink.descriptiveLabel')}
            >
              <HomeIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={t<string>('navigation.aboutLink.shortLabel')} arrow>
            <IconButton
              sx={{ opacity: currentPath === '/about' ? 1 : 0.6 }}
              color="inherit"
              component={NextLinkComposed}
              to="/about"
              aria-label={t('navigation.aboutLink.descriptiveLabel')}
            >
              <InfoIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={t<string>('options.shortLabel')} arrow>
            <IconButton
              color="inherit"
              aria-label={t('options.descriptiveLabel')}
              aria-controls="menu-options"
              onClick={handleOpenDrawerMenuAction}
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>

          <Drawer
            id="menu-options"
            anchor="right"
            open={isDrawerMenuOpen}
            onClose={handleCloseDrawerMenuAction}
          >
            <List>
              <ListItemButton onClick={handleDrawerTranslationMenuClick}>
                <ListItemIcon>
                  <TranslateIcon />
                </ListItemIcon>
                <ListItemText primary={t('options.language.shortLabel')} />
                {isDrawerTranslationMenuOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItemButton>

              <Collapse in={isDrawerTranslationMenuOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton
                    selected={currentLocale !== 'pt-BR'}
                    component={NextLinkComposed}
                    to={currentPath}
                    locale="en-US"
                  >
                    <ListItemText inset primary={t('options.language.localeToLanguage.en-US')} />
                  </ListItemButton>
                  <ListItemButton
                    selected={currentLocale === 'pt-BR'}
                    component={NextLinkComposed}
                    to={currentPath}
                    locale="pt-BR"
                  >
                    <ListItemText inset primary={t('options.language.localeToLanguage.pt-BR')} />
                  </ListItemButton>
                </List>
              </Collapse>

              <ListItemButton
                component={NextLinkComposed}
                to="https://github.com/raphael-jorge/tablab-website"
                target="_blank"
                rel="noreferrer"
                aria-label={t('navigation.gitHubRepositoryLink.descriptiveLabel')}
              >
                <ListItemIcon>
                  <GitHubIcon />
                </ListItemIcon>
                <ListItemText primary={t('navigation.gitHubRepositoryLink.shortLabel')} />
              </ListItemButton>
            </List>
          </Drawer>
        </Toolbar>
      </AppBar>
    </HideBottomAppBarOnScroll>
  );
};

export default BottomAppBar;
