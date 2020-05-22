import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormHelperText,
  TextField,
  Typography,
} from '@material-ui/core';
import { makeStyles } from "@material-ui/styles";
import { useForm } from 'react-hooks-useform';
import { useWeb3React } from '@web3-react/core'

import { useWeb3Context } from '../../../../contexts/Web3Context';

import { NETWORKS } from '../../../../constants';
import { useContractByAddress, useHasSigner } from '../../../../lib/web3';
import { ErrorMsg } from '../../../../components/Controls/ErrorMsg';
import { Spinner } from '../../../../components/Controls/Spinner';


const useStyles = makeStyles(theme => ({
  root: {},
    backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

export const ShowWeb3Call = ({ component }) => {
  const classes = useStyles();
  const contract = useContractByAddress(component.address, component.network);
  const hasSigner = useHasSigner();
  const { chainId } = useWeb3React();

  const [result, setResult] = useState();
  const [resultLoading, setResultLoading] = useState(true);
  const [error, setError] = useState(null);

  const func = contract ? contract.interface.functions[component.signature] : undefined;

  useEffect(() => {
    (async () => {
      const args = []; // TODO: component can have default args
        const result = await contract[component.signature](...args);
        setResult(result);
        setResultLoading(false);
    })();
  });

  const componentNetworkId = NETWORKS.find(n => n.id === component.network).chainId;
  const networkMismatch = componentNetworkId !== chainId ? `Connect your wallet to ${component.network}` : undefined;
  const disabled = !!(!contract || networkMismatch );
  const displayResult = result ? <Web3CallResult result={result} /> : null;

  return (
    <Box className={classes.root}>

      { error ? <ErrorMsg message={error} /> : undefined }

      <Typography variant="h5">{ component.title || '' }</Typography>
      <Typography>{ component.description || '' }</Typography>

      <Box flex="rows">
        { displayResult }
        <FormHelperText>
          { networkMismatch }
        </FormHelperText>
      </Box>

    </Box>
  );
};

const Web3CallResult = ({ result }) => {

  return (
    <div>
      { result.toString() }
    </div>
  );
}
