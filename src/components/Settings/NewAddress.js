import React, { useState } from 'react';
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
import { fromJS } from 'immutable';

import { ErrorMsg } from 'components/Controls/ErrorMsg';
import { SelectField } from 'components/Controls/SelectField';
import { Spinner } from 'components/Controls/Spinner';
import { NETWORKS } from '../../constants';
import { useActions } from 'actions';

const validateAddress = (address) => address.startsWith('0x') && address.length === 42 ? '' : 'Invalid address';


const fetchAbi = async (address, network) => {
    let result = await fetch(
      `https://${
          network === 'mainnet' ? 'api' : `api-${network}`
        }.etherscan.io/api?module=contract&action=getabi&address=${address}`,
    )
    let json = await result.json()
    if (json.status === '1') {
      return json.result;
    } else {
      throw new Error('Failed to fetch ABI from etherscan');
    }
};

export const NewAddress = ({ onCancel }) => {
  const { addAddress } = useActions();
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);

  const networkOptions = Object.keys(NETWORKS).map(n => ({value: NETWORKS[n].id, label: NETWORKS[n].name}));
  const initialValues = fromJS({network: 'mainnet'});
  const [fields, form] = useForm({
    fields: [
      { name: 'name', label: 'Name', optional: true },
      { name: 'address', label: 'Address', validate: validateAddress },
      { name: 'network', label: 'Network', type: 'select', options: networkOptions },
    ],
    initialValues,
    submit: async (values) => {
      const address = values.get('address');
      const network = values.get('network');
      const name = values.get('name');
      setFetching(true);
      let abi;
      try {
        abi = await fetchAbi(address, network);
        addAddress({network, address, abi, name});
        setFetching(false);
      } catch (err) {
        setError(err.toString());
        setFetching(false);
      }
    }
  });


  if (fetching) { return <Spinner />; }

  const errMsg = error ? <ErrorMsg message={error} /> : undefined;

    return (
    <Card>
      <CardHeader title="Add Ethereum address to addressbook" />
      <CardContent>
        { errMsg }

        <form.Form>
          <TextField fullWidth {...fields.name} />

          <SelectField fullWidth {...fields.network } />

          <TextField fullWidth {...fields.address} />

          <Button type='submit' onClick={form.submit}>Submit</Button>
        </form.Form>

      </CardContent>
    </Card>
  );
}
