import React, { useState, forwardRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  useMediaQuery,
  Button,
  Collapse,
  Container,
  Divider,
  Drawer,
  Grid,
  Hidden,
  List,
  ListItem,
} from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import { makeStyles, useTheme } from "@material-ui/styles";
import clsx from "clsx";

import { SETTINGS_ROUTE } from './Routes';
import { Web3Status } from './Web3Status';
import { useAppTemplate } from './contexts/AppTemplateContext';

//import { Footer } from './Footer';

import { Emoji } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    height: "100%",
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    height: "100%",
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  navlist: {
    backgroundColor: theme.palette.white,
    //display: "flex",
    flexDirection: "column",
    height: "100%",
    padding: theme.spacing(2)
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  nav: {
    marginBottom: theme.spacing(2)
  },
  item: {
    display: "flex",
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: "auto",
  },
  settingsItem: {
    color: theme.palette.text.disabled,
    padding: "10px 4px",
    justifyContent: "flex-start",
    textTransform: "none",
    letterSpacing: 0,
    width: "100%",
    fontWeight: theme.typography.fontWeightMedium
  },
  button: {
    //color: colors.blueGrey[800],
    padding: "10px 8px",
    justifyContent: "flex-start",
    textTransform: "none",
    letterSpacing: 0,
    width: "100%",
    fontWeight: theme.typography.fontWeightMedium
  },
  icon: {
    color: theme.palette.icon,
    width: 24,
    height: 24,
    display: "flex",
    alignItems: "center",
    marginRight: theme.spacing(1)
  },
  active: {
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightMedium,
    "& $icon": {
      color: theme.palette.primary.main
    },
  },
}));

const NavLinkWithRef = forwardRef((props, ref) => (
  <NavLink innerRef={ref} {...props} />
));

const settingsSubNavs = [
  {name: 'Tabs', route: 'tabs', icon: SettingsIcon},
  {name: 'Integrations', route: 'integrations', icon: SettingsIcon},
  {name: 'Address book', route: 'addresses', icon: SettingsIcon},
];



export const Layout = ({ children }) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const location = useLocation();
  const { pathname } = location;
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"), {
    defaultMatches: true
  });

  const appTemplate = useAppTemplate();

  const [openSidebar, setOpenSidebar] = useState(false);

  const toggleSidebar = () => {
    setOpenSidebar(!openSidebar);
  };

  const shouldOpenSidebar = isDesktop ? true : openSidebar;

  const renderSettingsSubNavs = () => settingsSubNavs.map(s =>
    <ListItem className={classes.subitem} key={s.name}>
      <Button
        className={clsx(classes.button, (showSubSettings ? undefined : classes.settingsItem))}
        component={Link}
        to={`/_/${s.route}`}
      >
        <div className={classes.icon}></div>
        { s.name }
      </Button>
    </ListItem>
  );

  const showSubSettings = pathname.startsWith(SETTINGS_ROUTE);

  const container = window !== undefined ? () => window.document.body : undefined;

  const drawer = <div>
    <Grid container  style={{height: '100%'}}>
      <Grid item xs={12} style={{marginBottom: 'auto'}}>

        <List>
          { appTemplate.tabs && Object.keys(appTemplate.tabs).map((tabId, k) => (
            <ListItem className={classes.item} key={`/${appTemplate.tabs[tabId].slug}`} disableGutters>
              <Button
                activeClassName={classes.active}
                className={classes.button}
                component={NavLinkWithRef}
                to={`/${appTemplate.tabs[tabId].slug}`}
              >
                <div className={classes.icon}>
                  { appTemplate.tabs[tabId].icon ?
                    <Emoji emoji={appTemplate.tabs[tabId].icon} size={24} set={'apple'} /> : undefined
                  }
                </div>
                { appTemplate.tabs[tabId].name }
              </Button>

            </ListItem>
          )) }
        </List>

      </Grid>

      <Grid item xs={12}>
        <List className={classes.list} style={{marginTop: 'auto'}}>

          <Divider />
          <ListItem className={clsx(classes.item, classes.settings, (showSubSettings ? undefined : classes.settingsItem))} disableGutters>
            <Button
              className={clsx(classes.button, (showSubSettings ? undefined : classes.settingsItem))}
              component={Link}
              to={'/_/settings'}
            >
              <div className={clsx(classes.icon, classes.settingsItem)}>
                <SettingsIcon />
              </div>
              Settings
            </Button>
          </ListItem>

          <Collapse in={showSubSettings}>
            { renderSettingsSubNavs() }
          </Collapse>

        </List>
      </Grid>
    </Grid>
  </div>;

  return (
    <div className={classes.root}>
      <nav className={classes.drawer} aria-label="Navigation">

        { /* Mobile */ }
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={openSidebar}
            onClose={toggleSidebar}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>

        { /* Desktop */ }
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <Web3Status />
        { children }
      </main>
    </div>
  );
}
