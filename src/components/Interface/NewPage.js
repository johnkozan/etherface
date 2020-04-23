import React from 'react';
import {
  Button,
  TextField,
  Typography,
} from '@material-ui/core';

import { useForm } from 'react-hooks-useform';

import { useActions } from 'actions';

export const NewPage = ({ tab_id }) => {
  const { addPage } = useActions();

  const [fields, form] = useForm({
    fields: [
      { name: 'title', label: 'title' },
    ],
    submit: values => { addPage({title: values.get('title'), __tab_id: tab_id}); }
  });


  return (
    <div>

      <Typography>Add page</Typography>

      <TextField {...fields.title } autoFocus />

      <br />

      <Button color="primary" onClick={form.submit}>Add Page</Button>

    </div>
  );
}

