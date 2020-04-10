import React from "react";
import { makeStyles } from "@material-ui/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

import ReactMarkdown from "react-markdown";

const useStyles = makeStyles(theme => ({
  root: {}
}));

export const MarkdownComponent = ({ component }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ReactMarkdown source={component.content} />
    </div>
  );
};
