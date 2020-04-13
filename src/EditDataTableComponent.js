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

import { useActions } from './actions';


export const EditDataTableComponent = ({ component, onCancel }) => {
  const { editComponent } = useActions();
  const initialValues = fromJS(component);
  const [fields, form] = useForm({
    fields: [
      { name: 'content', label: 'Content' },
    ],
    initialValues,
    submit: values => {
      editComponent({__id: component.__id, content: values.get('content')});
      onCancel();
    },
  });

  return (
    <div>
      <Card>
        <CardHeader title="Editing component" />
        <CardContent>

          TODO

      </CardContent>

      <CardActions>

        <Button variant="outlined" color="primary" onClick={form.submit}>Save</Button><Button variant="outlined" onClick={onCancel}>Cancel</Button>
      </CardActions>

    </Card>
    </div>

  );


};

