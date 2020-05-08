import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export const CustomToast = ({ appearance, children, autoDismissTimeout }) => {
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
