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

export const HttpStorageOptions = () => {
  const settings = useSettings();

  return <div>

    <List>
      <ListItem>
        <ListItemText primary={`File served from local computer. Download template to save changes`} />
      </ListItem>

    </List>

  </div>;
};
