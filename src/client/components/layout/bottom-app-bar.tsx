import { NextLinkComposed } from '@client/components/ui/next-link-composed';
import CreateIcon from '@mui/icons-material/Create';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GitHubIcon from '@mui/icons-material/GitHub';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import MenuIcon from '@mui/icons-material/Menu';
import TranslateIcon from '@mui/icons-material/Translate';
import AppBar from '@mui/material/AppBar';
import Collapse from '@mui/material/Collapse';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { useTranslation } from 'next-i18next';
import { FC, ReactElement, memo, useState } from 'react';

export interface HideBottomAppBarOnScrollProps {
  children: ReactElement;
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
  currentLocale?: string;
  currentPath: string;
}

export const HIGHLIGHT_OPACITY = 1;

export const LOWLIGHT_OPACITY = 0.6;

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
              sx={{ opacity: currentPath === '/' ? HIGHLIGHT_OPACITY : LOWLIGHT_OPACITY }}
              color="inherit"
              component={NextLinkComposed}
              to="/"
              aria-label={t('navigation.homeLink.descriptiveLabel')}
            >
              <HomeIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={t<string>('navigation.editorLink.shortLabel')} arrow>
            <IconButton
              sx={{ opacity: currentPath === '/editor' ? HIGHLIGHT_OPACITY : LOWLIGHT_OPACITY }}
              color="inherit"
              component={NextLinkComposed}
              to="/editor"
              aria-label={t('navigation.editorLink.descriptiveLabel')}
            >
              <CreateIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={t<string>('navigation.aboutLink.shortLabel')} arrow>
            <IconButton
              sx={{ opacity: currentPath === '/about' ? HIGHLIGHT_OPACITY : LOWLIGHT_OPACITY }}
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
                    selected={currentLocale === 'en-US'}
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

export default memo(BottomAppBar);
