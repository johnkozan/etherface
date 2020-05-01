import React from 'react';
import {
  Avatar,
  Card,
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

import { useAppTemplate } from 'contexts/AppTemplateContext';
import { useActions } from 'actions';

import { Confirm } from 'components/Controls/Confirm';
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
            { addresses && addresses.map(address => (
              <ListItem key={address.address}>
                <ListItemAvatar>
                  <Avatar>
                    <FolderIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={address.address}
                />
                <ListItemSecondaryAction>
                  <Confirm onConfirm={() => onDelete(address)} title="Delete Address" description="Remove address from address book?">
                    <IconButton edge="end" aria-label="delete" >
                      <DeleteIcon />
                    </IconButton>
                  </Confirm>
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
