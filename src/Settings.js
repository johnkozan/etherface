import React from 'react';
import {
  Button,
  Card,
  CardActions,
  CardHeader,
  CardContent,
  Typography,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { saveAppTemplate } from './localstorage';
import { useAppTemplate, useExportTemplate } from './AppTemplateStore';
import { Integrations } from './Integrations';
import { Tabs } from './Tabs';

export const Settings = () => {
  const  template = useAppTemplate();
  const exportTemplate = useExportTemplate();

  const saveToLocalstorage = () => {
    const exportedTemplate = exportTemplate();
    console.log('Saving to localstoreage... ', exportedTemplate);
    saveAppTemplate(exportedTemplate);
    console.log('Saved!');
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>


      <Card>
        <CardHeader title="App Template" />
        <CardContent>
          Name: { template.name }
          <br />
          Location: localstorage

        </CardContent>
        <CardActions>
          <Button color="primary" variant="outlined" onClick={saveToLocalstorage}>Save to LocalStorage</Button>

          <Button variant="outlined" component={Link} to="/settings/json">See JSON</Button>
        </CardActions>
      </Card>

      <Tabs />

      <Integrations />


    </div>
  );
}
