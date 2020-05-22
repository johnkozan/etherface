import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  IconButton,
  Typography,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import FolderIcon from '@material-ui/icons/Folder';
import AddIcon from '@material-ui/icons/Add';

import { Emoji } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';

import { useActions } from '../../actions';
import { useAppTemplate } from '../../contexts/AppTemplateContext';
import { NewTab } from './NewTab';
import { EditTab } from './EditTab';

import { EmojiPicker } from '../../components/Controls/EmojiPicker';

function byId(set, id) {
  const keys = Object.keys(set);
  for (let x=0; x < keys.length; x++) {
    if (set[keys[x]].__id === id) { return set[keys[x]];}
  }
}

export const Tabs = () => {
  const  template = useAppTemplate();
  const { tabs } = template;
  const { editTab } = useActions();
  const [selectIconTabId, setSelectIconTabId] = useState();
  const [selectedEditTab, setSelectedEditTab] = useState();

  if (selectedEditTab) {
    const tab = byId(tabs, selectedEditTab);
    return <EditTab tab={tab} onCancel={() => setSelectedEditTab(undefined)} />;
  }

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
  };

  const onCancelEmojii = () => {
    setSelectIconTabId(undefined);
  };

  const selectIcon = !!selectIconTabId ? <EmojiPicker onSelect={onSelectEmoji} onRemove={onRemoveIcon} onCancel={onCancelEmojii} /> : undefined;

  return (
    <div>
      { selectIcon }
      <Card>
        <CardHeader title="Tabs" />

        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
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
                      <IconButton edge="end" aria-label="delete" onClick={() => setSelectedEditTab(tabs[tabKey].__id)}>
                        <EditIcon />
                      </IconButton>
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

            </Grid>

            <Grid item xs={12} md={4}>
              <Typography>
                Tabs defined the navigation of your interface.
              </Typography>
              <Typography>
                Each tab will appear in the navigation bar on the left.
              </Typography>
              <Typography>
                A tab can have multiple pages.
              </Typography>
            </Grid>

          </Grid>

        </CardContent>
      </Card>
    </div>
  );
}
