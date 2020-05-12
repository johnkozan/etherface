import React, { useState } from 'react';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Collapse,
  Checkbox,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  FormControlLabel,
  TextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ApartmentIcon from '@material-ui/icons/Apartment';
import { blue } from '@material-ui/core/colors';


import { useForm } from 'react-hooks-useform';
import { fromJS } from 'immutable';

import { FileUploader } from '../../components/Controls/FileUploader';
import { ErrorMsg } from '../../components/Controls/ErrorMsg';
import { SelectField } from '../../components/Controls/SelectField';
import { Spinner } from '../../components/Controls/Spinner';
import { NETWORKS } from '../../constants';
import { useActions } from '../../actions';
import { fetchAbi } from '../../lib/etherscan';

const validateAddress = (address) => address.startsWith('0x') && address.length === 42 ? '' : 'Invalid address';

const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
});

export const NewAddress = ({ onCancel }) => {
  const { addAddress } = useActions();
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);
  const [deployedOptions, setDeployedOptions] = useState(null);

  const networkOptions = Object.keys(NETWORKS).map(n => ({value: NETWORKS[n].id, label: NETWORKS[n].name}));
  const initialValues = fromJS({network: 'mainnet', fetchabi: true});
  const [fields, form] = useForm({
    fields: [
      { name: 'name', label: 'Name', optional: true },
      { name: 'address', label: 'Address', validate: validateAddress },
      { name: 'network', label: 'Network', type: 'select', options: networkOptions },
      { name: 'fetchabi', label: 'Fetch ABI from Etherscan?', type: 'boolean' },
      { name: 'abi', label: 'ABI', optional: true },
    ],
    initialValues,
    submit: async (values) => {
      const address = values.get('address');
      const network = values.get('network');
      const name = values.get('name');

      setFetching(true);
      try {
        let abi;
        if (values.get('fetchabi')) {
          abi = await fetchAbi(address, network);
        } else {
          abi = values.get('abi');
        }
        addAddress({network, address, abi, name});
        form.reset();
        setFetching(false);

      } catch (err) {
        setError(err.toString());
        setFetching(false);
      }
    }
  });


  if (fetching) { return <Spinner />; }

  const handleTruffleJson = (truffleJson) => {
    const json = JSON.parse(truffleJson);

    const deployedNetworks = Object.keys(json.networks).map(chainId => ({
      chainId,
      address: json.networks[chainId].address,
    }));

    form.setValue('fetchabi', false);
    form.setValue('name', json.contractName);
    form.setValue('abi', JSON.stringify(json.abi));

    if (deployedNetworks.length === 1) {
      const networkId = NETWORKS.find(n => n.chainId == deployedNetworks[0].chainId);
      form.setValue('network', networkId.id);
      form.setValue('address', deployedNetworks[0].address);
    } else if (deployedNetworks.length > 1) {
      setDeployedOptions(deployedNetworks);
    }
  };

  const handleDeploymentSelection = (network) => {
    const networkId = NETWORKS.find(n => n.chainId == network.chainId);
    form.setValue('network', networkId.id);
    form.setValue('address', network.address);
    setDeployedOptions(null);
  };

  return (
    <Card>
      <CardHeader title="Add Ethereum address to addressbook" />
      <CardContent>
        { error ? <ErrorMsg message={error} /> : undefined }
        { deployedOptions ? <NetworkOptionsSelector options={deployedOptions} onSelect={handleDeploymentSelection} /> : undefined }

        <form.Form>
          <TextField fullWidth {...fields.name} />

          <SelectField fullWidth {...fields.network } />

          <TextField fullWidth {...fields.address} />

          <FormControlLabel
            control={<Checkbox {...fields.fetchabi}  />}
            label={fields.fetchabi.label}
          />

        <Collapse in={!fields.fetchabi.value}>
          <TextField multiline fullWidth {...fields.abi } />
        </Collapse>

        <Button type='submit' variant="outlined" color="primary" onClick={form.submit}>Submit</Button>
        {' '}
        <FileUploader variant="outlined" onFileUpload={handleTruffleJson}>Upload Truffle build .json</FileUploader>
      </form.Form>

    </CardContent>
  </Card>
  );
}

const NetworkOptionsSelector = ({options, onSelect}) => {
  const classes = useStyles();

  const handleListItemClick = (value) => {
    onSelect(value);
  };

  return (
    <Dialog aria-labelledby="simple-dialog-title" open={true}>
      <DialogTitle id="simple-dialog-title">Select Deployed Contract</DialogTitle>
      <List>
        {options.map((network) => {
          const networkRecord = NETWORKS.find(n => n.chainId == network.chainId);
          if (!networkRecord) { return; }
          return (
            <ListItem button onClick={() => handleListItemClick(network)} key={network.chainId}>
            <ListItemAvatar>
              <Avatar className={classes.avatar}>
                <ApartmentIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={networkRecord.name} secondary={network.address} />
          </ListItem>
          );
        })}
      </List>
    </Dialog>
  );

};
