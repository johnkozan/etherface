import React, { useState } from 'react';
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
import AddIcon from '@material-ui/icons/Add';

import { Emoji } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';

import { Confirm } from 'components/Controls/Confirm';
import { useActions } from 'actions';
import { useAppTemplate } from 'contexts/AppTemplateContext';
import { NewTab } from './NewTab';

import { EmojiPicker } from 'components/Controls/EmojiPicker';

function byId(set, id) {
  const keys = Object.keys(set);
  for (let x=0; x < keys.length; x++) {
    if (set[keys[x]].__id === id) { return set[keys[x]];}
  }
}

export const Tabs = () => {
  const  template = useAppTemplate();
  const { tabs } = template;
  const { editTab, deleteTab } = useActions();
  const [selectIconTabId, setSelectIconTabId] = useState();

  const onDelete = (tab) => {
    deleteTab(tab);
  };

  const onSelectEmoji = (emoji) => {
    const tab = byId(tabs, selectIconTabId);
    const newTab = Object.assign({}, tab, {icon: emoji.id});
    editTab(newTab);
    setSelectIconTabId(undefined);
  };

  const onRemoveIcon = () => {
    const tab = byId(tabs, selectIconTabId);
    const newTab = Object.assign({}, tab, {icon: undefined});
    editTab(newTab);
    setSelectIconTabId(undefined);
  }

  const selectIcon = !!selectIconTabId ? <EmojiPicker onSelect={onSelectEmoji} onRemove={onRemoveIcon} /> : undefined;

  return (
    <div>
      { selectIcon }
      <Card>
        <CardHeader title="Tabs" />

        <CardContent>
          <List dense={false}>
            { Object.keys(tabs).map(tabKey => (
              <ListItem key={tabs[tabKey].__id}>
                <ListItemAvatar onClick={() => setSelectIconTabId(tabs[tabKey].__id)} >
                  { tabs[tabKey].icon ?
                      <Emoji emoji={tabs[tabKey].icon} size={32} set={'apple'} /> :
                      <FolderIcon />
                  }
                </ListItemAvatar>
                <ListItemText
                  primary={tabs[tabKey].name}
                  secondary={<Link to={`/${tabs[tabKey].slug}`}>{`/${tabs[tabKey].slug}`}</Link>}
                />
                <ListItemSecondaryAction>
                  <Confirm onConfirm={() => onDelete(tabs[tabKey])} title="Delete Tab" description={`Delete tab "${tabs[tabKey].name}"?`}>
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </Confirm>
                </ListItemSecondaryAction>
              </ListItem>
            )) }

            <ListItem>
              <ListItemAvatar>
                <AddIcon />
              </ListItemAvatar>
              <ListItemText>
                <NewTab />
              </ListItemText>

            </ListItem>
          </List>

        </CardContent>
      </Card>
    </div>
  );
}
