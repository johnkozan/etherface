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
import DescriptionIcon from '@material-ui/icons/Description';
import { useHistory } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications'
import { Confirm } from '../../components/Controls/Confirm';
import { useAppTemplate, useStorage, serializeTemplate, fileNameForTemplate } from '../../contexts/AppTemplateContext';
import { useSettings } from '../../contexts/SettingsContext';
import { useActions } from '../../actions';

import exampleTemplate from '../../examples/default.json';

export const LocalstorageOptions = () => {
  const template = useAppTemplate();
  const storage = useStorage();
  const { settings, setSetting } = useSettings();
  const { loadAppTemplate } = useActions();
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
  };

  const loadTemplate = async (fileName) => {
    const newTemplate = await storage.load(fileName);
    loadAppTemplate(newTemplate, storage);
    addToast(`Loaded template ${newTemplate.name}`, {apperance: 'success', autoDismiss: true, autoDismissTimeout: 3000});
  };

  const currentFileName = fileNameForTemplate(template);
  const fileList = storage.getFileList();

  return <div>

    <Typography variant="h6">Templates in Browser storage:</Typography>

    <List>
      { fileList.map(f =>
        <ListItem button onClick={() => loadTemplate(f)} color={f === currentFileName ? 'primary' : 'default'}>
          <ListItemIcon><DescriptionIcon /></ListItemIcon>
          <ListItemText>{ f }</ListItemText>
        </ListItem>
      ) }
      { !fileList || fileList.length === 0 ? <ListItem>
        <ListItemText>No templates in browser storage.</ListItemText>
      </ListItem> : undefined }
    </List>

    <Typography variant="h6">Browser storage settings</Typography>

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
          <ListItemText>Delete <strong>{ template.name }</strong> from browser storage</ListItemText>
        </ListItem>
      </Confirm>
    </List>

  </div>;
};

