import React, { useEffect, useRef } from 'react'
import { makeStyles } from "@material-ui/styles";

import Jazzicon from 'jazzicon'

const useStyles = makeStyles(theme => ({
	identicon: {
    margin: 'auto',
	},
}));


export const Identicon = ({ address, pixelWidth }) => {
	const ref = useRef();
	const classes = useStyles();

	useEffect(() => {
		if (address && ref.current) {
			ref.current.innerHTML = '';
			ref.current.appendChild(Jazzicon(pixelWidth || 16, parseInt(address.slice(2, 10), 16)));
		}
  });

	return <span className={classes.identicon} ref={ref}></span>;
};
