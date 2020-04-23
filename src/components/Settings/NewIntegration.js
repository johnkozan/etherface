import React from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  TextField,
  Typography,
} from '@material-ui/core';
import { useForm } from 'react-hooks-useform';

import { useActions } from 'actions';

export const NewIntegration = ({ onCancel }) => {
  const { addIntegration } = useActions();

  const [fields, form] = useForm({
    fields: [
      { name: 'endpoint', label: 'Endpoint' },
    ],
    submit: values => { addIntegration({type: 'thegraph', endpoint: values.get('endpoint')}); }
  });

  return (
    <Card>
      <CardHeader title="New Integration" />
      <CardContent>

        <Typography>TheGraph</Typography>

        <form.Form>
          <Box flexDirection='column'>
            <TextField {...fields.endpoint} />
          </Box>
          <Button type='submit' onClick={form.submit}>Submit</Button>
        </form.Form>


      </CardContent>
      <CardActions>
        <Button color="primary">Save</Button>
        <Button onClick={onCancel}>Cancel</Button>
      </CardActions>
    </Card>
  );
}
