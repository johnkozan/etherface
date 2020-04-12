import React from 'react';
import {
  Button,
  TextField,
  Typography,
} from '@material-ui/core';

import { useForm } from 'react-hooks-useform';

import { useActions } from './actions';

export const NewTab = () => {
  const { addTab } = useActions();

  const [fields, form] = useForm({
    fields: [
      { name: 'name', label: 'Name' },
    ],
    submit: values => { addTab({name: values.get('name')}); }
  });


  return (
    <div>

      <Typography>Add tab</Typography>

      <TextField {...fields.name } />

      <br />

      <Button color="primary" onClick={form.submit}>Add Tab</Button>

    </div>
  );
}
