import React from 'react';
import { Fab } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles } from "@material-ui/styles";


const useStyles = makeStyles(theme => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

export const EditButton = ({ onClick }) => {
  const classes = useStyles();

  return <Fab className={classes.fab} color="primary" onClick={onClick}><EditIcon /></Fab>;
};
