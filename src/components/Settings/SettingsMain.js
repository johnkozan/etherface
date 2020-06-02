import React, { useState } from 'react';
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
  TextField,
  Typography,
} from '@material-ui/core';
import CodeIcon from '@material-ui/icons/Code';
import GetAppIcon from '@material-ui/icons/GetApp';
import { Link } from 'react-router-dom';
import fileDownload from 'js-file-download';
import { useForm } from 'react-hooks-useform';
import { useToasts } from 'react-toast-notifications'
import { fromJS } from 'immutable';

import { useActions } from '../../actions';
import { ErrorMsg } from '../../components/Controls/ErrorMsg';
import { useAppTemplate, useSettings, serializeTemplate, fileNameForTemplate } from '../../contexts/AppTemplateContext';


export const SettingsMain = () => {
  const template = useAppTemplate();
  const { editTemplate } = useActions();
  const { addToast } = useToasts();
  const [error, setError] = useState(null);

  const initialValues = fromJS({
    name: template.name,
  });
  const [fields, form] = useForm({
    fields: [
      { name: 'name', label: 'Name' },
    ],
    initialValues,
    submit: values => {
      try {
        editTemplate({
          name: values.get('name'),
        });
      } catch (err) {
        setError(err.toString());
      }
    }
  });

  const SettingsOptions = template.__source.settingsComponent;

  const download = () => {
    const fileName = fileNameForTemplate(template);
    const exportedTemplate = serializeTemplate(template);
    const formatted = JSON.stringify(exportedTemplate, 1, '  ');
    fileDownload(formatted, 'template.json');
  };

  const errMsg = error ? <ErrorMsg message={error} /> : undefined;

  return (
    <div>
      { errMsg }
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Card>
          <form.Form>
        <CardHeader title="App Template" />

        <CardContent>
          <List>
            <ListItem>
              <TextField {...fields.name } />
            </ListItem>

            <ListItem>
              <ListItemText primary={`Location: ${template.__source.name}`} />
            </ListItem>
          </List>

        </CardContent>

        <CardActions>
          <Button vairant="outlined" color="primary" type="submit" onClick={form.submit} disabled={form.getIsPristine()}>Save changes</Button>
          <Button variant="outlined" startIcon={<CodeIcon />} component={Link} to="/_/json">Template source JSON</Button>
          <Button variant="outlined" startIcon={<GetAppIcon />} onClick={download}>Download Template</Button>
        </CardActions>
      </form.Form>
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
