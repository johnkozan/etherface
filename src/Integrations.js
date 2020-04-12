import React, { useState } from 'react';
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  IconButton,
  Typography,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import FolderIcon from '@material-ui/icons/Folder';
import { Link } from 'react-router-dom';
import { saveAppTemplate } from './localstorage';
import { useAppTemplate, useExportTemplate } from './AppTemplateStore';
import { NewIntegration } from './NewIntegration';

import { useActions } from './actions';

export const Integrations = () => {
  const  template = useAppTemplate();
  const { integrations } = template;
  const { deleteIntegration } = useActions();
  const [showNewIntegration, setShowNewIntegration] = useState(false);

  const onDelete = (integration) => {
    deleteIntegration(integration);
  };

  return (
    <div>
      <Card>
        <CardHeader title="Integrations" />
        <CardContent>
          <List dense={false}>
            { integrations && Object.keys(integrations).map(integrationKey => (
              <ListItem key={integrations[integrationKey].__id}>
                <ListItemAvatar>
                  <Avatar>
                    <FolderIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={integrations[integrationKey].type}
                  secondary={`/${integrations[integrationKey].endpoint}`}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="delete" onClick={() => onDelete(integrations[integrationKey])}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            )) }
          </List>

        { showNewIntegration ? <NewIntegration onCancel={() => setShowNewIntegration(false)} /> : undefined }

        </CardContent>

        <CardActions>
          { showNewIntegration ? undefined :
              <Button onClick={() => setShowNewIntegration(true)}>Add Integration</Button>
          }
        </CardActions>
      </Card>
    </div>
  );
}
