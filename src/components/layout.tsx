import { FC, useState } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import {
  AppBar,
  Box,
  Collapse,
  Drawer,
  IconButton,
  Link as MuiLink,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Slide,
  Tab,
  Tabs,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
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

const MOBILE_BREAKPOINT = 'sm';

interface TopAppBarProps {
  showMenu: boolean;
  currentPath: string;
  currentLocale?: string;
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
          [theme.breakpoints.down(MOBILE_BREAKPOINT)]: {
            justifyContent: 'center',
          },
        })}
      >
        <MuiLink
          color="inherit"
          underline="none"
          component={NextLinkComposed}
          to="/"
          aria-label={t('internalNavigationMenu.homeLabel')}
        >
          <Typography variant="h5" component="div">
            Tablab
          </Typography>
        </MuiLink>

        {showMenu && (
          <>
            <Box sx={{ flexGrow: 1 }}></Box>
            <Tabs
              textColor="inherit"
              value={currentPath}
              aria-label={t('internalNavigationMenu.label')}
            >
              <Tab
                color="inherit"
                label={t('internalNavigationMenu.homeLabel')}
                value="/"
                component={NextLinkComposed}
                to="/"
              />
              <Tab
                color="inherit"
                label={t('internalNavigationMenu.aboutLabel')}
                value="/about"
                component={NextLinkComposed}
                to="/about"
              />
            </Tabs>
            <Tooltip title={t<string>('translationMenu.label')} arrow>
              <IconButton
                color="inherit"
                aria-label={t('translationMenu.label')}
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
                {t('translationMenu.localeToLanguage.en-US')}
              </MenuItem>
              <MenuItem
                selected={currentLocale === 'pt-BR'}
                component={NextLinkComposed}
                to={currentPath}
                locale="pt-BR"
              >
                {t('translationMenu.localeToLanguage.pt-BR')}
              </MenuItem>
            </Menu>
            <Tooltip title={t<string>('gitHubRepositoryLink.label')} arrow>
              <MuiLink
                color="inherit"
                underline="none"
                target="_blank"
                rel="noreferrer"
                component={NextLinkComposed}
                to="https://github.com/raphael-jorge/tablab-website"
                aria-label={t('gitHubRepositoryLink.label')}
              >
                <IconButton color="inherit">
                  <GitHubIcon />
                </IconButton>
              </MuiLink>
            </Tooltip>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

interface HideBottomAppBarOnScrollProps {
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

interface BottomAppBarProps {
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
          <Tooltip title={t<string>('internalNavigationMenu.homeLabel')} arrow>
            <MuiLink
              color="inherit"
              underline="none"
              component={NextLinkComposed}
              to="/"
              aria-label={t('internalNavigationMenu.homeLabel')}
            >
              <IconButton sx={{ opacity: currentPath === '/' ? 1 : 0.6 }} color="inherit">
                <HomeIcon />
              </IconButton>
            </MuiLink>
          </Tooltip>

          <Tooltip title={t<string>('internalNavigationMenu.aboutLabel')} arrow>
            <MuiLink
              color="inherit"
              underline="none"
              component={NextLinkComposed}
              to="/about"
              aria-label={t('internalNavigationMenu.aboutLabel')}
            >
              <IconButton sx={{ opacity: currentPath === '/about' ? 1 : 0.6 }} color="inherit">
                <InfoIcon />
              </IconButton>
            </MuiLink>
          </Tooltip>

          <IconButton
            color="inherit"
            aria-label={t('appOptionsMenu.label')}
            aria-controls="menu-options"
            onClick={handleOpenDrawerMenuAction}
          >
            <MenuIcon />
          </IconButton>

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
                <ListItemText primary={t('translationMenu.drawerLabel')} />
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
                    <ListItemText inset primary={t('translationMenu.localeToLanguage.en-US')} />
                  </ListItemButton>
                  <ListItemButton
                    selected={currentLocale === 'pt-BR'}
                    component={NextLinkComposed}
                    to={currentPath}
                    locale="pt-BR"
                  >
                    <ListItemText inset primary={t('translationMenu.localeToLanguage.pt-BR')} />
                  </ListItemButton>
                </List>
              </Collapse>

              <ListItemButton
                component={NextLinkComposed}
                to="https://github.com/raphael-jorge/tablab-website"
                target="_blank"
                rel="noreferrer"
                aria-label={t('gitHubRepositoryLink.label')}
              >
                <ListItemIcon>
                  <GitHubIcon />
                </ListItemIcon>
                <ListItemText primary={t('gitHubRepositoryLink.drawerLabel')} />
              </ListItemButton>
            </List>
          </Drawer>
        </Toolbar>
      </AppBar>
    </HideBottomAppBarOnScroll>
  );
};

const Layout: FC = ({ children }) => {
  const theme = useTheme();
  const router = useRouter();

  const isMobile = useMediaQuery(theme.breakpoints.down(MOBILE_BREAKPOINT));

  return (
    <>
      <TopAppBar showMenu={!isMobile} currentPath={router.asPath} currentLocale={router.locale} />

      <Box sx={{ ml: 2, mr: 2 }}>
        <main>{children}</main>
      </Box>

      {isMobile && <BottomAppBar currentPath={router.asPath} currentLocale={router.locale} />}
    </>
  );
};

export default Layout;
