import React from "react";
import { makeStyles } from "@material-ui/styles";
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
