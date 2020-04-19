import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  useMediaQuery,
  colors,
  Button,
  Divider,
  Drawer,
  Grid,
  List,
  ListItem,
} from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import { makeStyles, useTheme } from "@material-ui/styles";
import clsx from "clsx";

//import { TemplateContext } from './TemplateContext';
import { useAppTemplate } from './AppTemplateStore';


const useStyles = makeStyles(theme => ({
  drawer: {
    width: 240,
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
  //settingslist: {
    //marginTop: "auto",
  //},
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
  settings: {
    //marginTop: 'auto',
    position: 'absolute',
    bottom: 50,
    color: 'blue',
  },
  settingsItem: {
    color: theme.palette.text.secondary,
  },
  button: {
    color: colors.blueGrey[800],
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
    }
  }
}));

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

  return (
    <div
      className={clsx({
        [classes.root]: true,
        [classes.shiftContent]: isDesktop
      })}
    >
      <Drawer
        anchor="left"
        classes={{ paper: classes.drawer }}
        open={shouldOpenSidebar}
        variant={isDesktop ? "persistent" : "temporary"}
        onClose={handleSidebarClose}
      >

      <div className={classes.navlist}>
        <Grid container  style={{height: '100%'}}>
          <Grid item xs={12} style={{height: '100%'}}>

            <List className={classes.list} style={{height: '100%'}}>
              { appTemplate.tabs && Object.keys(appTemplate.tabs).map((tabId, k) => (
                <ListItem key={`page-${k}`} className={classes.item} key={`/${appTemplate.tabs[tabId].slug}`} disableGutters>
                  <Button
                    activeClassName={classes.active}
                    className={classes.button}
                    component={Link}
                    to={`/${appTemplate.tabs[tabId].slug}`}
                  >
                    <div className={classes.icon}></div>
                    { appTemplate.tabs[tabId].name }
                  </Button>

                </ListItem>
              )) }

              <Divider />

              <ListItem className={clsx(classes.item, classes.settings)} disableGutters>
                <Button
                  className={classes.button}
                  component={Link}
                  to={'/_/settings'}
                >
                  <div className={clsx(classes.icon, classes.settingsItem)}><SettingsIcon /></div>
                  Settings
                </Button>
              </ListItem>
            </List>

          </Grid>

        </Grid>

      </div>

    </Drawer>



    <main className={classes.content}>
      { children }
    </main>


  </div>
  );
}
