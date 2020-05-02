import React from 'react';
import {
  Avatar,
  Card,
  CardHeader,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  IconButton,
} from '@material-ui/core';
import { makeStyles } from "@material-ui/styles";
import DeleteIcon from '@material-ui/icons/Delete';

import { useAppTemplate } from 'contexts/AppTemplateContext';
import { useActions } from 'actions';

import { Identicon } from 'components/Controls/Identicon';
import { Confirm } from 'components/Controls/Confirm';
import { NewAddress } from './NewAddress';

const useStyles = makeStyles(theme => ({
  identicon: {
    height: 100,
    width: 100,
    //borderRadius: 200,
  },
}));

export const Addresses = () => {
  const classes = useStyles();
  const template = useAppTemplate();
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
                    <Identicon address={address.address} pixelWidth={42} className={classes.identicon} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={address.name ? address.name: <span>{ address.address}{' '}<Chip label={address.network} variant="outlined" size="small" /></span>}
                  secondary={address.name ? <span>{ address.address }{' '}<Chip label={address.network} variant="outlined" size="small" /></span> : null }
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
