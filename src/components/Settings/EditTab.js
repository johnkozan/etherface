import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  TextField,
} from '@material-ui/core';
import { useForm } from 'react-hooks-useform';
import { fromJS } from 'immutable';
import { Emoji } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';

import { EmojiPicker } from '../../components/Controls/EmojiPicker';
import { useActions } from '../../actions';
import { Confirm } from '../../components/Controls/Confirm';


export const EditTab = ({ tab, onCancel }) => {
  const { editTab, deleteTab } = useActions();
  const [showSelectIcon, setShowSelectIcon] = useState(false);

  const initialValues = fromJS(tab);
  const [fields, form] = useForm({
    fields: [
      { name: 'name', label: 'Name' },
      { name: 'slug', label: 'URL Slug' }, // TODO: Verifiation
    ],
    initialValues,
    submit: values => {
      editTab({
        ...tab,
        name: values.get('name'),
        slug: values.get('slug'),
      });
      onCancel();
    }
  });

  const onDelete = (tab) => {
    deleteTab(tab);
    onCancel();
  };

  const onRemoveIcon = () => {
    const newTab = Object.assign({}, tab, {icon: undefined});
    editTab(newTab);
    setShowSelectIcon(false);
  };

  const onSelectEmoji = (emoji) => {
    const newTab = Object.assign({}, tab, {icon: emoji.id});
    editTab(newTab);
    setShowSelectIcon(false);
  };

  const onCancelEmojii = () => {
    setShowSelectIcon(false);
  };

  const selectIcon = showSelectIcon ? <EmojiPicker onSelect={onSelectEmoji} onRemove={onRemoveIcon} onCancel={onCancelEmojii} /> : undefined;

  const iconText = tab.icon ? <span>Icon:{' '}<Emoji emoji={tab.icon} size={32} set={'apple'} /></span> : 'Select icon';

  return (
    <div>
      { selectIcon }
      <Card>
        <CardHeader title="Editing tab" />
        <form.Form>
          <CardContent>

            <Button onClick={() => setShowSelectIcon(true)}>
              { iconText }
            </Button>

            <TextField fullWidth {...fields.name} />

            <TextField fullWidth {...fields.slug} />

          </CardContent>

          <CardActions>

            <Button variant="outlined" color="primary" type="submit" onClick={form.submit}>Save</Button>
            <Button variant="outlined" onClick={onCancel}>Cancel</Button>

            <br />

            <Confirm onConfirm={() => onDelete(tab)} title="Delete Tab" description={<div>Delete tab "{tab.name}"?<br /><strong>WARNING:</strong> All related pages and their components will also be deleted.</div>}>
              <Button variant="outlined">Delete Tab</Button>
            </Confirm>

          </CardActions>

        </form.Form>
      </Card>
    </div>
  );
}
