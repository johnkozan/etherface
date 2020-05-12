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
import { Link } from 'react-router-dom';
import { saveAppTemplate } from '../../lib/localstorage';
import { useAppTemplate, useSettings, serializeTemplate } from '../../contexts/AppTemplateContext';
import { useToasts } from 'react-toast-notifications'

import { useActions } from '../../actions';


export const SettingsMain = () => {
  const  template = useAppTemplate();
  const settings = useSettings();
  const { setSetting } = useActions();
  const { addToast } = useToasts();

  const saveToLocalstorage = () => {
    const exportedTemplate = serializeTemplate(template);
    saveAppTemplate(exportedTemplate);
    addToast('Template saved to localstorage', {apperance: 'success', autoDismiss: true, autoDismissTimeout: 3000});
  }

  const toggleOption = (option) => {
    setSetting(option, !settings[option]);
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
              <ListItemText primary={'Storage location: localstorage'} />
            </ListItem>

            <ListItem button onClick={() => toggleOption('autosave')}>
              <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={settings.autosave}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': 'checkbox-list-label-' }}
                  />
                </ListItemIcon>
                <ListItemText primary="Auto-save" />
              </ListItem>
            </List>
          </CardContent>

        <CardActions>
          <Button color="primary" variant="outlined" onClick={saveToLocalstorage}>Save to LocalStorage</Button>
          <Button variant="outlined" component={Link} to="/_/json">See JSON</Button>
        </CardActions>
      </Card>

    </div>
  );
}
