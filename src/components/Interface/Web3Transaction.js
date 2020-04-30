import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
} from '@material-ui/core';
import { makeStyles } from "@material-ui/styles";
import { useForm } from 'react-hooks-useform';

import { useContractByAddress, useHasSigner } from 'lib/web3';
import { Spinner } from 'components/Controls/Spinner';

const useStyles = makeStyles(theme => ({
  root: {},
    backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

export const Web3Transaction = ({ component }) => {
  const classes = useStyles();
  const contract = useContractByAddress(component.address);
  const hasSigner = useHasSigner();

  const [result, setResult] = useState();
  const [resultLoading, setResultLoading] = useState(false);

  const func = contract ? contract.interface.functions[component.signature] : undefined;
  const funcFields = func ? func.inputs.map(i => ({name: i.name, label: i.name, type: 'text'})) : [];
  const [fields, form] = useForm({
    fields: funcFields,
    submit: async (values) => {
      if (func.type === 'call') {

        const args = Object.keys(fields).map(fieldKey => values.get(fieldKey));
        setResultLoading(true);
        const result = await contract[component.signature](...args);
        setResult(result);
        setResultLoading(false);

      } else if (func.type === 'transaction') {

        const args = Object.keys(fields).map(fieldKey => values.get(fieldKey));
        setResultLoading(true);
        const result = await contract[component.signature](...args);

        setResult(result);
        setResultLoading(false);

      }
    },
  });

  const clearForm = () => {
    // TODO actually clear form
    setResult(undefined);
  };

  if (func.type === 'transaction' && !hasSigner) {
    return <div>Web3 signer required...</div>;
  }

  if (!contract) {
    return <div>No web3</div>;
  }

  if (resultLoading) {
    return <Spinner />;
  }

  if (result) {
    return <Web3TxResult signature={component.signature} result={result} onCancel={clearForm} />;
  }

  return (
    <Box className={classes.root}>

      <Typography>{ component.description || '' }</Typography>

      <form.Form>
      <Box flex="rows">
        { Object.keys(fields).map(fieldKey =>
          <TextField {...fields[fieldKey] } key={fieldKey} />
        ) }
        <Button color="primary" type="submit" onClick={form.submit}>{ component.buttonText || 'Send' }</Button>
        </Box>
      </form.Form>

    </Box>
  );
};

const Web3TxResult = ({ result, onCancel }) => {

  return (
    <div>
      Result: { result.toString() }

      <br />

      <Button size="small" onClick={onCancel}>Clear</Button>
    </div>
  );
}
