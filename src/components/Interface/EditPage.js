import React, { useState } from 'react';
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  IconButton,
  TextField,
  Typography,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import FolderIcon from '@material-ui/icons/Folder';

import { fromJS } from 'immutable';
import { useForm } from 'react-hooks-useform';

import { useComponentsByPageId } from 'contexts/AppTemplateContext';
import { useActions } from 'actions';
import { Confirm } from 'components/Controls/Confirm';

import { EditMarkdownComponent } from './EditMarkdownComponent';
import { EditDataTableComponent } from './EditDataTableComponent';
import { EditWeb3Tx } from './EditWeb3Tx';

export const EditPage = ({ page, onCancel }) => {
  const { editPage, deleteComponent } = useActions();
  const components = useComponentsByPageId(page.__id);
  const [editComponent, setEditComponent] = useState();

  const initialValues = fromJS(page);
  const [fields, form] = useForm({
    fields: [
      { name: 'title', label: 'title', required: false },
    ],
    initialValues,
    submit: values => {
      editPage({
        ...page,
        title: values.get('title'),
      });
      onCancel();
    }
  });

  if (editComponent !== undefined) {
    const component = components[editComponent];
    switch (component.type) {
      case 'markdown':
        return <EditMarkdownComponent component={component} onCancel={() => setEditComponent(undefined)} />;
      case 'datatable':
        return <EditDataTableComponent component={component} onCancel={() => setEditComponent(undefined)} />;
      case 'web3transaction':
        return <EditWeb3Tx component={component} onCancel={() => setEditComponent(undefined)} />;

      default:
        throw new Error('unknown component type ', component.type);
    }
  }

  const onDelete = (component) => {
    deleteComponent(component);
  };

  return (
    <Card>
      <CardHeader title="Page properties" />
      <CardContent>

        <TextField {...fields.title} />

        <Typography gutterBottom underlined>Page Components</Typography>
          <List dense={false}>
            { components && Object.keys(components).map(componentKey => (
              <ListItem key={components[componentKey].__id}>
                <ListItemAvatar>
                  <Avatar>
                    <FolderIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={components[componentKey].type}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="delete" onClick={() => setEditComponent(components[componentKey].__id)}>
                    <EditIcon />
                  </IconButton>

                  <Confirm onConfirm={() => onDelete(components[componentKey])} title="Delete Component" description="Delete this component?">
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </Confirm>
                </ListItemSecondaryAction>
              </ListItem>
            )) }
          </List>

      </CardContent>

      <CardActions>
        <Button color="primary" variant="outlined" onClick={form.submit}>Save</Button>
        <Button variant="outlined" onClick={onCancel}>Cancel</Button>
      </CardActions>

    </Card>
  );
}
