import React from 'react';
import {
  Button,
  TextField,
  Typography,
} from '@material-ui/core';
import { useForm } from 'react-hooks-useform';


export const EditWeb3Tx = ({ component, onCancel }) => {

  const [fields, form] = useForm({
    fields: [
      {name: 'description', label: 'Description', type: 'text'},
    ],
    submit: values => {
      //onCreate({
        //type: 'web3transaction',
        //address: values.get('address'),
        //signature: values.get('function'),
      //});
      //onCancel();
    },
  });

  return (
    <div>
      Edit Web3 Tx

      <form.Form>

        <Typography>Address: { component.address }</Typography>

        <Typography>Function: { component.signature }</Typography>

        <TextField {...fields.description } />


        <br />

        <Button color="primary" variant="outlined" onClick={form.submit}>Save</Button>

        <Button variant="outlined" onClick={onCancel}>Cancel</Button>

      </form.Form>

    </div>
  );
}
