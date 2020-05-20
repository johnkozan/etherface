import React from 'react';
import {
  Button,
  Card,
  CardActions,
  CardHeader,
  CardContent,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import { Link } from 'react-router-dom';
import { saveAppTemplate } from '../../lib/localstorage';
import { useAppTemplate, useSettings, serializeTemplate } from '../../contexts/AppTemplateContext';
import { useToasts } from 'react-toast-notifications'
import fileDownload from 'js-file-download';


export const SettingsMain = () => {
  const template = useAppTemplate();
  const { addToast } = useToasts();

  const saveToStorage = () => {
    const exportedTemplate = serializeTemplate(template);
    saveAppTemplate(exportedTemplate);
    addToast('Template saved to localstorage', {apperance: 'success', autoDismiss: true, autoDismissTimeout: 3000});
  }

  const SettingsOptions = template.__source.options;

  const download = () => {
    const exportedTemplate = serializeTemplate(template);
    const formatted = JSON.stringify(exportedTemplate, 1, '  ');
    fileDownload(formatted, 'template.json');
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Card>
        <CardHeader title="App Template" />

        <CardContent>
          <List>
            <ListItem>
              <ListItemText primary={`Name: ${template.name}`} />
            </ListItem>

            <ListItem>
              <ListItemText primary={`Location: ${template.__source.name}`} />
            </ListItem>
          </List>

        </CardContent>

        <CardActions>
          <Button color="primary" variant="outlined" onClick={saveToStorage}>Save</Button>
          <Button variant="outlined" component={Link} to="/_/json">See JSON</Button>
          <Button variant="outlined" startIcon={<GetAppIcon />} onClick={download}>Download Template</Button>
        </CardActions>
      </Card>

      <Card>
        <CardHeader title="Storage settings" />

        <CardContent>

          <SettingsOptions />

        </CardContent>

        <CardActions>
        </CardActions>
      </Card>


    </div>
  );
}
