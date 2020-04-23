import React from 'react';
import {
  Button,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useExportTemplate } from './AppTemplateStore';

export const JsonView = () => {
  const exportTemplate = useExportTemplate();

  const exportedTemplate = exportTemplate();

  console.log('EXPORTED::: ', exportedTemplate);

  return (
    <div>
      <pre>
        { JSON.stringify(exportedTemplate, 1, '\t') }
      </pre>

      <br />
      <Button component={Link} to="/settings" variant="outlined">Back</Button>
    </div>
  );
};
