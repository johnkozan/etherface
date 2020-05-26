import React from 'react';
import {
  useMediaQuery,
  Fab,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles, useTheme } from "@material-ui/styles";


const useStyles = makeStyles(theme => ({
  fab: {
    position: 'fixed',
    top: 'auto',
    left: 'auto',
    margin: 0,
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

export const EditButton = ({ onClick }) => {
  const classes = useStyles();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"), {
    defaultMatches: true
  });

  return <Fab className={classes.fab} size={isDesktop ? 'large' : 'small'} onClick={onClick}><EditIcon /></Fab>;
};
