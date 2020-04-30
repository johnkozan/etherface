import React from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  TextField,
  Typography,
} from '@material-ui/core';
import { useForm } from 'react-hooks-useform';
import { fromJS } from 'immutable';

import { useActions } from 'actions';


export const EditWeb3Tx = ({ component, onCancel }) => {
  const { editComponent } = useActions();
  const initialValues = fromJS(component);
  const [fields, form] = useForm({
    fields: [
      {name: 'description', label: 'Description', type: 'text', optional: true},
      {name: 'buttonText', label: 'Button text', type: 'text', optional: true},
    ],
    initialValues,
    submit: values => {
      let formValues = {};
      Array.from(values, ([key, value]) => formValues[key] = value);
      editComponent({
        ...component,
        ...formValues,
      });
      onCancel();
    },
  });

  return (
    <div>
      <form.Form>
        <Card>
          <CardHeader title="Edit Web3 component" />
          <CardContent>

            <Typography>Address: { component.address }</Typography>

            <br />

            <Typography>Function: { component.signature }</Typography>

            <br />

            <TextField {...fields.description } />

            <br />

            <TextField {...fields.buttonText } />

          </CardContent>

          <CardActions>
            <Button color="primary" variant="outlined" onClick={form.submit}>Save</Button>

            <Button variant="outlined" onClick={onCancel}>Cancel</Button>
          </CardActions>
        </Card>
      </form.Form>
    </div>
  );
}
