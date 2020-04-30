import React from 'react';
import {
  Button,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import fileDownload from 'js-file-download';

import { useExportTemplate } from 'contexts/AppTemplateContext';

export const JsonView = () => {
  const exportTemplate = useExportTemplate();

  const exportedTemplate = exportTemplate();

  console.log('EXPORTED::: ', exportedTemplate);

  const formatted = JSON.stringify(exportedTemplate, 1, '  ');

  const download = () => {
    fileDownload(formatted, 'template.json');
  }

  return (
    <div>
      <Button variant="outlined" onClick={download}>Save</Button>
      <pre>
        { formatted }
      </pre>

      <br />
      <Button component={Link} to="/settings" variant="outlined">Back</Button>
    </div>
  );
};
