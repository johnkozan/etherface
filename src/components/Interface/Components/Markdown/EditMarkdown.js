import React from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  TextField,
} from '@material-ui/core';
import { useForm } from 'react-hooks-useform';
import { fromJS } from 'immutable';

import { useActions } from '../../../../actions';


export const EditMarkdown = ({ component, onCancel, onSave }) => {
  const { editComponent } = useActions();
  const initialValues = fromJS(component);
  const [fields, form] = useForm({
    fields: [
      { name: 'content', label: 'Content' },
    ],
    initialValues,
    submit: values => {
      editComponent({__id: component.__id, content: values.get('content')});
      onSave();
    },
  });

  return (
    <div>
      <Card>
        <CardHeader title="Editing component" />

        <CardContent>

        <TextField {...fields.content} multiline fullWidth rowsMax="20" />

      </CardContent>

      <CardActions>
        <Button variant="outlined" color="primary" onClick={form.submit}>Save</Button><Button variant="outlined" onClick={onCancel}>Cancel</Button>
      </CardActions>

    </Card>
    </div>

  );


};
