import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";
import ReactMarkdown from "react-markdown";

import { EditMarkdownComponent } from './EditMarkdownComponent';
import { EditButton } from './EditButton';

const useStyles = makeStyles(theme => ({
  root: {}
}));

export const MarkdownComponent = ({ component }) => {
  const classes = useStyles();
  const [editMode, setEditMode] = useState(false);

  return (
    <div className={classes.root}>

      { editMode ?
        <EditMarkdownComponent component={component} onCancel={() => setEditMode(false)} />
        :
        <div>
          <ReactMarkdown source={component.content} />
          <EditButton onClick={() => setEditMode(true)} />
        </div>
      }

    </div>
  );
};
