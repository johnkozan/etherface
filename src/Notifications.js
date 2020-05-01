import React from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}


//import { ToastProvider } from 'react-toast-notifications';
  //<div style={{ background: appearance === 'error' ? 'red' : 'green' }}>
    //{children}
//</div>
//
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export const CustomToast = ({ appearance, children, autoDismissTimeout }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
      <Snackbar open={open} autoHideDuration={autoDismissTimeout} onClose={handleClose}>
        <Alert onClose={handleClose} severity={appearance}>
          { children }
        </Alert>
      </Snackbar>
  );
};
