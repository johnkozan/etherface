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

import { useActions } from './actions';
import { useAppTemplate } from './AppTemplateStore';
import { NewTab } from './NewTab';


export const Tabs = () => {
  const  template = useAppTemplate();
  const { tabs } = template;
  const { deleteTab } = useActions();

  const onDelete = (tab) => {
    deleteTab(tab);
  };

  return (
    <div>
      <Card>
        <CardHeader title="Tabs" />

        <CardContent>
          <List dense={false}>
            { Object.keys(tabs).map(tabKey => (
              <ListItem key={tabs[tabKey].__id}>
                <ListItemAvatar>
                  <Avatar>
                    <FolderIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={tabs[tabKey].name}
                  secondary={`/${tabs[tabKey].slug}`}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="delete" onClick={() => onDelete(tabs[tabKey])}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            )) }
          </List>

          <NewTab />

        </CardContent>
      </Card>
    </div>
  );
}
