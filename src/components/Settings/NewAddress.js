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

const validateAddress = (address) => address.startsWith('0x') && address.length === 42 ? '' : 'Invalid address';


const fetchAbi = async (address, network) => {
  try {
    //const network = 'mainnet';
    //const address = '0xf5dce57282a584d2746faf1593d3121fcac444dc'
    let result = await fetch(
      `https://${
          network === 'mainnet' ? 'api' : `api-${network}`
        }.etherscan.io/api?module=contract&action=getabi&address=${address}`,
    )
    let json = await result.json()
    if (json.status === '1') {
      return json.result;
    } else {
      console.log('Failed to fetch ABI from etherscan');
      return;
    }

  } catch (err) {
    console.error(err);
    return;
  }
};

export const NewAddress = ({ onCancel }) => {
  const { addAddress } = useActions();
  const network = 'mainnet';

  const [fields, form] = useForm({
    fields: [
      { name: 'address', label: 'Address', validate: validateAddress },
    ],
    submit: async (values) => {
      const address = values.get('address');
      const abi = await fetchAbi(address, network);
      addAddress({network, address, abi});
    }

  });

  return (
    <Card>
      <CardHeader title="Add Ethereum address to addressbook" />
      <CardContent>

        <Typography>Network: mainnet</Typography>

        <form.Form>
          <Box flexDirection='column'>
            <TextField {...fields.address} />
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
