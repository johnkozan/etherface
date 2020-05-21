import React from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import {
  Box,
  Button,
  Chip,
  TextField,
  Typography,
} from '@material-ui/core';
import { useForm } from 'react-hooks-useform';
import { fromJS } from 'immutable';

import { useAddress } from '../../contexts/AppTemplateContext';
import { useActions } from '../../actions';
import { AddressABI } from './AddressABI';

export const EditAddress = () => {
  const { address, network } = useParams();
  const history = useHistory();
  const { editAddress } = useActions();
  const addressRecord = useAddress(address, network);

  const initialValues = fromJS(addressRecord);

  const [fields, form] = useForm({
    fields: [
      { name: 'name', label: 'Name', optional: true },
    ],
    initialValues,
    submit: (values) => {
      const name = values.get('name');

      editAddress({
        ...addressRecord,
        name,
      });
      history.push('/_/addresses');

    },
  });

  return (
    <div>
      <Typography variant="h6">{ address }{' '}<Chip label={network} variant="outlined" size="small" /></Typography>


      <form.Form>
        <Box my={2}>
          <TextField fullWidth {...fields.name} />
        </Box>

        <Box my={2}>

          <Button type="submit" onClick={form.submit} variant="outlined" color="primary">Save</Button>
          <Button component={Link} to="/_/addresses" variant="outlined">Cancel</Button>
        </Box>

      </form.Form>


      <Box my={2}>
        <AddressABI address={address} network={network} />
      </Box>

    </div>
  );
}
