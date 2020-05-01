import React, { useEffect, useRef } from 'react'
import { makeStyles } from "@material-ui/styles";

import Jazzicon from 'jazzicon'

const useStyles = makeStyles(theme => ({
	identicon: {
		height: '1rem',
		width: '1rem',
		marginLeft: 5,
	},
}));


export const Identicon = ({ address }) => {
	const ref = useRef()
	const classes = useStyles();

	useEffect(() => {
		if (address && ref.current) {
			ref.current.innerHTML = ''
			ref.current.appendChild(Jazzicon(16, parseInt(address.slice(2, 10), 16)))
		}
	})

	return <span className={classes.identicon} ref={ref}></span>
};
