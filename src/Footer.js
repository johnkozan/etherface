import React from 'react';
import {
  Typography,
} from '@material-ui/core';
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
  root: {
    //padding: theme.spacing(4),
    textAlign: 'center',
    position: 'absolute',
    bottom: 0,
    width: '100% !important',
    color: theme.palette.text.disabled,
  },
  link: {
    color: theme.palette.text.disabled,
  }
}));


export const Footer = ({ rest }) => {
  const classes = useStyles();

  return (
    <div {...rest} className={classes.root}>
      <Typography variant="caption">
        created with <a className={classes.link} href="https://github.com/johnkozan/etherface" target="_blank" rel="noopener noreferrer">etherface</a>
      </Typography>
    </div>
  );

}
