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
import CodeIcon from '@material-ui/icons/Code';
import GetAppIcon from '@material-ui/icons/GetApp';
import { Link } from 'react-router-dom';
import { useAppTemplate, useSettings, serializeTemplate } from '../../contexts/AppTemplateContext';
import { useToasts } from 'react-toast-notifications'
import fileDownload from 'js-file-download';


export const SettingsMain = () => {
  const template = useAppTemplate();
  const { addToast } = useToasts();

  const SettingsOptions = template.__source.settingsComponent;

  const download = () => {
    const exportedTemplate = serializeTemplate(template);
    const formatted = JSON.stringify(exportedTemplate, 1, '  ');
    fileDownload(formatted, 'template.json');
  };

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
          <Button variant="outlined" startIcon={<CodeIcon />} component={Link} to="/_/json">Template source JSON</Button>
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
