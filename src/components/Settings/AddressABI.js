import React from 'react';
import {
  Box,
  List,
  ListItem,
  Typography,
} from '@material-ui/core';
import { useContractByAddress, useHasSigner } from '../../lib/web3';

export const AddressABI = ({ address, network }) => {
  const contract = useContractByAddress(address, network);

  if (!contract) {
    // Not a contract, or do not have ABI
    // Add option to add an ABI?
    return null;
  }

  const calls = Object.filter(contract.interface.functions, f => f.type === 'call');
  const callFns = Object.keys(calls).filter(n => n.indexOf('(') > -1);

  const txs = Object.filter(contract.interface.functions, f => f.type === 'transaction');
  const txFns = Object.keys(calls).filter(n => n.indexOf('(') > -1);

  const events = Object.keys(contract.interface.events).filter(n => n.indexOf('(') > -1);

  return (
    <div>
      <Typography>Contract ABI</Typography>

      <Box my={3}>
        <Typography>Call functions</Typography>

        <List>
        { callFns.map(callFn => {
          return <ListItem key={callFn}>{ callFn }</ListItem>;
        }) }
      </List>

    </Box>

      <Box my={3}>
        <Typography>Transactions</Typography>

        <List>
        { txFns.map(txFn => {
          return <ListItem key={txFn}>{ txFn }</ListItem>;
        }) }
      </List>

    </Box>

      <Box my={3}>
        <Typography underline>Events</Typography>

        <List>
        { events.map(event => {
          return <ListItem key={event}>{ event }</ListItem>;
        }) }
      </List>

      </Box>
    </div>
  );
}
