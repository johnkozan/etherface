import React, { useEffect } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  TextField,
} from '@material-ui/core';
import { useForm } from 'react-hooks-useform';
import { Link } from 'react-router-dom';

import { useAddresses } from 'contexts/AppTemplateContext';
import { SelectField } from 'components/Controls/SelectField';

import { useContractByAddress } from 'lib/web3';

export const Web3TxOptions = ({ onCreate, onCancel }) => {
  const addresses = useAddresses();

  const addressOptions = (addresses || []).map(a => ({value: {network: a.network, address: a.address}, label: `${a.name || ''} ${a.address} (${a.network}) `}));

  const [fields, form] = useForm({
    fields: [
      {name: 'title', label: 'Title', optional: true},
      {name: 'description', label: 'Description', optional: true},
      {name: 'address', label: 'Address', type: 'select', options: addressOptions},
      {name: 'buttonText', label: 'Button text', optional: true},
    ],
    submit: values => {
      const { address, network } = values.get('address');
      onCreate({
        type: 'web3transaction',
        address,
        network,
        signature: values.get('function'),
        title: values.get('title'),
        description: values.get('description'),
        buttonText: values.get('buttonText'),
      });
      onCancel();
    },
  });

  const addAddressLink = addresses ? undefined : <div>
    <Link to="/_/addresses">
      Add an Ethereum contract to the address book in order to interact with it.
    </Link>
  </div>;

  return (
    <div>
      <form.Form>
        <Card>
          <CardHeader title="New Web3 Transaction" />
          <CardContent>
            { addAddressLink }

            <TextField fullWidth {...fields.title} />

            <TextField fullWidth {...fields.description} />

            <SelectField fullWidth {...fields.address} />

            { fields.address.value !== '' ?
                <SelectFunction {...fields.function } address={fields.address.value.address} network={fields.address.value.network} form={form} fields={fields} />
                :
                undefined
            }

            <TextField fullWidth {...fields.buttonText} />

          </CardContent>

          <CardActions>
            <Button variant="outlined" color="primary" onClick={form.submit}>Save</Button>
            <Button variant="outlined" onClick={onCancel}>Cancel</Button>
          </CardActions>

        </Card>
      </form.Form>
    </div>
  )

};

const SelectFunction = ({ address, network, form, fields, ...rest }) => {
  const contract = useContractByAddress(address, network);

  const queries = Object.filter(
    contract.interface.functions,
    i => i.type === "transaction" || i.type === 'call'
  );

  let queryFuncs = [];
  Object.keys(queries).forEach(q => {
    if (q.indexOf("(") > 0) {
      queryFuncs.push({value: queries[q].signature, label: queries[q].signature});
    }
  });

  useEffect(() => {
    form.addField(
      {name: 'function', label: 'Function', type: 'select', options: queryFuncs}
    );
  }, []);

  if (!fields.function) { return null; }

  return <SelectField {...fields.function } {...rest} />
};
