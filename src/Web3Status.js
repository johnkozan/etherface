import React, { useEffect } from 'react';
import {
  Chip,
} from '@material-ui/core';
import { makeStyles } from "@material-ui/styles";
import { useWeb3React } from '@web3-react/core'
import { SnackbarProvider, useSnackbar } from 'notistack';
import { EtherscanTxLink } from './lib/etherscan'

import { useTransactions, BlockNumberWatcher, TransactionStatusWatcher } from './contexts/Web3Context';

import { Identicon } from './components/Controls/Identicon';

const useStyles = makeStyles(theme => ({
  chip: {
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
  },
  identicon: {
    marginLeft: 6,
    marginTop: 4,
  },
  snacks: {
    top: theme.spacing(8),
  },
}));

export const Web3Status = () => {
  const classes = useStyles();
  const { account } = useWeb3React();

	if (!account) {
    return (
      <div>
        <Chip
          className={classes.chip}
          label="Connect web3 wallet"
        />
      </div>
    );
  }

  return (
    <div>

      <BlockNumberWatcher />
      <TransactionStatusWatcher />

      <Chip
        className={classes.chip}
        label={`${account.substr(0,6)}...${account.substr(38, 4)}`}
        avatar={<span className={classes.identicon}><Identicon address={account} /></span>}
      />

    <SnackbarProvider
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      preventDuplicate={true}
      className={classes.snacks}
    >
      <Web3TransactionList />
    </SnackbarProvider>

    </div>
  );
}

const Web3TransactionList = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const transactions = useTransactions();

  useEffect(() => {
    Object.keys(transactions).forEach(hash => {
      const tx = transactions[hash];
      const confirmed = !!tx.receipt;
      if (confirmed) {
        closeSnackbar(hash);
        enqueueSnackbar(<EtherscanTxLink hash={hash} chainId={tx.chainId} prefix="Confirmed:" />, {variant: 'success', persist: true, key: `${hash}-confirmed`});
      } else {
        enqueueSnackbar(<EtherscanTxLink hash={hash} chainId={tx.chainId} prefix="Pending:" />, {variant: 'info', persist: true, key: hash});
      }
    });
  }, [transactions]);

  return null;
};

