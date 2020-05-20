import React from 'react';
import {
  Button,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@material-ui/core';
import { useSettings } from '../../contexts/AppTemplateContext';
import { useActions } from '../../actions';

export const LocalstorageOptions = () => {
  const settings = useSettings();
  const { setSetting } = useActions();

  const toggleOption = (option) => {
    setSetting(option, !settings[option]);
  };

  return <div>

    <List>
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
        <ListItemText primary="Auto-save changes to browser storage" />
      </ListItem>

      <ListItem>
        <Button variant="outlined">Delete from Localstorage</Button>
      </ListItem>
    </List>

  </div>;
};

