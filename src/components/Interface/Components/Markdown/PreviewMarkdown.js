import React from 'react';
import ReactMarkdown from "react-markdown";

import {
  Typography,
} from '@material-ui/core';

const PREVIEW_LINES = 5;

export const PreviewMarkdown = ({ component }) => {

  const contentByLine = component.content.split('\n');
  const previewContent = contentByLine.slice(0, Math.min(contentByLine.length, PREVIEW_LINES)).join('\n');

  return (
    <div>
      <Typography><strong>{ component.title }</strong></Typography>
      <ReactMarkdown source={previewContent} />
      <Typography><strong>...</strong></Typography>
    </div>
  );
}
