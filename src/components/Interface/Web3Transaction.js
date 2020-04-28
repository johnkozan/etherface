import React from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
} from '@material-ui/core';
import { makeStyles } from "@material-ui/styles";
import { useForm } from 'react-hooks-useform';

import { useContractByAddress } from 'lib/web3';

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

  const funcFields = contract.interface.functions[component.signature].inputs.map(i => ({name: i.name, label: i.name, type: 'text'}));
  const [fields, form] = useForm({
    fields: funcFields,
    submit: values => {
      const args = Object.keys(fields).map(fieldKey => values.get(fieldKey));
      const result = contract[component.signature](...args);
    },
  });

      //<Backdrop className={classes.backdrop} open={true}>
        //connect web3
      //</Backdrop>

  return (
    <Box className={classes.root}>

      <Typography>{ component.decription || '' }</Typography>

      <form.Form>
      <Box flex="rows">
        { Object.keys(fields).map(fieldKey =>
          <TextField {...fields[fieldKey] } key={fieldKey} />
        ) }
        <Button color="primary" type="submit" onClick={form.submit}>Send</Button>
        </Box>
      </form.Form>


    </Box>
  );
};
