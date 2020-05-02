import React, { useState } from 'react';
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardHeader,
  CardContent,
  Collapse,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  IconButton,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

import { useAppTemplate } from 'contexts/AppTemplateContext';
import { useActions } from 'actions';

import { Confirm } from 'components/Controls/Confirm';
import { NewIntegration } from './NewIntegration';

import thegraphLogo from 'assets/images/thegraph.jpg';


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
                  <Avatar src={thegraphLogo} alt="The Graph" />
                </ListItemAvatar>
                <ListItemText
                  primary={integrations[integrationKey].type}
                  secondary={integrations[integrationKey].endpoint}
                />
                <ListItemSecondaryAction>
                  <Confirm onConfirm={() => onDelete(integrations[integrationKey])} title="Delete Integration" description="Delete integration?">
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </Confirm>
                </ListItemSecondaryAction>
              </ListItem>
            )) }
          </List>

        <Collapse in={showNewIntegration}>
          <NewIntegration onCancel={() => setShowNewIntegration(false)} />
        </Collapse>

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
