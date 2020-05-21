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
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import { useHistory } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications'
import { Confirm } from '../../components/Controls/Confirm';
import { useAppTemplate, useSettings, useStorage, serializeTemplate } from '../../contexts/AppTemplateContext';
import { useActions } from '../../actions';

import exampleTemplate from '../../examples/default.json';

export const LocalstorageOptions = () => {
  const template = useAppTemplate();
  const storage = useStorage();
  const settings = useSettings();
  const { loadAppTemplate, setSetting } = useActions();
  const { addToast } = useToasts();
  const  history = useHistory();

  const toggleOption = (option) => {
    setSetting(option, !settings[option]);
  };

  const deleteFromLocalstorage = () => {
    storage.delete();

    loadAppTemplate(exampleTemplate, storage);

    addToast('Template deleted from browser localstorage', {apperance: 'success', autoDismiss: false});
    history.push('/');
  };

  const saveToStorage = () => {
    const exportedTemplate = serializeTemplate(template);
    storage.save(exportedTemplate);
    addToast('Template saved to localstorage', {apperance: 'success', autoDismiss: true, autoDismissTimeout: 3000});
  }


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

      <ListItem button onClick={saveToStorage}>
        <ListItemIcon>
          <SaveIcon />
        </ListItemIcon>
        <ListItemText>Save template to localstorage</ListItemText>
      </ListItem>

      <Confirm
        title="Delete template from Browser storage"
        description="Are you sure you want to delete the template from your browser's localstorage?"
        onConfirm={deleteFromLocalstorage}
      >
        <ListItem button>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText>Delete from Localstorage</ListItemText>
        </ListItem>
      </Confirm>
    </List>

  </div>;
};

