import React, { useState } from 'react';
import {
  Button,
  InputAdornment,
  TextField,
} from '@material-ui/core';

import { useForm } from 'react-hooks-useform';

import { ErrorMsg } from '../../components/Controls/ErrorMsg';
import { useActions } from '../../actions';

export const NewTab = () => {
  const { addTab } = useActions();
  const [error, setError] = useState(null);

  const [fields, form] = useForm({
    fields: [
      { name: 'name', label: 'Name' },
    ],
    submit: values => {
      try {
        addTab({
          name: values.get('name'),
        });
      } catch (err) {
        setError(err.toString());
      }
    }
  });

  const errMsg = error ? <ErrorMsg message={error} /> : undefined;

  return (
    <div>
      { errMsg }
      <form.Form>
        <TextField
          fullWidth
          {...fields.name }
          InputProps={{endAdornment: <InputAdornment position="end"><Button type="submit" color="primary" onClick={form.submit}>Add Tab</Button></InputAdornment>}}
        />
      </form.Form>
    </div>
  );
}
