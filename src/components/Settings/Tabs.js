import React from 'react';
import { Link } from 'react-router-dom';
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

import { Confirm } from 'components/Controls/Confirm';
import { useActions } from 'actions';
import { useAppTemplate } from 'contexts/AppTemplateContext';
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
                  secondary={<Link to={`/${tabs[tabKey].slug}`}>{`/${tabs[tabKey].slug}`}</Link>}
                />
                <ListItemSecondaryAction>
                  <Confirm onConfirm={() => onDelete(tabs[tabKey])} title="Delete Tab" description="Delete tab?">
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </Confirm>
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
