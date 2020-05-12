import React from 'react';
import {
  Button,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import GetAppIcon from '@material-ui/icons/GetApp';

import { Link } from 'react-router-dom';
import fileDownload from 'js-file-download';

import { serializeTemplate, useAppTemplate } from '../../contexts/AppTemplateContext';

export const JsonView = () => {
  const template = useAppTemplate();
  const exportedTemplate = serializeTemplate(template);
  const formatted = JSON.stringify(exportedTemplate, 1, '  ');

  const download = () => {
    fileDownload(formatted, 'template.json');
  }

  return (
    <div>
      <Button component={Link} to="/_/settings" variant="outlined"><ArrowBackIcon />{' '}Back</Button>
      <Button variant="outlined" onClick={download}><GetAppIcon />{' '}Download Template JSON</Button>
      <pre>
        { formatted }
      </pre>

      <br />
      <Button component={Link} to="/_/settings" variant="outlined"><ArrowBackIcon />{' '}Back</Button>
    </div>
  );
};
