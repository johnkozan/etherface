import React, { useState, forwardRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  useMediaQuery,
  Avatar,
  Button,
  Collapse,
  Container,
  Divider,
  Drawer,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
} from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import { makeStyles, useTheme } from "@material-ui/styles";
import clsx from "clsx";

import { SETTINGS_ROUTE } from './Routes';
import { Web3Status } from './Web3Status';
import { useAppTemplate } from 'contexts/AppTemplateContext';

import { Footer } from './Footer';

import { Emoji } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';

const useStyles = makeStyles(theme => ({
  drawer: {
    //width: 220,
    //[theme.breakpoints.up("lg")]: {
      //marginTop: 64,
      //height: "calc(100% - 64px)"
    //}
  },
  root: {
    //paddingTop: 56,
    height: "100%",
    //[theme.breakpoints.up("sm")]: {
      //paddingTop: 64
    //}
  },
  shiftContent: {
    //paddingLeft: 240
  },
  content: {
    marginTop: 36,
    height: "100%"
  },
  navlist: {
    backgroundColor: theme.palette.white,
    display: "flex",
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

  const handleSidebarOpen = () => {
    setOpenSidebar(true);
  };

  const handleSidebarClose = () => {
    setOpenSidebar(false);
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

  return (
    <div
      className={clsx({
        [classes.root]: true,
        [classes.shiftContent]: isDesktop
      })}
    >
      <Container fixed>
      <Drawer
        anchor="left"
        classes={{ paper: classes.drawer }}
        open={shouldOpenSidebar}
        variant={isDesktop ? "persistent" : "temporary"}
        onClose={handleSidebarClose}
      >

      <div className={classes.navlist}>
        <Grid container  style={{height: '100%'}}>
          <Grid item xs={12} style={{marginBottom: 'auto'}}>

            <List className={classes.list}>
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

          <Grid item xs={12} style={{marginTop: 'auto'}}>
            <List className={classes.list}>

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

      </div>
    </Drawer>

    <main className={classes.content}>
      <Web3Status />
      { children }
    </main>

  </Container>
</div>
  );
}
