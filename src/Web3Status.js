import React from 'react';
import {
  Chip,
} from '@material-ui/core';
import { makeStyles } from "@material-ui/styles";
import { useWeb3React } from '@web3-react/core'
import jazzicon from 'jazzicon';

import { Identicon } from 'components/Controls/Identicon';

const useStyles = makeStyles(theme => ({
  chip: {
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
    //fontSize: 'smaller',
  },
}));

export const Web3Status = () => {
  const classes = useStyles();
  const { active, account } = useWeb3React();

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
      <Chip
        className={classes.chip}
        label={`${account.substr(0,6)}...${account.substr(38, 4)}`}
        avatar={<Identicon address={account} />}
      />
    </div>
  );
}
