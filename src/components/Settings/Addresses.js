import React, { useEffect } from 'react';

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
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import FolderIcon from '@material-ui/icons/Folder';

import { useAppTemplate } from 'AppTemplateStore';
import { useActions } from 'actions';

import { NewAddress } from './NewAddress';


export const Addresses = () => {
  const  template = useAppTemplate();
  const { addresses } = template;
  const { deleteAddress } = useActions();

  const onDelete = (address) => {
    deleteAddress(address);
  };

  return (
    <div>
      <Card>
        <CardHeader title="Addresses" />
        <CardContent>
          <List dense={false}>
            { addresses && Object.keys(addresses).map(addressKey => (
              <ListItem key={addressKey}>
                <ListItemAvatar>
                  <Avatar>
                    <FolderIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={addressKey}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="delete" onClick={() => onDelete(addressKey)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            )) }
          </List>

          <NewAddress />

        </CardContent>

      </Card>
    </div>
  );
}
